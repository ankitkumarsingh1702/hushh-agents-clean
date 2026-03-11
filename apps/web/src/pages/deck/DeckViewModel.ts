import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { DeckAgent, DeckState, SwipeAction } from "./DeckModel";
import { getPreviewAgents } from "./DeckModel";
import { supabase } from "../../lib/supabase";
import { useAuthGate } from "../../lib/useAuthGate";

/* ── Analytics: log events to console + localStorage for audit trail ── */
function trackEvent(event: string, data?: Record<string, unknown>) {
  const entry = { event, ...data, ts: new Date().toISOString() };
  console.log(`[analytics] ${event}`, data ?? "");
  try {
    const log: unknown[] = JSON.parse(localStorage.getItem("hushh_analytics_log") || "[]");
    log.push(entry);
    // Keep last 500 events to avoid storage bloat
    if (log.length > 500) log.splice(0, log.length - 500);
    localStorage.setItem("hushh_analytics_log", JSON.stringify(log));
  } catch { /* silent */ }
}

/* ── Fisher-Yates shuffle (client-side double-shuffle for extra randomness) ── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const initial: DeckState = { agents: [], currentIndex: 0, loading: true, error: null, animatingDirection: null };

export function useDeckViewModel() {
  const [state, setState] = useState<DeckState>(initial);
  const navigate = useNavigate();
  const { requireAuth } = useAuthGate();

  useEffect(() => { loadDeck(); }, []);

  async function loadDeck() {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const email = localStorage.getItem("hushh_user_email") || "";
      let agents: DeckAgent[] = [];

      if (email) {
        // Authenticated user — load from API
        const res = await supabase.functions.invoke("get-deck", {
          body: { email },
        });
        if (res.error) {
          throw new Error(res.data?.error || "Failed to load agents");
        }
        agents = res.data?.agents ?? [];
      }

      // Fallback: if no agents from API (unauthenticated or API failure), use preview data
      if (agents.length === 0) {
        agents = getPreviewAgents();
        trackEvent("deck_loaded_preview", { agentCount: agents.length });
      } else {
        trackEvent("deck_loaded", { agentCount: agents.length });
      }

      /* ── Client-side shuffle for extra randomness ── */
      const shuffled = shuffle(agents);
      setState({ agents: shuffled, currentIndex: 0, loading: false, error: null, animatingDirection: null });
    } catch (err: any) {
      // On any error, still try to show preview agents
      const preview = getPreviewAgents();
      if (preview.length > 0) {
        trackEvent("deck_loaded_preview_fallback", { agentCount: preview.length });
        setState({ agents: shuffle(preview), currentIndex: 0, loading: false, error: null, animatingDirection: null });
      } else {
        setState(s => ({ ...s, loading: false, error: err?.message || "Failed to load agents" }));
      }
    }
  }

  const current = state.agents[state.currentIndex] ?? null;

  const recordAction = useCallback(async (action: SwipeAction) => {
    if (!current) return;
    try {
      const email = localStorage.getItem("hushh_user_email") || "";
      if (!email) return; // Don't record actions for unauthenticated users
      await supabase.functions.invoke("save-action", {
        body: { agent_id: current.id, action, email },
      });
    } catch { /* silent */ }
  }, [current]);

  /* ── Free swipe counter for unauthenticated users ── */
  const FREE_SAVES_LIMIT = 3;

  function getFreeSaveCount(): number {
    try { return parseInt(localStorage.getItem("hushh_free_saves") || "0", 10); } catch { return 0; }
  }
  function incrementFreeSaveCount(): void {
    try { localStorage.setItem("hushh_free_saves", String(getFreeSaveCount() + 1)); } catch { /* silent */ }
  }

  /* ── Pass (swipe left) — always free, no auth needed ── */
  const onPass = useCallback(() => {
    if (!current) return;

    trackEvent("deck_pass", { agentId: current.id, agentName: current.name });
    setState(s => ({ ...s, animatingDirection: "left" }));
    recordAction("pass");

    // Override handling: if previously liked, remove from liked list
    try {
      const liked: string[] = JSON.parse(localStorage.getItem("hushh_liked_agents") || "[]");
      if (liked.includes(current.id)) {
        const updated = liked.filter((id: string) => id !== current.id);
        localStorage.setItem("hushh_liked_agents", JSON.stringify(updated));
        window.dispatchEvent(new Event("hushh_liked_update"));
        trackEvent("deck_override", { agentId: current.id, from: "save", to: "pass" });
      }
    } catch { /* silent */ }

    setTimeout(() => {
      setState(s => ({ ...s, currentIndex: s.currentIndex + 1, animatingDirection: null }));
    }, 300);
  }, [current, recordAction, requireAuth]);

  /* ── Save (swipe right / like) — 3 free, then auth required ── */
  const onSave = useCallback(() => {
    if (!current) return;

    // Check if authenticated
    const isAuthed = !!localStorage.getItem("hushh_user_email");
    if (!isAuthed && getFreeSaveCount() >= FREE_SAVES_LIMIT) {
      // Exceeded free saves, require login
      if (!requireAuth()) return;
    }

    // Increment free save count for unauthenticated users
    if (!isAuthed) incrementFreeSaveCount();

    trackEvent("deck_save", { agentId: current.id, agentName: current.name, freeSave: !isAuthed });
    setState(s => ({ ...s, animatingDirection: "right" }));
    recordAction("save");

    // Track liked agents in localStorage for badge count + consistency
    try {
      const liked: string[] = JSON.parse(localStorage.getItem("hushh_liked_agents") || "[]");
      if (!liked.includes(current.id)) liked.push(current.id);
      localStorage.setItem("hushh_liked_agents", JSON.stringify(liked));
      window.dispatchEvent(new Event("hushh_liked_update"));
    } catch { /* silent */ }

    setTimeout(() => {
      setState(s => ({ ...s, currentIndex: s.currentIndex + 1, animatingDirection: null }));
    }, 300);
  }, [current, recordAction, requireAuth]);

  /* ── View Profile — always free, no auth needed ── */
  const onViewProfile = useCallback(() => {
    if (!current) return;

    trackEvent("deck_view_profile", { agentId: current.id, agentName: current.name });
    recordAction("view");
    navigate(`/agents/${current.id}`);
  }, [current, navigate, recordAction]);

  /* ── Shuffle & Start Over: reshuffle all agents, reset index ── */
  const onStartOver = useCallback(() => {
    trackEvent("deck_reshuffle", { agentCount: state.agents.length });
    setState(s => ({
      ...s,
      agents: shuffle(s.agents),
      currentIndex: 0,
      animatingDirection: null,
    }));
  }, [state.agents.length]);

  /* ── Retry: reload from API ── */
  const onRetry = useCallback(() => {
    loadDeck();
  }, []);

  const deckExhausted = !state.loading && state.currentIndex >= state.agents.length && state.agents.length > 0;

  return { ...state, current, deckExhausted, onPass, onSave, onViewProfile, onStartOver, onRetry };
}
