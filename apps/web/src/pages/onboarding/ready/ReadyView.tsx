import HushhAgentHeading from "../../../components/HushhAgentHeading";
import HushhAgentText from "../../../components/HushhAgentText";
import HushhAgentCTA from "../../../components/HushhAgentCTA";
import HushhAgentFooter from "../../../components/HushhAgentFooter";
import { useReadyViewModel } from "./ReadyViewModel";

/** Duo-tone SVG icons */
function SuccessCheckIcon() {
  return (
    <svg className="w-20 h-20 sm:w-24 sm:h-24 text-brand-primary" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="currentColor" fillOpacity="0.1" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <circle cx="12" cy="12" r="7" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SwipeLeftIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="14" height="16" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 12H3m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8l3 0M17 12l4 0M17 16l2 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  );
}

function SwipeRightIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="7" y="4" width="14" height="16" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 12h7m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 8h3M4 12h3M4 16h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  );
}

function TapIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="14" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const SWIPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  left: SwipeLeftIcon,
  right: SwipeRightIcon,
  tap: TapIcon,
};

export default function ReadyView() {
  const { content, onStart, onReview } = useReadyViewModel();

  return (
    <div className="bg-brand-dark text-white font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
      {/* No header progress bar — clean success layout */}

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md text-center">
          {/* Success Check Icon */}
          <div className="flex justify-center mb-8 animate-pulse">
            <SuccessCheckIcon />
          </div>

          {/* Title */}
          <div className="mb-3">
            <HushhAgentHeading level="h2">{content.title}</HushhAgentHeading>
          </div>

          {/* Support copy */}
          <div className="mb-10">
            <HushhAgentText size="sm" muted>{content.supportCopy}</HushhAgentText>
          </div>

          {/* Swipe Explainer */}
          <div className="space-y-4 mb-10 text-left max-w-sm mx-auto">
            {content.swipeExplainer.map((item) => {
              const IconComp = SWIPE_ICONS[item.icon];
              return (
                <div key={item.icon} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-custom bg-white/5 border border-white/10 flex items-center justify-center">
                    {IconComp && <IconComp className="w-6 h-6 text-brand-primary" />}
                  </div>
                  <span className="text-sm font-medium text-white/70">{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Primary CTA */}
          <HushhAgentCTA
            label={content.ctaLabel}
            onClick={onStart}
            variant="primary"
            size="lg"
            showArrow
            className="w-full"
          />

          {/* Review preferences */}
          <div className="mt-4">
            <button
              onClick={onReview}
              className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
            >
              {content.secondaryCta}
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-10">
            <HushhAgentText size="xs" muted className="italic">{content.footerNote}</HushhAgentText>
          </div>
        </div>
      </main>

      <HushhAgentFooter />
    </div>
  );
}
