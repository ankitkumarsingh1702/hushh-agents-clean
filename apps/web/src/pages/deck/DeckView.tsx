/* ── Deck View ── Tinder/Hinge-level swipe gestures with framer-motion ── */

import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import { useDeckViewModel } from "./DeckViewModel";
import { useFiltersViewModel } from "./FiltersViewModel";
import FiltersSheet from "./FiltersSheet";
import DeckTutorialOverlay, { shouldShowTutorial } from "./DeckTutorialOverlay";
import HushhAgentText from "../../components/HushhAgentText";

/* ═══════════════════════════════════════════
   Haptic feedback helper
   ═══════════════════════════════════════════ */
function haptic(pattern: number | number[] = 10) {
  try { navigator?.vibrate?.(pattern); } catch { /* not supported */ }
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const SWIPE_THRESHOLD = 100;       // px drag to trigger swipe
const VELOCITY_THRESHOLD = 500;    // px/s velocity to trigger swipe
const FLY_OFF_DISTANCE = 600;      // px distance for fly-off animation
const ROTATION_FACTOR = 0.08;      // degrees per px of drag
const STAMP_OPACITY_FACTOR = 0.008; // opacity per px for stamp

/* ═══════════════════════════════════════════
   Inline SVG icons
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   SwipeableCard Component — Tinder-level
   ═══════════════════════════════════════════ */
interface SwipeableCardProps {
  agent: {
    id: string;
    name: string;
    photoUrl: string;
    category: string;
    rating: number;
    reviewCount: number;
    certified: boolean;
    messagingEnabled: boolean;
    locallyOwned: boolean;
    city: string;
    state: string;
    bio: string;
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onViewProfile: () => void;
  isTop: boolean;
}

function SwipeableCard({ agent, onSwipeLeft, onSwipeRight, onViewProfile, isTop }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-ROTATION_FACTOR * 300, 0, ROTATION_FACTOR * 300]);
  
  // LIKE stamp opacity (shows when dragging right)
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  // NOPE stamp opacity (shows when dragging left)
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  
  // Card scale for subtle feedback
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);
  
  // Background glow color
  const bgLeft = useTransform(x, [-200, 0], ["rgba(239,68,68,0.15)", "rgba(0,0,0,0)"]);
  const bgRight = useTransform(x, [0, 200], ["rgba(0,0,0,0)", "rgba(74,222,128,0.15)"]);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    setIsDragging(false);
    const { offset, velocity } = info;
    const swipedRight = offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD;
    const swipedLeft = offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD;

    if (swipedRight) {
      // Fly off right
      animate(x, FLY_OFF_DISTANCE, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: onSwipeRight,
      });
    } else if (swipedLeft) {
      // Fly off left
      animate(x, -FLY_OFF_DISTANCE, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: onSwipeLeft,
      });
    } else {
      // Bounce back
      animate(x, 0, {
        type: "spring",
        stiffness: 500,
        damping: 25,
        mass: 0.8,
      });
    }
  }, [x, onSwipeLeft, onSwipeRight]);

  const ratingDisplay = agent.rating > 0 ? agent.rating.toFixed(1) : null;

  if (!isTop) {
    // Background card — slightly scaled down, no interaction
    return (
      <div className="absolute inset-0 rounded-2xl overflow-hidden scale-[0.97] opacity-70">
        <img
          src={agent.photoUrl}
          alt={agent.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=600&background=1a1a2e&color=fff&font-size=0.33&bold=true`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate, scale }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Photo */}
      <img
        src={agent.photoUrl}
        alt={agent.name}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        draggable={false}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=600&background=1a1a2e&color=fff&font-size=0.33&bold=true`;
        }}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

      {/* ═══ LIKE Stamp (Green, right side) ═══ */}
      <motion.div
        className="absolute top-8 left-6 z-20 pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        <div className="border-[4px] border-green-400 rounded-lg px-4 py-2 -rotate-[20deg]">
          <span className="text-green-400 text-[36px] font-extrabold tracking-wider leading-none">
            LIKE
          </span>
        </div>
      </motion.div>

      {/* ═══ NOPE Stamp (Red, left side) ═══ */}
      <motion.div
        className="absolute top-8 right-6 z-20 pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        <div className="border-[4px] border-red-400 rounded-lg px-4 py-2 rotate-[20deg]">
          <span className="text-red-400 text-[36px] font-extrabold tracking-wider leading-none">
            NOPE
          </span>
        </div>
      </motion.div>

      {/* ═══ Edge glow overlays ═══ */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        style={{ background: bgLeft }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        style={{ background: bgRight }}
      />

      {/* ── Bottom info overlay ── */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-30">

        {/* Active badge */}
        <div className="mb-2">
          <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-2.5 py-[3px] rounded-md uppercase tracking-wide">
            Active
          </span>
        </div>

        {/* Name + Rating + Verified */}
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

        {/* Category pill + icons */}
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

        {/* Arrow up button */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={(e) => {
              if (isDragging) return;
              e.stopPropagation();
              onViewProfile();
            }}
            data-tutorial-target="profile"
            className="opacity-80 hover:opacity-100 transition-opacity active:scale-90"
            aria-label="View full profile"
          >
            <ArrowUpCircle />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Main DeckView Component
   ═══════════════════════════════════════════ */
export default function DeckView() {
  const vm = useDeckViewModel();
  const filters = useFiltersViewModel(() => {
    console.log("[deck] filters applied, would reload deck");
  });
  const [showTutorial, setShowTutorial] = useState(() => shouldShowTutorial());
  const [cardKey, setCardKey] = useState(0); // force re-mount on swipe

  /* ── loading state — shimmer skeleton ── */
  if (vm.loading) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#121212] overflow-hidden pb-[82px]">
        {/* Skeleton banner */}
        <div className="flex-shrink-0 px-3 pt-2 pb-1">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3.5 py-2.5 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-32 bg-white/10 rounded" />
              <div className="h-2.5 w-48 bg-white/[0.06] rounded" />
            </div>
          </div>
        </div>
        {/* Skeleton dots */}
        <div className="flex items-center justify-center gap-[5px] py-2">
          {[...Array(5)].map((_, i) => <div key={i} className="w-[6px] h-[6px] rounded-full bg-white/10 animate-pulse" />)}
        </div>
        {/* Skeleton card */}
        <div className="flex-1 mx-2 rounded-2xl bg-white/[0.04] animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skeleton-shimmer" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 space-y-3">
            <div className="h-3 w-16 bg-white/10 rounded-md" />
            <div className="h-8 w-40 bg-white/10 rounded" />
            <div className="h-5 w-28 bg-white/[0.06] rounded-full" />
          </div>
        </div>
        {/* Skeleton bio */}
        <div className="px-4 pt-3 pb-1 space-y-1.5 animate-pulse">
          <div className="h-3 w-full bg-white/[0.06] rounded" />
          <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
        </div>
        {/* Skeleton buttons */}
        <div className="flex items-center justify-center gap-14 pt-4 pb-2 px-6">
          <div className="w-[58px] h-[58px] rounded-full bg-white/[0.06] animate-pulse" />
          <div className="w-[58px] h-[58px] rounded-full bg-white/[0.06] animate-pulse" />
        </div>
        <style>{`
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          .skeleton-shimmer { animation: shimmer 1.5s ease-in-out infinite; }
        `}</style>
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
  const nextAgent = vm.agents[vm.currentIndex + 1] ?? null;
  const total = vm.agents.length;
  const idx = vm.currentIndex;

  /* ── Swipe handlers with haptic feedback ── */
  const handleSwipeLeft = () => {
    haptic(15);
    vm.onPass();
    setCardKey(k => k + 1);
  };

  const handleSwipeRight = () => {
    haptic([10, 30, 10]);
    vm.onSave();
    setCardKey(k => k + 1);
  };

  /* ── dot indicators ── */
  const maxDots = 7;
  const dotStart = Math.max(0, Math.min(idx - Math.floor(maxDots / 2), total - maxDots));
  const dotEnd = Math.min(total, dotStart + maxDots);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#121212] overflow-hidden pb-[82px]">

      {/* ══════════════════════════════════════════════
          TOP BANNER — "Learning your type"
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
            data-tutorial-target="filters"
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
          SWIPEABLE CARD STACK
          ══════════════════════════════════════════════ */}
      <div className="flex-1 relative mx-2 overflow-hidden rounded-2xl min-h-0" data-tutorial-target="card">
        {/* Next card (behind) */}
        {nextAgent && (
          <SwipeableCard
            key={`bg-${nextAgent.id}`}
            agent={nextAgent}
            onSwipeLeft={() => {}}
            onSwipeRight={() => {}}
            onViewProfile={() => {}}
            isTop={false}
          />
        )}

        {/* Active draggable card */}
        <SwipeableCard
          key={`card-${agent.id}-${cardKey}`}
          agent={agent}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onViewProfile={vm.onViewProfile}
          isTop={true}
        />
      </div>

      {/* ══════════════════════════════════════════════
          BIO + VIEW MORE
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
          CTA PILL
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
          ACTION BUTTONS — ✕ and 💚
          ══════════════════════════════════════════════ */}
      <div className="flex-shrink-0 flex items-center justify-center gap-14 pt-2 pb-2 px-6">
        <motion.button
          onClick={handleSwipeLeft}
          data-tutorial-target="pass"
          className="w-[58px] h-[58px] rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-rose-400 hover:bg-rose-500/15 transition-all"
          aria-label="Pass"
          whileTap={{
            scale: 0.85,
            rotate: [0, -8, 8, -5, 5, 0],
            transition: { rotate: { duration: 0.4 }, scale: { duration: 0.1 } },
          }}
        >
          <XIcon />
        </motion.button>

        <motion.button
          onClick={handleSwipeRight}
          data-tutorial-target="like"
          className="w-[58px] h-[58px] rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-green-400 hover:bg-green-500/15 transition-all"
          aria-label="Like"
          whileTap={{
            scale: [1, 1.3, 0.9, 1.15, 1],
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          <HeartIcon />
        </motion.button>
      </div>

      {/* ── Filters sheet ── */}
      <FiltersSheet vm={filters} />

      {/* ── First-time tutorial overlay ── */}
      {showTutorial && (
        <DeckTutorialOverlay onComplete={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
