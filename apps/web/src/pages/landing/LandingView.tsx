import HushhAgentHeader from "../../components/HushhAgentHeader";
import HushhAgentFooter from "../../components/HushhAgentFooter";
import HushhAgentCTA from "../../components/HushhAgentCTA";
import { useLandingViewModel } from "./LandingViewModel";

export default function LandingView() {
  const { agentCards, cityInfo, trustBadges, heroContent, onCreateAccount, onLogin } =
    useLandingViewModel();

  return (
    <div className="bg-brand-dark text-white font-sans antialiased overflow-x-hidden min-h-screen">
      {/* Header */}
      <HushhAgentHeader onLogin={onLogin} />

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 sm:px-6">
        {/* Background Card Stack */}
        <div aria-hidden="true" className="absolute inset-0 z-0 hero-background-container">
          <div className="card-grid">
            {agentCards.map((card) => (
              <div key={card.id} className="agent-card-mock">
                <img
                  alt=""
                  className="w-full h-full object-cover"
                  src={card.imageUrl}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255, 88, 100, 0.05) 0%, rgba(10, 10, 10, 0.95) 100%)",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
          {/* City Chip */}
          <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/20 text-xs sm:text-sm font-medium">
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
              <path
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {cityInfo.label}
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1] font-serif">
            <span className="font-bold">{heroContent.headline.line1.bold}</span>{" "}
            <span className="italic font-normal">{heroContent.headline.line1.italic}</span>
            <br />
            <span className="font-bold">{heroContent.headline.line2.bold}</span>{" "}
            <span className="italic font-normal">{heroContent.headline.line2.italic}</span>
          </h2>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
            {heroContent.subheadline}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <HushhAgentCTA label={heroContent.ctaLabel} onClick={onCreateAccount} />
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-12 opacity-80 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-white/50">
              {heroContent.trustLabel}
            </span>
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 sm:gap-2">
                {badge.icon === "shield" ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
                <span className="text-xs sm:text-sm font-semibold italic">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <HushhAgentFooter />
    </div>
  );
}
