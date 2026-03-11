/* ── Deck Tutorial Overlay ── First-time user walkthrough ── */

import { useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "hushh_deck_tutorial_seen";

/* ── Monotone filled SVG icons ── */
function SwipeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 3a1 1 0 012 0v8.586l4.293-4.293a1 1 0 011.414 1.414L12 13.414V21a1 1 0 11-2 0v-7.586l-4.707-4.707a1 1 0 011.414-1.414L9 11.586V3z" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.293 5.293a1 1 0 011.414 0L12 9.172l-.879-.879a1 1 0 011.758 0L12 9.172l.879-.879a1 1 0 111.414 1.414L13.414 12l.879.879-.879.879L12 14.828l-1.879-1.879-.879-.879.879-.879L9.172 12l-.879-.879a1 1 0 010-1.414l.879.879L12 7.172l-.879-.879z" clipRule="evenodd" />
    </svg>
  );
}

function HeartFillIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function UserProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.5 9.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM12 14c-3.033 0-5.685 1.648-7.106 4.097A9.96 9.96 0 0012 22a9.96 9.96 0 007.106-3.903C17.685 15.648 15.033 14 12 14z" clipRule="evenodd" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm3 7a1 1 0 011-1h10a1 1 0 110 2H7a1 1 0 01-1-1zm3 7a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" />
    </svg>
  );
}

/* ── Gesture hand icon (monotone, filled) ── */
function TapHandIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12 1a2 2 0 00-2 2v8.333L7.2 9.6a2 2 0 00-2.8 2.857l5.657 5.657A6 6 0 0014 20h1a5 5 0 005-5v-4a2 2 0 00-4 0v-1a2 2 0 00-4 0V3a2 2 0 00-2-2z" opacity="0.9" />
    </svg>
  );
}

interface TutorialStep {
  icon: ReactNode;
  title: string;
  description: string;
  highlight: "card" | "pass" | "like" | "profile" | "filters";
  gesture?: "swipe" | "tap-left" | "tap-right" | "tap-up" | "tap-top";
}

const steps: TutorialStep[] = [
  {
    icon: <SwipeIcon />,
    title: "Discover Advisors",
    description: "Browse through curated advisor profiles. Each card shows their specialty, rating, and availability.",
    highlight: "card",
    gesture: "swipe",
  },
  {
    icon: <XCircleIcon />,
    title: "Not a match? Pass.",
    description: "Tap the ✕ button to skip this advisor and move to the next one.",
    highlight: "pass",
    gesture: "tap-left",
  },
  {
    icon: <HeartFillIcon />,
    title: "Found a fit? Save!",
    description: "Tap the heart to shortlist this advisor. You can review all saved advisors in your Likes tab.",
    highlight: "like",
    gesture: "tap-right",
  },
  {
    icon: <UserProfileIcon />,
    title: "View Full Profile",
    description: "Tap the arrow or 'View more' to see detailed info, reviews, services & request a quote.",
    highlight: "profile",
    gesture: "tap-up",
  },
  {
    icon: <FilterIcon />,
    title: "Filter & Sort",
    description: "Use filters to narrow down by specialty, rating, response time, and availability.",
    highlight: "filters",
    gesture: "tap-top",
  },
];

