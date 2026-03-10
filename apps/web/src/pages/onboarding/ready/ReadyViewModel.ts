import { useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReadyContent } from "./ReadyModel";

function trackEvent(event: string, data?: Record<string, unknown>) {
  console.log(`[analytics] ${event}`, data ?? "");
}

export function useReadyViewModel() {
  const navigate = useNavigate();
  const content = useMemo(() => getReadyContent(), []);

  useEffect(() => {
    trackEvent("screen_view_ready");
    // Prefetch placeholder — in real app, this would prefetch first 10-20 agent cards
    trackEvent("deck_prefetch_started");
  }, []);

  /** Start discovering — go to deck */
  const onStart = useCallback(() => {
    trackEvent("discovery_started");
    navigate("/deck");
  }, [navigate]);

  /** Review preferences — go back to profile/goals edit */
  const onReview = useCallback(() => {
    trackEvent("preferences_review_tapped");
    navigate("/onboarding/goals");
  }, [navigate]);

  return {
    content,
    onStart,
    onReview,
  };
}
