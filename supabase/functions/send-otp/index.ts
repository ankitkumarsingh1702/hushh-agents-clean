import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Base64url encode */
function base64url(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Import PEM private key for signing */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemBody = pem.replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("pkcs8", binaryDer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
}

/** Create a signed JWT for Google OAuth2 */
async function createGoogleJWT(serviceAccountEmail: string, privateKey: string, impersonateEmail: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccountEmail,
    sub: impersonateEmail,
    scope: "https://www.googleapis.com/auth/gmail.send",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64url(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await importPrivateKey(privateKey);
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput))
  );

  return `${signingInput}.${base64url(signature)}`;
}

/** Get Google OAuth2 access token using JWT */
async function getAccessToken(jwt: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

/** Send email via Gmail API */
async function sendEmail(accessToken: string, from: string, to: string, subject: string, body: string) {
  const rawEmail = [
    `From: Hushh Agents <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    "",
    body,
  ].join("\r\n");

  const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gmail API error: ${err}`);
  }
  return res.json();
}

/** Generate 6-digit OTP */
function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Beautiful OTP email HTML */
function otpEmailHTML(otp: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
      <div style="padding: 40px 32px; text-align: center;">
        <div style="width: 48px; height: 48px; background: #ff5864; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <span style="color: #0a0a0a; font-weight: 900; font-size: 24px;">H</span>
        </div>
        <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px;">Your Verification Code</h1>
        <p style="color: #999; font-size: 14px; margin: 0 0 32px;">Enter this code to sign in to Hushh Agents</p>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ff5864; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 12px; margin: 0;">This code expires in 10 minutes. Don't share it with anyone.</p>
      </div>
      <div style="background: #111; padding: 16px 32px; text-align: center; border-top: 1px solid #222;">
        <p style="color: #444; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Hushh Agents · Kirkland, WA</p>
      </div>
    </div>
  `;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get secrets
    const SA_EMAIL = Deno.env.get("GOOGLE_SA_EMAIL")!;
    const SA_PRIVATE_KEY = Deno.env.get("GOOGLE_SA_PRIVATE_KEY")!;
    const SENDER_EMAIL = Deno.env.get("GMAIL_SENDER_EMAIL") || "ankit@hushh.ai";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    // Store OTP in DB
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Delete old OTPs for this email
    await supabase.from("otp_codes").delete().eq("email", email);
    
    // Insert new OTP
    const { error: dbError } = await supabase.from("otp_codes").insert({
      email,
      otp_code: otp,
      expires_at: expiresAt,
      verified: false,
    });

    if (dbError) throw new Error(`DB error: ${dbError.message}`);

    // Send email via Gmail API with Domain-wide Delegation
    const jwt = await createGoogleJWT(SA_EMAIL, SA_PRIVATE_KEY, SENDER_EMAIL);
    const accessToken = await getAccessToken(jwt);
    await sendEmail(
      accessToken,
      SENDER_EMAIL,
      email,
      "Your Hushh Agents Verification Code",
      otpEmailHTML(otp)
    );

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-otp error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send OTP" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
