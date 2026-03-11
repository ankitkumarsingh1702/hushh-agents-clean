/* ── Auth Gate Hook ── Check auth, redirect to login if needed ── */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Returns auth helpers:
 * - `isAuthenticated`: true if user has email stored in localStorage
 * - `requireAuth()`: checks auth, navigates to /login/email if not authenticated, returns boolean
 */
export function useAuthGate() {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("hushh_user_email");

  const requireAuth = useCallback((): boolean => {
    const email = localStorage.getItem("hushh_user_email");
    if (!email) {
      navigate("/login/email", { replace: true });
      return false;
    }
    return true;
  }, [navigate]);

  return { isAuthenticated, requireAuth };
}
