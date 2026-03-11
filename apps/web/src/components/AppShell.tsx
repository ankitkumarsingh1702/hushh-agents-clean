/* ── App Shell — Hinge-style Bottom Tab Navigation ── */

import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthGate } from "../lib/useAuthGate";

/* ── SVG Tab Icons — solid fill style matching Hinge ── */
function SwipeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      {/* flame / fire icon for "Swipe" */}
      <path
        d="M12 2c.3 2.5.7 4.2 2 6 1.2 1.7 2 3.4 2 5.5 0 3-2.2 5.5-5 5.5S6 16.5 6 13.5c0-2.1.8-3.8 2-5.5.6-.8 1-1.6 1.3-2.5.2-.7.4-1.4.5-2 .1-.5.1-1 .2-1.5z"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 1 : 0}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {active && (
        <path
          d="M12 19c1.4 0 2.5-1.1 2.5-2.5 0-1-.5-1.8-1.2-2.5-.4-.4-.8-.7-1.3-1-.5.3-.9.6-1.3 1-.7.7-1.2 1.5-1.2 2.5 0 1.4 1.1 2.5 2.5 2.5z"
          fill="black"
          fillOpacity="0.3"
        />
      )}
    </svg>
  );
}

function ExploreIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.15 : 0}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.8 : 0}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LikesIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {active && (
        <>
          <circle cx="9" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="8"
        r="4"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.3 : 0}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5.5 21c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.15 : 0}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TAB_ICONS: Record<string, React.FC<{ active: boolean }>> = {
  "/deck": SwipeIcon,
  "/shortlisted": LikesIcon,
  "/messages": ChatIcon,
  "/leads": ExploreIcon,
  "/me": ProfileIcon,
};

const tabs = [
  { label: "Swipe", path: "/deck" },
  { label: "Explore", path: "/leads" },
  { label: "Likes", path: "/shortlisted" },
  { label: "Chat", path: "/messages" },
  { label: "Profile", path: "/me" },
];

/* ── Tabs that require authentication ── */
const AUTH_REQUIRED_TABS = new Set(["/shortlisted", "/messages", "/leads", "/me"]);

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { requireAuth } = useAuthGate();

  /* ── Badge count for Likes tab ── */
  const [likedCount, setLikedCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hushh_liked_agents") || "[]").length; } catch { return 0; }
  });

  useEffect(() => {
    const handler = () => {
      try { setLikedCount(JSON.parse(localStorage.getItem("hushh_liked_agents") || "[]").length); } catch { /* */ }
    };
    window.addEventListener("hushh_liked_update", handler);
    return () => window.removeEventListener("hushh_liked_update", handler);
  }, []);

  // Hide bottom tabs on full-screen pages (chat thread, agent profile)
  const hideTabPaths = ["/messages/", "/agents/"];
  const shouldHideTabs = hideTabPaths.some(p => location.pathname.startsWith(p) && location.pathname !== p.replace("/", ""));

  return (
    <div className="relative min-h-screen bg-black text-white font-sans antialiased">
      {/* Content area — full bleed, no horizontal padding (pages own their padding) */}
      <div className="mx-auto w-full max-w-lg min-h-screen">
        <Outlet />
      </div>

      {/* ── Bottom Tab Bar — Hinge-style rounded capsule nav ── */}
      {!shouldHideTabs && (
        <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe">
          {/* Outer container with padding for the floating pill */}
          <div className="px-3 pb-2 max-w-lg mx-auto">
            {/* Rounded capsule nav bar */}
            <div className="flex items-center justify-around bg-[#1a1a1a] border border-white/[0.08] rounded-[28px] h-[62px] px-1 shadow-[0_-2px_20px_rgba(0,0,0,0.5)]">
              {tabs.map(tab => {
                const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path + "/");
                const IconComp = TAB_ICONS[tab.path];
                return (
                  <button
                    key={tab.path}
                    onClick={() => {
                      // Auth gate: require login for non-Swipe tabs
                      if (AUTH_REQUIRED_TABS.has(tab.path) && !requireAuth()) return;
                      navigate(tab.path);
                    }}
                    className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] rounded-[20px] transition-all ${
                      isActive
                        ? "text-white bg-white/[0.1]"
                        : "text-white/35 hover:text-white/50"
                    }`}
                  >
                    <div className="relative">
                      {IconComp && <IconComp active={isActive} />}
                      {/* Badge count for Likes tab — red like Hinge */}
                      {tab.path === "/shortlisted" && likedCount > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                          {likedCount > 99 ? "99+" : likedCount}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] mt-0.5 ${isActive ? "font-semibold" : "font-medium"}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
