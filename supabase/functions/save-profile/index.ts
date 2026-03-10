import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Validate US ZIP code */
function isValidZip(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip.trim());
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      email,
      first_name,
      last_name,
      role,
      zip_code,
      preferred_contact,
      avatar_url,
      shopping_for,
      preferred_language,
    } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!first_name?.trim()) errors.first_name = "First name is required";
    if (zip_code && !isValidZip(zip_code)) errors.zip_code = "Invalid ZIP code";
    if (role && !["investor", "family", "founder", "executive", "other"].includes(role)) {
      errors.role = "Invalid role";
    }

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation failed", errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Upsert user profile
    const profileData: Record<string, unknown> = {
      email,
      onboarding_step: "profile_completed",
    };
    if (first_name) profileData.first_name = first_name.trim();
    if (last_name !== undefined) profileData.last_name = last_name?.trim() || null;
    if (role) profileData.role = role;
    if (zip_code) profileData.zip_code = zip_code.trim();
    if (preferred_contact) profileData.preferred_contact = preferred_contact;
    if (avatar_url) profileData.avatar_url = avatar_url;

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .upsert(profileData, { onConflict: "email" })
      .select()
      .single();

    if (profileError) throw new Error(`Profile DB error: ${profileError.message}`);

    // Upsert user preferences
    const prefsData: Record<string, unknown> = { email };
    if (shopping_for) prefsData.shopping_for = shopping_for;
    if (preferred_language) prefsData.preferred_language = preferred_language;

    const { error: prefsError } = await supabase
      .from("user_preferences")
      .upsert(prefsData, { onConflict: "email" });

    if (prefsError) {
      console.error("Preferences error (non-fatal):", prefsError.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profile saved",
        profile,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("save-profile error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Failed to save profile" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
