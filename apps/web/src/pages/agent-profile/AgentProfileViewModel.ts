/* ── Agent Profile ViewModel ── */

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { AgentProfileState } from "./AgentProfileModel";
import { supabase } from "../../lib/supabase";
import { getPreviewAgents } from "../deck/DeckModel";

function trackEvent(event: string, data?: Record<string, unknown>) {
  console.log(`[analytics] ${event}`, data ?? "");
}

export function useAgentProfileViewModel() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<AgentProfileState>({
    agent: null, loading: true, error: null, saved: false, connectRequested: false, reported: false,
  });

  useEffect(() => {
    if (agentId) {
      loadAgent(agentId);
      trackEvent("profile_opened", { agentId });
    }
  }, [agentId]);

  async function loadAgent(id: string) {
    setState(s => ({ ...s, loading: true }));
    try {
      const email = localStorage.getItem("hushh_user_email") || "";
      let found = null;

      if (email) {
        // Authenticated: try API first
        try {
          const res = await supabase.functions.invoke("get-deck", { body: { email } });
          const agents = res.data?.agents ?? [];
          found = agents.find((a: { id: string }) => a.id === id) ?? null;
          if (!found) {
            const res2 = await supabase.functions.invoke("get-shortlisted", { body: { email } });
            found = (res2.data?.agents ?? []).find((a: { id: string }) => a.id === id) ?? null;
          }
        } catch { /* fall through to preview */ }
      }

      // Fallback: check preview agents (works for unauthenticated users)
      if (!found) {
        found = getPreviewAgents().find(a => a.id === id) ?? null;
      }

      setState({
        agent: found, loading: false,
        error: found ? null : "Agent not found",
        saved: false, connectRequested: false, reported: false,
      });
    } catch {
      // Last resort: try preview agents
      const found = getPreviewAgents().find(a => a.id === id) ?? null;
      setState({
        agent: found, loading: false,
        error: found ? null : "Failed to load agent",
        saved: false, connectRequested: false, reported: false,
      });
    }
  }

  const onSave = useCallback(async () => {
    if (!state.agent) return;
    trackEvent("save_clicked", { agentId: state.agent.id });
    try {
      await supabase.functions.invoke("save-action", {
        body: { agent_id: state.agent.id, action: "save" },
        
      });
      setState(s => ({ ...s, saved: true }));
    } catch { /* silent */ }
  }, [state.agent]);

  const onConnect = useCallback(async () => {
    if (!state.agent) return;
    trackEvent("connect_clicked", { agentId: state.agent.id });
    try {
      await supabase.functions.invoke("save-action", {
        body: { agent_id: state.agent.id, action: "contact_request" },
        
      });
      setState(s => ({ ...s, connectRequested: true }));
    } catch { /* silent */ }
  }, [state.agent]);

  const onReport = useCallback(async () => {
    if (!state.agent) return;
    trackEvent("report_clicked", { agentId: state.agent.id });
    try {
      await supabase.functions.invoke("save-action", {
        body: { agent_id: state.agent.id, action: "report" },
        
      });
      setState(s => ({ ...s, reported: true }));
    } catch { /* silent */ }
  }, [state.agent]);

  const onBack = useCallback(() => navigate(-1), [navigate]);

  return { ...state, onSave, onConnect, onReport, onBack };
}