export default function DeckTutorialOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);

    if (isLast) {
      localStorage.setItem(STORAGE_KEY, "true");
      setVisible(false);
      setTimeout(onComplete, 300);
    } else {
      setTimeout(() => {
        setStep(s => s + 1);
        setAnimating(false);
      }, 200);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    setTimeout(onComplete, 300);
  };

  /* ── Highlight position classes based on step ── */
  const spotlightPosition: Record<string, string> = {
    card: "top-[20%] left-[10%] w-[80%] h-[45%] rounded-2xl",
    pass: "bottom-[100px] left-[calc(50%-90px)] w-[68px] h-[68px] rounded-full",
    like: "bottom-[100px] right-[calc(50%-90px)] w-[68px] h-[68px] rounded-full",
    profile: "bottom-[200px] right-[20px] w-[44px] h-[44px] rounded-full",
    filters: "top-[12px] right-[20px] w-[44px] h-[44px] rounded-xl",
  };

  /* ── Tooltip position ── */
  const tooltipPosition: Record<string, string> = {
    card: "top-[68%]",
    pass: "bottom-[180px]",
    like: "bottom-[180px]",
    profile: "bottom-[260px]",
    filters: "top-[70px]",
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={handleNext}
    >
      {/* ── Dark backdrop ── */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />

      {/* ── Spotlight cutout (animated ring) ── */}
      <div
        className={`absolute transition-all duration-500 ease-out ${spotlightPosition[current.highlight]}`}
        style={{
          boxShadow: "0 0 0 3px rgba(74, 222, 128, 0.6), 0 0 30px rgba(74, 222, 128, 0.15)",
        }}
      />

      {/* ── Gesture animation ── */}
      <div className="absolute inset-0 pointer-events-none">
        {current.gesture === "swipe" && (
          <div className="absolute top-[38%] left-[50%] -translate-x-1/2">
            <div className="animate-tutorial-swipe"><TapHandIcon size={36} /></div>
          </div>
        )}
        {current.gesture === "tap-left" && (
          <div className="absolute bottom-[108px] left-[calc(50%-86px)]">
            <div className="animate-tutorial-tap"><TapHandIcon size={32} /></div>
          </div>
        )}
        {current.gesture === "tap-right" && (
          <div className="absolute bottom-[108px] right-[calc(50%-86px)]">
            <div className="animate-tutorial-tap"><TapHandIcon size={32} /></div>
          </div>
        )}
        {current.gesture === "tap-up" && (
          <div className="absolute bottom-[208px] right-[24px]">
            <div className="animate-tutorial-tap"><TapHandIcon size={26} /></div>
          </div>
        )}
        {current.gesture === "tap-top" && (
          <div className="absolute top-[16px] right-[24px]">
            <div className="animate-tutorial-tap"><TapHandIcon size={26} /></div>
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-10">
        <div
          className="h-full bg-green-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Skip button ── */}
      <button
        onClick={(e) => { e.stopPropagation(); handleSkip(); }}
        className="absolute top-4 right-4 text-white/50 text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 hover:text-white/80 hover:border-white/40 transition-colors z-10"
      >
        Skip
      </button>

      {/* ── Step counter ── */}
      <div className="absolute top-4 left-4 text-white/40 text-xs font-medium z-10">
        {step + 1} / {steps.length}
      </div>

      {/* ── Tooltip card ── */}
      <div
        className={`absolute left-4 right-4 ${tooltipPosition[current.highlight]} z-10 transition-all duration-300 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/[0.97] rounded-2xl px-5 py-5 shadow-2xl mx-auto max-w-sm">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
              {current.icon}
            </div>
            <h3 className="text-gray-900 text-lg font-bold font-serif">{current.title}</h3>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-[13px] leading-relaxed mb-4">
            {current.description}
          </p>

          {/* Action row */}
          <div className="flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-5 h-[6px] bg-green-500"
                      : i < step
                        ? "w-[6px] h-[6px] bg-green-300"
                        : "w-[6px] h-[6px] bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Next / Got it button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-1.5"
            >
              {isLast ? (
                <>
                  Let's Go!
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </>
              ) : (
                <>
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tap anywhere hint ── */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-white/30 text-[11px]">Tap anywhere to continue</p>
      </div>

      {/* ── Tutorial animations ── */}
      <style>{`
        @keyframes tutorialSwipe {
          0%, 100% { transform: translateX(0); opacity: 0.7; }
          25% { transform: translateX(-40px); opacity: 1; }
          50% { transform: translateX(0); opacity: 0.7; }
          75% { transform: translateX(40px); opacity: 1; }
        }
        @keyframes tutorialTap {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        .animate-tutorial-swipe {
          animation: tutorialSwipe 2.5s ease-in-out infinite;
        }
        .animate-tutorial-tap {
          animation: tutorialTap 1.2s ease-in-out infinite;
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
