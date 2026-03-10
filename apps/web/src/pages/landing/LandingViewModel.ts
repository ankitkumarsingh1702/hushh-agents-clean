import { useMemo, useCallback } from "react";
import {
  getAgentCards,
  getCityInfo,
  getTrustBadges,
  getHeroContent,
} from "./LandingModel";

/** ViewModel hook — connects Model data to the View (no backend) */
export function useLandingViewModel() {
  const agentCards = useMemo(() => getAgentCards(), []);
  const cityInfo = useMemo(() => getCityInfo(), []);
  const trustBadges = useMemo(() => getTrustBadges(), []);
  const heroContent = useMemo(() => getHeroContent(), []);

  const onCreateAccount = useCallback(() => {
    console.log("Create account clicked");
  }, []);

  const onLogin = useCallback(() => {
    console.log("Login clicked");
  }, []);

  return {
    agentCards,
    cityInfo,
    trustBadges,
    heroContent,
    onCreateAccount,
    onLogin,
  };
}
