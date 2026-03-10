import HushhAgentHeading from "../../../components/HushhAgentHeading";
import HushhAgentText from "../../../components/HushhAgentText";
import HushhAgentCTA from "../../../components/HushhAgentCTA";
import HushhAgentFooter from "../../../components/HushhAgentFooter";
import HushhAgentLogo from "../../../components/HushhAgentLogo";
import { useWelcomeViewModel } from "./WelcomeViewModel";

export default function WelcomeView() {
  const { content, promiseCards, houseRules, onContinue, onReviewTerms } =
    useWelcomeViewModel();

  return (
    <div className="bg-brand-dark text-white font-sans antialiased overflow-x-hidden min-h-screen">
      {/* Header — Progress step, no back button */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center bg-transparent">
        <span className="text-xs sm:text-sm font-medium text-white/50 tracking-widest uppercase">
          {content.headerStep}
        </span>
      </header>

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col items-center pt-24 pb-20 px-4 sm:px-6">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <HushhAgentLogo size="lg" showGlow />
          </div>

          {/* Title */}
          <div className="text-center mb-3 sm:mb-4">
            <HushhAgentHeading level="h2">{content.title}</HushhAgentHeading>
          </div>

          {/* Support copy */}
          <div className="text-center mb-8 sm:mb-10">
            <HushhAgentText size="sm" muted>
              {content.supportCopy}
            </HushhAgentText>
          </div>

          {/* Promise Cards */}
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            {promiseCards.map((card) => (
              <div
                key={card.title}
                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-custom px-4 sm:px-5 py-4 transition-all hover:bg-white/[0.07]"
              >
                <div className="w-10 h-10 shrink-0 bg-brand-primary/15 border border-brand-primary/20 rounded-custom flex items-center justify-center text-lg">
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-white mb-1">
                    {card.title}
                  </p>
                  <HushhAgentText size="xs" muted>
                    {card.description}
                  </HushhAgentText>
                </div>
              </div>
            ))}
          </div>

          {/* House Rules */}
          <div className="mb-8 sm:mb-10">
            <p className="text-xs sm:text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
              House Rules
            </p>
            <div className="bg-white/5 border border-white/10 rounded-custom px-4 sm:px-5 py-4">
              <ul className="space-y-2.5">
                {houseRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-brand-primary text-sm mt-0.5">•</span>
                    <HushhAgentText size="xs" muted>
                      {rule.text}
                    </HushhAgentText>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Primary CTA */}
          <HushhAgentCTA
            label={content.ctaLabel}
            onClick={onContinue}
            variant="primary"
            size="lg"
            showArrow
            className="w-full"
          />

          {/* Secondary CTA */}
          <div className="mt-5 sm:mt-6 text-center">
            <button
              onClick={onReviewTerms}
              className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
            >
              {content.secondaryCta}
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-8 sm:mt-10 text-center">
            <HushhAgentText size="xs" muted className="italic">
              {content.footerNote}
            </HushhAgentText>
          </div>
        </div>
      </main>

      {/* Footer */}
      <HushhAgentFooter />
    </div>
  );
}
