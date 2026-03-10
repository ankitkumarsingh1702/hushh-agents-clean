import { useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWelcomeContent,
  getPromiseCards,
  getHouseRules,
} from "./WelcomeModel";

/** Simple analytics stub */
function trackEvent(event: string, data?: Record<string, unknown>) {
  console.log(`[analytics] ${event}`, data ?? "");
}

export function useWelcomeViewModel() {
  const navigate = useNavigate();
  const content = useMemo(() => getWelcomeContent(), []);
  const promiseCards = useMemo(() => getPromiseCards(), []);
  const houseRules = useMemo(() => getHouseRules(), []);

  // Analytics: screen view on mount
  useEffect(() => {
    trackEvent("screen_view_welcome");
    trackEvent("consent_viewed");
  }, []);

  /** Continue → save consent then navigate to S5 Profile Setup */
  const onContinue = useCallback(async () => {
    trackEvent("continue_welcome");
    trackEvent("consent_accepted", { policy_version: "1.0" });

    // Get email from localStorage (set during login flow)
    const email = localStorage.getItem("hushh_user_email") || "";

    // POST /consents
    try {
      await fetch("https://gsqmwxqgqrgzhlhmbscg.supabase.co/functions/v1/save-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          policy_version: "1.0",
          consent_types: ["terms", "privacy", "messaging"],
        }),
      });
    } catch (err) {
      console.error("Consent save failed (non-blocking):", err);
    }

    navigate("/onboarding/profile");
  }, [navigate]);

  /** Review terms */
  const onReviewTerms = useCallback(() => {
    // TODO: Open terms modal or page
    console.log("Review terms clicked");
  }, []);

  return {
    content,
    promiseCards,
    houseRules,
    onContinue,
    onReviewTerms,
  };
}
