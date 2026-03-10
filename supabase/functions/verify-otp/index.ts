import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: "Email and OTP are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find the OTP record
    const { data, error: fetchError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otp)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !data) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP code" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      // Clean up expired OTP
      await supabase.from("otp_codes").delete().eq("id", data.id);
      return new Response(
        JSON.stringify({ error: "OTP has expired. Please request a new one." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as verified
    await supabase.from("otp_codes").update({ verified: true }).eq("id", data.id);

    // Clean up old OTPs for this email
    await supabase.from("otp_codes").delete().eq("email", email).neq("id", data.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP verified successfully",
        email: data.email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("verify-otp error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
