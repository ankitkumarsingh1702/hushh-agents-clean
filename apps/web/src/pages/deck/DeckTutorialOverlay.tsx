/* ── Deck Tutorial Overlay v2 ── Premium walkthrough with real cutout spotlight ── */

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";

const STORAGE_KEY = "hushh_deck_tutorial_seen";

/* ═══════════════════════════════════════════
   Monotone filled SVG icons for tooltip cards
   ═══════════════════════════════════════════ */
function SwipeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 2a2 2 0 00-2 2v7.586L5.707 9.293a2 2 0 00-2.828 2.828l6.364 6.364A6 6 0 0013.485 20H15a5 5 0 005-5v-4a2 2 0 10-4 0v-1a2 2 0 10-4 0V4a2 2 0 00-2-2z" />
    </svg>
  );
}
function XCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2.12 6.47a.75.75 0 011.06 0L12 9.53l1.06-1.06a.75.75 0 111.06 1.06L13.06 10.59l1.06 1.06a.75.75 0 11-1.06 1.06L12 11.65l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06-1.06-1.06a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  );
}
function HeartFillIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
function UserProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4a4 4 0 100 8 4 4 0 000-8zm-6 14a6 6 0 1112 0H6z" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm3 7a1 1 0 011-1h10a1 1 0 110 2H7a1 1 0 01-1-1zm3 7a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Gesture hand SVG (white, filled)
   ═══════════════════════════════════════════ */
function GestureHand({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}>
      <path d="M10 2a2 2 0 00-2 2v7.586L5.707 9.293a2 2 0 00-2.828 2.828l6.364 6.364A6 6 0 0013.485 20H15a5 5 0 005-5v-4a2 2 0 10-4 0v-1a2 2 0 10-4 0V4a2 2 0 00-2-2z" opacity="0.95" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Tutorial Step Definitions
   ═══════════════════════════════════════════ */
interface TutorialStep {
  icon: ReactNode;
  title: string;
  description: string;
  target: string; // data-tutorial-target value
  gesture: "swipe" | "tap-left" | "tap-right" | "tap-up" | "tap-top";
  accentColor: string;
}

const STEPS: TutorialStep[] = [
  {
    icon: <SwipeIcon />,
    title: "Discover Advisors",
    description: "Browse through curated advisor profiles. Each card shows their specialty, rating, and availability.",
    target: "card",
    gesture: "swipe",
    accentColor: "#4ade80",
  },
  {
    icon: <XCircleIcon />,
    title: "Not a match? Pass.",
    description: "Tap the ✕ button to skip this advisor and see the next one.",
    target: "pass",
    gesture: "tap-left",
    accentColor: "#f87171",
  },
  {
    icon: <HeartFillIcon />,
    title: "Found a fit? Save!",
    description: "Tap the heart to shortlist this advisor. Review all saved advisors in your Likes tab.",
    target: "like",
    gesture: "tap-right",
    accentColor: "#4ade80",
  },
  {
    icon: <UserProfileIcon />,
    title: "View Full Profile",
    description: "Tap the arrow to see detailed info, reviews, services & request a quote.",
    target: "profile",
    gesture: "tap-up",
    accentColor: "#60a5fa",
  },
  {
    icon: <FilterIcon />,
    title: "Filter & Sort",
    description: "Use filters to narrow down by specialty, rating, response time, and availability.",
    target: "filters",
    gesture: "tap-top",
    accentColor: "#a78bfa",
  },
];

/* ═══════════════════════════════════════════
   Spotlight Rect Type
   ═══════════════════════════════════════════ */
interface SpotRect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number; // border-radius
}

