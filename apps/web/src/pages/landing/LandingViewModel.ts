import { useMemo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import {
  getAgentCards,
  getCityInfo,
  getTrustBadges,
  getHeroContent,
} from "./LandingModel";

/** ViewModel hook — connects Model data + backend config to the View */
export function useLandingViewModel() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);

  const agentCards = useMemo(() => getAgentCards(), []);
  const cityInfo = useMemo(() => getCityInfo(), []);
  const trustBadges = useMemo(() => getTrustBadges(), []);
  const heroContent = useMemo(() => getHeroContent(), []);

  // S1: Load public config + fire landing_view analytics
  useEffect(() => {
    api.config.getPublic().then((c) => setConfig(c as Record<string, unknown>)).catch(() => {});
    api.analytics.track("landing_view");
  }, []);

  const onCreateAccount = useCallback(() => {
    api.analytics.track("cta_continue_clicked");
    navigate("/login");
  }, [navigate]);

  const onLogin = useCallback(() => {
    api.analytics.track("login_clicked");
    navigate("/login");
  }, [navigate]);

  return {
    agentCards,
    cityInfo,
    trustBadges,
    heroContent,
    config,
    onCreateAccount,
    onLogin,
  };
}
