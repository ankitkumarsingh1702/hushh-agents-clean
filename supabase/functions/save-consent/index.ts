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
    const { email, policy_version, consent_types, device_id } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Extract metadata from request
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Default consent types if not provided
    const types = consent_types || ["terms", "privacy", "messaging"];
    const version = policy_version || "1.0";

    // Insert consent records (immutable — always INSERT, never UPDATE)
    const consentRecords = types.map((type: string) => ({
      email,
      consent_type: type,
      policy_version: version,
      ip_address: ip,
      user_agent: userAgent,
      device_id: device_id || null,
    }));

    const { error: consentError } = await supabase
      .from("consents")
      .insert(consentRecords);

    if (consentError) throw new Error(`Consent DB error: ${consentError.message}`);

    // Upsert user profile to mark onboarding step
    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert(
        {
          email,
          onboarding_step: "trust_completed",
          last_login_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (profileError) throw new Error(`Profile DB error: ${profileError.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Consent recorded",
        consents_saved: types.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("save-consent error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Failed to save consent" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