function getTargetRect(target: string): SpotRect | null {
  const el = document.querySelector(`[data-tutorial-target="${target}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const pad = target === "card" ? 4 : 6;
  return {
    x: rect.left - pad,
    y: rect.top - pad,
    w: rect.width + pad * 2,
    h: rect.height + pad * 2,
    r: target === "card" ? 18 : target === "filters" ? 12 : rect.width > 50 ? 999 : 999,
  };
}

/* ═══════════════════════════════════════════
   Tooltip Position Calculator
   ═══════════════════════════════════════════ */
function getTooltipStyle(spot: SpotRect | null, target: string): React.CSSProperties {
  if (!spot) return { bottom: "20%", left: "16px", right: "16px" };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const style: React.CSSProperties = { left: 16, right: 16, position: "absolute" };

  if (target === "card") {
    // Below card
    style.top = Math.min(spot.y + spot.h + 16, vh - 200);
  } else if (target === "filters") {
    // Below filter button
    style.top = spot.y + spot.h + 16;
  } else if (target === "pass" || target === "like") {
    // Above buttons
    style.bottom = vh - spot.y + 16;
  } else if (target === "profile") {
    // Above profile button
    style.bottom = vh - spot.y + 16;
  }
  return style;
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function DeckTutorialOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [spot, setSpot] = useState<SpotRect | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const prevSpotRef = useRef<SpotRect | null>(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;
  const progress = ((step + 1) / STEPS.length) * 100;

  /* ── Measure target element position ── */
  const measureTarget = useCallback(() => {
    const rect = getTargetRect(STEPS[step].target);
    if (rect) {
      prevSpotRef.current = spot;
      setSpot(rect);
    }
  }, [step]);

  useEffect(() => {
    // Fade in + measure
    const timer = setTimeout(() => {
      setVisible(true);
      measureTarget();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    measureTarget();
    // Re-measure on resize
    window.addEventListener("resize", measureTarget);
    return () => window.removeEventListener("resize", measureTarget);
  }, [step, measureTarget]);

  /* ── Haptic feedback ── */
  const haptic = (pattern: number | number[] = 8) => {
    try { navigator.vibrate?.(pattern); } catch { /* ignore */ }
  };

  /* ── Navigation ── */
  const handleNext = () => {
    if (transitioning || celebrating) return;
    haptic();

    if (isLast) {
      // Celebration then exit
      setCelebrating(true);
      haptic([15, 30, 15, 30, 15]);
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, "true");
        setVisible(false);
        setTimeout(onComplete, 350);
      }, 1200);
    } else {
      setTransitioning(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setTransitioning(false);
      }, 250);
    }
  };

  const handleBack = () => {
    if (transitioning || isFirst) return;
    haptic();
    setTransitioning(true);
    setTimeout(() => {
      setStep(s => s - 1);
      setTransitioning(false);
    }, 250);
  };

  const handleSkip = () => {
    haptic();
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    setTimeout(onComplete, 350);
  };

  /* ── SVG mask for cutout ── */
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-350 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={handleNext}
    >
      {/* ═══════════════════════════════════════
          SVG MASK — Real cutout spotlight
          ═══════════════════════════════════════ */}
      <svg className="absolute inset-0 w-full h-full" style={{ transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <defs>
          <mask id="tutorial-mask">
            {/* White = visible (dark overlay shows) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black = transparent hole (real UI shows through) */}
            {spot && (
              <rect
                x={spot.x}
                y={spot.y}
                width={spot.w}
                height={spot.h}
                rx={spot.r}
                ry={spot.r}
                fill="black"
                style={{ transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              />
            )}
          </mask>
        </defs>
        {/* Dark overlay with cutout hole */}
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.82)"
          mask="url(#tutorial-mask)"
        />
      </svg>

      {/* ═══════════════════════════════════════
          SPOTLIGHT GLOW RING — around cutout
          ═══════════════════════════════════════ */}
      {spot && (
        <div
          className="absolute pointer-events-none animate-spotlight-pulse"
          style={{
            left: spot.x - 2,
            top: spot.y - 2,
            width: spot.w + 4,
            height: spot.h + 4,
            borderRadius: spot.r + 2,
            boxShadow: `0 0 0 2px ${current.accentColor}80, 0 0 20px ${current.accentColor}30, 0 0 40px ${current.accentColor}10`,
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      )}

      {/* ═══════════════════════════════════════
          GESTURE ANIMATIONS — Step-specific
          ═══════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {spot && !transitioning && !celebrating && (
          <>
            {current.gesture === "swipe" && (
              <div
                className="absolute animate-gesture-swipe"
                style={{
                  left: spot.x + spot.w / 2 - 16,
                  top: spot.y + spot.h * 0.45,
                  transition: "left 0.5s, top 0.5s",
                }}
              >
                <GestureHand size={36} />
              </div>
            )}
            {current.gesture === "tap-left" && (
              <div
                className="absolute animate-gesture-tap-bounce"
                style={{
                  left: spot.x + spot.w / 2 - 14,
                  top: spot.y - 36,
                  transition: "left 0.5s, top 0.5s",
                }}
              >
                <GestureHand size={30} />
              </div>
            )}
            {current.gesture === "tap-right" && (
              <div
                className="absolute animate-gesture-tap-bounce"
                style={{
                  left: spot.x + spot.w / 2 - 14,
                  top: spot.y - 36,
                  transition: "left 0.5s, top 0.5s",
                }}
              >
                <GestureHand size={30} />
              </div>
            )}
            {current.gesture === "tap-up" && (
              <div
                className="absolute animate-gesture-swipe-up"
                style={{
                  left: spot.x + spot.w / 2 - 12,
                  top: spot.y + spot.h + 8,
                  transition: "left 0.5s, top 0.5s",
                }}
              >
                <GestureHand size={26} />
              </div>
            )}
            {current.gesture === "tap-top" && (
              <div
                className="absolute animate-gesture-tap-bounce"
                style={{
                  left: spot.x + spot.w / 2 - 12,
                  top: spot.y + spot.h + 8,
                  transition: "left 0.5s, top 0.5s",
                }}
              >
                <GestureHand size={26} />
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════
          PROGRESS BAR — top edge
          ═══════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-20">
        <div
          className="h-full transition-all duration-600 ease-out"
          style={{ width: `${progress}%`, background: current.accentColor }}
        />
      </div>

      {/* ═══════════════════════════════════════
          HEADER — Step counter + Skip
          ═══════════════════════════════════════ */}
      <div className="absolute top-3 left-4 text-white/40 text-[11px] font-medium z-20">
        {step + 1} / {STEPS.length}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); handleSkip(); }}
        className="absolute top-3 right-4 text-white/40 text-[11px] font-medium px-3 py-1 rounded-full border border-white/15 hover:text-white/70 hover:border-white/30 transition-colors z-20"
      >
        Skip
      </button>

      {/* ═══════════════════════════════════════
          TOOLTIP CARD — Spring bounce entry
          ═══════════════════════════════════════ */}
      <div
        className={`z-20 max-w-sm mx-auto transition-all duration-400 ${
          transitioning
            ? "opacity-0 scale-90 translate-y-3"
            : "opacity-100 scale-100 translate-y-0"
        }`}
        style={{
          ...getTooltipStyle(spot, current.target),
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-white/[0.97] backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl"
          style={{
            borderTop: `3px solid ${current.accentColor}`,
          }}
        >
          {/* Icon circle with step badge + Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${current.accentColor}15`, color: current.accentColor }}
              >
                {current.icon}
              </div>
              {/* Step number badge */}
              <span
                className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                style={{ background: current.accentColor }}
              >
                {step + 1}
              </span>
            </div>
            <h3 className="text-gray-900 text-[17px] font-bold font-serif leading-tight">{current.title}</h3>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-[13px] leading-relaxed mb-4 pl-[52px]">
            {current.description}
          </p>

          {/* Action row */}
          <div className="flex items-center justify-between">
            {/* Left: Back button or progress dots */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleBack(); }}
                  className="text-gray-400 text-[12px] font-medium hover:text-gray-600 transition-colors mr-1"
                >
                  ← Back
                </button>
              )}
              {/* Progress dots */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? 18 : 6,
                      height: 6,
                      background: i === step ? current.accentColor : i < step ? `${current.accentColor}80` : "#d1d5db",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: Next / Let's Go button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="text-white text-[13px] font-semibold px-5 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-1.5"
              style={{ background: current.accentColor }}
            >
              {isLast ? "Let's Go!" : "Next"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CELEBRATION OVERLAY — on completion
          ═══════════════════════════════════════ */}
      {celebrating && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="animate-celebrate-pop text-center">
            <div className="text-5xl mb-3 animate-celebrate-bounce">✨</div>
            <h2 className="text-white text-2xl font-bold font-serif">You're all set!</h2>
            <p className="text-white/60 text-sm mt-1">Start discovering your perfect advisor</p>
          </div>
          {/* Sparkle particles */}
          <div className="absolute animate-sparkle-1" style={{ top: "35%", left: "20%" }}>
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="absolute animate-sparkle-2" style={{ top: "30%", right: "25%" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
          </div>
          <div className="absolute animate-sparkle-3" style={{ top: "45%", left: "70%" }}>
            <div className="w-2 h-2 rounded-full bg-blue-400" />
          </div>
          <div className="absolute animate-sparkle-4" style={{ top: "55%", left: "30%" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAP HINT — bottom
          ═══════════════════════════════════════ */}
      {!celebrating && (
        <div className="absolute bottom-5 left-0 right-0 text-center z-20 animate-hint-pulse">
          <div className="inline-flex items-center gap-1 text-white/25 text-[11px]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="animate-bounce-subtle">
              <path d="M12 8l-6 6h12l-6-6z" />
            </svg>
            Tap to continue
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          CSS ANIMATIONS
          ═══════════════════════════════════════ */}
      <style>{`
        /* ── Spotlight pulse ── */
        @keyframes spotlightPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-spotlight-pulse {
          animation: spotlightPulse 2s ease-in-out infinite;
        }

        /* ── Gesture: Swipe left-right with card tilt ── */
        @keyframes gestureSwipe {
          0%   { transform: translateX(0) rotate(0deg); opacity: 0.3; }
          15%  { opacity: 1; }
          30%  { transform: translateX(-45px) rotate(-12deg); opacity: 1; }
          50%  { transform: translateX(0) rotate(0deg); opacity: 0.8; }
          70%  { transform: translateX(45px) rotate(12deg); opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(0) rotate(0deg); opacity: 0.3; }
        }
        .animate-gesture-swipe {
          animation: gestureSwipe 2.8s ease-in-out infinite;
        }

        /* ── Gesture: Tap with bounce ── */
        @keyframes gestureTapBounce {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          20% { transform: translateY(-8px) scale(1); opacity: 1; }
          40% { transform: translateY(2px) scale(0.85); opacity: 1; }
          55% { transform: translateY(-3px) scale(1.1); opacity: 1; }
          70% { transform: translateY(0) scale(1); opacity: 0.8; }
        }
        .animate-gesture-tap-bounce {
          animation: gestureTapBounce 1.6s ease-in-out infinite;
        }

        /* ── Gesture: Swipe up ── */
        @keyframes gestureSwipeUp {
          0%   { transform: translateY(0); opacity: 0.3; }
          20%  { transform: translateY(0); opacity: 1; }
          60%  { transform: translateY(-35px); opacity: 1; }
          80%  { transform: translateY(-45px); opacity: 0.5; }
          100% { transform: translateY(-50px); opacity: 0; }
        }
        .animate-gesture-swipe-up {
          animation: gestureSwipeUp 1.8s ease-out infinite;
        }

        /* ── Celebration pop ── */
        @keyframes celebratePop {
          0%   { transform: scale(0.3); opacity: 0; }
          50%  { transform: scale(1.1); opacity: 1; }
          70%  { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-celebrate-pop {
          animation: celebratePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* ── Celebration bounce ── */
        @keyframes celebrateBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(-5deg); }
          50% { transform: translateY(0) rotate(5deg); }
          75% { transform: translateY(-6px) rotate(-3deg); }
        }
        .animate-celebrate-bounce {
          animation: celebrateBounce 1s ease-in-out infinite;
        }

        /* ── Sparkle particles ── */
        @keyframes sparkle1 {
          0%   { transform: translate(0, 0) scale(0); opacity: 0; }
          30%  { transform: translate(-30px, -40px) scale(1.5); opacity: 1; }
          100% { transform: translate(-60px, -80px) scale(0); opacity: 0; }
        }
        @keyframes sparkle2 {
          0%   { transform: translate(0, 0) scale(0); opacity: 0; }
          35%  { transform: translate(25px, -50px) scale(1.3); opacity: 1; }
          100% { transform: translate(50px, -90px) scale(0); opacity: 0; }
        }
        @keyframes sparkle3 {
          0%   { transform: translate(0, 0) scale(0); opacity: 0; }
          40%  { transform: translate(20px, 30px) scale(1.4); opacity: 1; }
          100% { transform: translate(40px, 60px) scale(0); opacity: 0; }
        }
        @keyframes sparkle4 {
          0%   { transform: translate(0, 0) scale(0); opacity: 0; }
          25%  { transform: translate(-35px, 20px) scale(1.2); opacity: 1; }
          100% { transform: translate(-70px, 50px) scale(0); opacity: 0; }
        }
        .animate-sparkle-1 { animation: sparkle1 1s ease-out 0.1s forwards; }
        .animate-sparkle-2 { animation: sparkle2 1s ease-out 0.2s forwards; }
        .animate-sparkle-3 { animation: sparkle3 1s ease-out 0.15s forwards; }
        .animate-sparkle-4 { animation: sparkle4 1s ease-out 0.25s forwards; }

        /* ── Hint pulse ── */
        @keyframes hintPulse {
          0%, 70%, 100% { opacity: 0.3; }
          35% { opacity: 0.7; }
        }
        .animate-hint-pulse {
          animation: hintPulse 3s ease-in-out infinite;
        }

        /* ── Subtle bounce for chevron ── */
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/** Check if tutorial has been seen */
export function shouldShowTutorial(): boolean {
  return !localStorage.getItem(STORAGE_KEY);
}

/** Reset tutorial (for testing / settings) */
export function resetTutorial(): void {
  localStorage.removeItem(STORAGE_KEY);
}
