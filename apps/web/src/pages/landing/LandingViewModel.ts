import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAgentCards,
  getCityInfo,
  getTrustChips,
  getHeroContent,
} from "./LandingModel";

/** ViewModel hook — connects Model data to the View (no backend) */
export function useLandingViewModel() {
  const navigate = useNavigate();
  const agentCards = useMemo(() => getAgentCards(), []);
  const cityInfo = useMemo(() => getCityInfo(), []);
  const trustChips = useMemo(() => getTrustChips(), []);
  const heroContent = useMemo(() => getHeroContent(), []);

  const onContinue = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const onLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const onBrowseProfiles = useCallback(() => {
    // TODO: Navigate to sample profiles page
    console.log("Browse sample profiles clicked");
  }, []);

  return {
    agentCards,
    cityInfo,
    trustChips,
    heroContent,
    onContinue,
    onLogin,
    onBrowseProfiles,
  };
}
