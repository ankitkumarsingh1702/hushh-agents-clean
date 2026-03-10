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

  /** Continue → next onboarding step (S5 Profile Setup) */
  const onContinue = useCallback(() => {
    trackEvent("continue_welcome");
    trackEvent("consent_accepted", { policy_version: "1.0" });

    // TODO: POST /consents API call here
    // For now, navigate to next step
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
