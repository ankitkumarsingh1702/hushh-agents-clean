import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAgentCards,
  getCityInfo,
  getTrustBadges,
  getHeroContent,
} from "./LandingModel";

/** ViewModel hook — connects Model data to the View (no backend) */
export function useLandingViewModel() {
  const navigate = useNavigate();
  const agentCards = useMemo(() => getAgentCards(), []);
  const cityInfo = useMemo(() => getCityInfo(), []);
  const trustBadges = useMemo(() => getTrustBadges(), []);
  const heroContent = useMemo(() => getHeroContent(), []);

  const onCreateAccount = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const onLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return {
    agentCards,
    cityInfo,
    trustBadges,
    heroContent,
    onCreateAccount,
    onLogin,
  };
}
