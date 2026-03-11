/* ── Deck View ── Pixel-perfect Hinge-style card UI ── */

import { useState } from "react";
import { useDeckViewModel } from "./DeckViewModel";
import { useFiltersViewModel } from "./FiltersViewModel";
import FiltersSheet from "./FiltersSheet";
import DeckTutorialOverlay, { shouldShowTutorial } from "./DeckTutorialOverlay";
import HushhAgentText from "../../components/HushhAgentText";

/* ── Inline SVG icons ── */
function XIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        fill="currentColor"
      />
    </svg>
  );
}

function SmallHeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowUpCircle() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="1.5" />
      <path d="M16 22V12M11 16l5-5 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#4da6ff" />
      <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function DeckView() {
  const vm = useDeckViewModel();
  const filters = useFiltersViewModel(() => {
    console.log("[deck] filters applied, would reload deck");
  });
  const [showTutorial, setShowTutorial] = useState(() => shouldShowTutorial());

  /* ── loading state ── */
  if (vm.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-[#121212]">
        <div className="w-12 h-12 rounded-full border-2 border-green-400/30 border-t-green-400 animate-spin mb-4" />
        <HushhAgentText size="sm" muted>Finding advisors for you…</HushhAgentText>
      </div>
    );
  }

  /* ── error state ── */
  if (vm.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-3 bg-[#121212]">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-2">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-white text-lg font-bold font-serif">Something went wrong</h3>
        <p className="text-white/50 text-sm">{vm.error}</p>
        <button
          onClick={vm.onRetry}
          className="mt-4 px-6 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-full active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ── empty deck ── */
  if (vm.deckExhausted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-4 bg-[#121212]">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-white text-2xl font-bold font-serif">You've seen everyone!</h2>
        <p className="text-white/50 text-sm max-w-xs">
          Tap below to shuffle the deck and discover again.
        </p>
        <button
          onClick={vm.onStartOver}
          className="mt-4 px-8 py-3 bg-green-500 text-white text-sm font-bold rounded-full active:scale-95 transition-transform"
        >
          🔀 Shuffle & Start Over
        </button>
      </div>
    );
  }

  const agent = vm.current!;
  const total = vm.agents.length;
  const idx = vm.currentIndex;

  /* ── card animation class ── */
  const animClass =
    vm.animatingDirection === "left"
      ? "animate-swipe-left"
      : vm.animatingDirection === "right"
        ? "animate-swipe-right"
        : "";

  /* ── dot indicators ── */
  const maxDots = 7;
  const dotStart = Math.max(0, Math.min(idx - Math.floor(maxDots / 2), total - maxDots));
  const dotEnd = Math.min(total, dotStart + maxDots);

  /* ── Rating display ── */
  const ratingDisplay = agent.rating > 0 ? agent.rating.toFixed(1) : null;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#121212] overflow-hidden pb-[82px]">

      {/* ══════════════════════════════════════════════
          TOP BANNER — "Learning your type" style
          ══════════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-3 pt-2 pb-1 z-10">
        <div className="flex items-center gap-3 bg-white/[0.95] rounded-xl px-3.5 py-2.5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <SmallHeartIcon />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-[13px] font-semibold leading-tight">Learning your type</p>
            <p className="text-gray-500 text-[11px] leading-tight">Swipe to discover the right advisor</p>
          </div>
          <button
            onClick={filters.onOpen}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          DOT INDICATORS
          ══════════════════════════════════════════════ */}
      <div className="flex items-center justify-center gap-[5px] py-2 flex-shrink-0">
        {Array.from({ length: dotEnd - dotStart }).map((_, i) => {
          const dotIdx = dotStart + i;
          return (
            <div
              key={dotIdx}
              className={`rounded-full transition-all duration-300 ${
                dotIdx === idx
                  ? "w-[7px] h-[7px] bg-white"
                  : dotIdx < idx
                    ? "w-[6px] h-[6px] bg-white/30"
                    : "w-[6px] h-[6px] bg-white/15"
              }`}
            />
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════
          FULL-SCREEN PHOTO CARD
          ══════════════════════════════════════════════ */}
      <div className="flex-1 relative mx-2 overflow-hidden rounded-2xl min-h-0">
        {/* next card peek */}
        {idx + 1 < total && (
          <div className="absolute inset-x-1 inset-y-1 rounded-2xl bg-white/[0.03] border border-white/5 scale-[0.97] -z-10" />
        )}

        {/* active card */}
        <div
          key={agent.id}
          className={`absolute inset-0 rounded-2xl overflow-hidden ${animClass}`}
        >
          {/* photo fills entire card */}
          <img
            src={agent.photoUrl}
            alt={agent.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=600&background=1a1a2e&color=fff&font-size=0.33&bold=true`;
            }}
          />

          {/* gradient — bottom heavy like Hinge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* ── Bottom info overlay ── */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            
            {/* Active badge */}
            <div className="mb-2">
              <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-2.5 py-[3px] rounded-md uppercase tracking-wide">
                Active
              </span>
            </div>

            {/* Name + Rating + Verified — single line like "P 27 ✓" */}
            <div className="flex items-center gap-1.5">
              <h2 className="text-white text-[32px] font-bold leading-none tracking-tight font-serif">
                {agent.name.length > 18 ? agent.name.split(" ")[0] : agent.name.split("—")[0].trim()}
              </h2>
              {ratingDisplay && (
                <span className="text-white text-[28px] font-light leading-none ml-1">
                  {ratingDisplay}
                </span>
              )}
              {agent.certified && (
                <span className="ml-0.5">
                  <VerifiedBadge />
                </span>
              )}
            </div>

            {/* Category pill + service icons — like zodiac row */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 border border-orange-400/60 bg-orange-500/10 text-white text-xs font-medium px-3 py-1 rounded-full">
                <span className="text-orange-300">📋</span> {agent.category}
              </span>
              {agent.reviewCount > 0 && (
                <span className="inline-flex items-center gap-1 text-white/50 text-xs">
                  <StarIcon /> {agent.reviewCount}
                </span>
              )}
              {agent.messagingEnabled && (
                <span className="text-white/30 text-xs">💬</span>
              )}
              {agent.locallyOwned && (
                <span className="text-white/30 text-xs">🏠</span>
              )}
            </div>

            {/* ── Arrow up button (right side) ── */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={vm.onViewProfile}
                className="opacity-80 hover:opacity-100 transition-opacity active:scale-90"
                aria-label="View full profile"
              >
                <ArrowUpCircle />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          BIO + VIEW MORE — below the card
          ══════════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1">
        <p className="text-white/60 text-[13px] leading-relaxed line-clamp-2">
          <span className="text-white/80 font-medium">{agent.city}, {agent.state}</span>
          {" • "}
          {agent.bio}
        </p>
        <button
          onClick={vm.onViewProfile}
          className="text-blue-400 text-[13px] font-medium mt-0.5"
        >
          View more &gt;
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          CTA PILL — "NEW  Request a Quote"
          ══════════════════════════════════════════════ */}
      <div className="flex-shrink-0 px-4 pt-2 pb-1">
        <button
          onClick={vm.onViewProfile}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full border border-white/15 bg-white/[0.03] text-white text-sm font-semibold hover:bg-white/[0.07] transition-all active:scale-[0.98]"
        >
          <span className="bg-gray-600 text-[9px] font-bold px-2 py-[2px] rounded text-white uppercase tracking-widest">
            NEW
          </span>
          Request a Quote
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          ACTION BUTTONS — ✕ (pass) and 💚 (save)
          ══════════════════════════════════════════════ */}
      <div className="flex-shrink-0 flex items-center justify-center gap-14 pt-2 pb-2 px-6">
        {/* Pass — dark circle with pink X */}
        <button
          onClick={vm.onPass}
          className="w-[58px] h-[58px] rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-rose-400 hover:bg-rose-500/15 active:scale-90 transition-all"
          aria-label="Pass"
        >
          <XIcon />
        </button>

        {/* Save — dark circle with green heart */}
        <button
          onClick={vm.onSave}
          className="w-[58px] h-[58px] rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-green-400 hover:bg-green-500/15 active:scale-90 transition-all"
          aria-label="Like"
        >
          <HeartIcon />
        </button>
      </div>

      {/* ── Filters sheet ── */}
      <FiltersSheet vm={filters} />

      {/* ── First-time tutorial overlay ── */}
      {showTutorial && (
        <DeckTutorialOverlay onComplete={() => setShowTutorial(false)} />
      )}

      {/* ── Swipe animations ── */}
      <style>{`
        @keyframes swipeLeft {
          to { transform: translateX(-120%) rotate(-12deg); opacity: 0; }
        }
        @keyframes swipeRight {
          to { transform: translateX(120%) rotate(12deg); opacity: 0; }
        }
        .animate-swipe-left { animation: swipeLeft 0.35s ease-out forwards; }
        .animate-swipe-right { animation: swipeRight 0.35s ease-out forwards; }
      `}</style>
    </div>
  );
}
