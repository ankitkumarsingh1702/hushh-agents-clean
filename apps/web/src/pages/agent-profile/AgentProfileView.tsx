/* ── Agent Profile View ── Hinge-inspired scrollable profile ── */

import { useAgentProfileViewModel } from "./AgentProfileViewModel";

/* ── SVG Icons ── */
function PhoneIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 21V9h6v12M9 9V3h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#4da6ff" />
      <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AgentProfileView() {
  const vm = useAgentProfileViewModel();

  /* ── loading ── */
  if (vm.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading agent…</p>
        </div>
      </div>
    );
  }

  /* ── error / not found ── */
  if (vm.error || !vm.agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30 text-2xl">?</div>
        <h2 className="text-white text-xl font-bold font-serif">Agent not found</h2>
        <p className="text-white/40 text-sm">{vm.error ?? "No data available."}</p>
        <button
          onClick={vm.onBack}
          className="text-sm text-brand-primary hover:underline"
        >
          ← Back to deck
        </button>
      </div>
    );
  }

  const a = vm.agent;

  return (
    <div className="bg-black text-white font-sans antialiased min-h-screen flex flex-col">

      {/* ── Sticky Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between bg-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <button
          onClick={vm.onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium text-white/40 tracking-wider uppercase">Profile</span>
        <button
          onClick={vm.onSave}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            vm.saved ? "text-brand-primary" : "text-white/40 hover:text-white"
          }`}
          aria-label={vm.saved ? "Saved" : "Save agent"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={vm.saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* ── Scrollable Content ── */}
      <main className="flex-1 pt-16 pb-32 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">

          {/* ── Hero Image — full bleed ── */}
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <img
              src={a.photoUrl}
              alt={a.name}
              className="w-full h-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/600x800?text=" + encodeURIComponent(a.name);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* Name overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Active badge */}
              <span className="inline-block bg-green-500/90 text-white text-[11px] font-semibold px-3 py-0.5 rounded-full mb-3">
                {a.responseTime ? (a.responseTime === "fast" ? "Active now" : `Replies ${a.responseTime}`) : "Active"}
              </span>

              <div className="flex items-center gap-2">
                <h1 className="text-white text-3xl font-bold font-serif leading-none">{a.name}</h1>
                {a.certified && <VerifiedBadge />}
              </div>

              {a.rating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400 text-sm">★ {a.rating.toFixed(1)}</span>
                  <span className="text-white/30 text-sm">·</span>
                  <span className="text-white/50 text-sm">{a.reviewCount} reviews</span>
                </div>
              )}

              <p className="text-white/40 text-sm mt-1.5">
                📍 {a.city}, {a.state}
              </p>
            </div>
          </div>

          {/* ── Content cards ── */}
          <div className="px-5 space-y-5 mt-5">

            {/* Category + badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/[0.06] border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                📋 {a.category}
              </span>
              {a.locallyOwned && (
                <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full">
                  🏠 Locally Owned
                </span>
              )}
              {a.certified && (
                <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full">
                  ✓ Certified
                </span>
              )}
            </div>

            {/* About section — card style */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3 opacity-50">About</h3>
              <p className="text-white/70 text-[15px] leading-relaxed">{a.bio}</p>
            </div>

            {/* Representative card */}
            {a.representative && (
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3 opacity-50">Your Agent</h3>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/40 flex-shrink-0">
                    <UserIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold">{a.representative.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{a.representative.role}</p>
                    {a.representative.bio && (
                      <p className="text-white/50 text-sm mt-2 leading-relaxed">{a.representative.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Services */}
            {a.services.length > 0 && (
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3 opacity-50">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {a.services.map((s: string) => (
                    <span
                      key={s}
                      className="px-3.5 py-1.5 rounded-full text-sm bg-white/[0.06] border border-white/10 text-white/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {a.specialties && (
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3 opacity-50">Specialties</h3>
                <p className="text-white/60 text-[15px] leading-relaxed">{a.specialties}</p>
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-5 space-y-3">
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-1 opacity-50">Contact</h3>

              {a.phone && (
                <a href={`tel:${a.phone}`} className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                    <PhoneIcon />
                  </div>
                  <span>{a.phone}</span>
                </a>
              )}

              {a.website && (
                <a href={a.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-brand-primary/80 hover:text-brand-primary transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:border-brand-primary/30 transition-colors">
                    <GlobeIcon />
                  </div>
                  <span>Visit website</span>
                </a>
              )}

              {a.hours && (
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                    <ClockIcon />
                  </div>
                  <span>{a.hours}</span>
                </div>
              )}

              {a.yearEstablished && (
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                    <BuildingIcon />
                  </div>
                  <span>Established {a.yearEstablished}</span>
                </div>
              )}
            </div>

            {/* Messaging availability */}
            {a.messagingEnabled && a.messagingText && (
              <div className="bg-brand-primary/[0.08] border border-brand-primary/20 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/15 border border-brand-primary/25 flex items-center justify-center text-brand-primary flex-shrink-0">
                    <MessageIcon />
                  </div>
                  <div>
                    <p className="text-brand-primary/90 text-sm">{a.messagingText}</p>
                    {a.responseTime && (
                      <p className="text-white/30 text-xs mt-1">⏱ {a.responseTime}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Fixed Bottom Action Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/[0.06] px-5 py-4 pb-safe">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {/* Pass / Report */}
          <button
            onClick={vm.onReport}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
              vm.reported
                ? "border-red-500/30 text-red-400/40"
                : "border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30"
            }`}
            aria-label={vm.reported ? "Reported" : "Report"}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </button>

          {/* Primary CTA */}
          <button
            onClick={vm.onConnect}
            className={`flex-1 py-3.5 rounded-full text-sm font-bold transition-all active:scale-[0.98] ${
              vm.connectRequested
                ? "bg-white/10 text-white/40 pointer-events-none"
                : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
            }`}
          >
            {vm.connectRequested ? "✓ Request Sent" : "Request a Quote"}
          </button>

          {/* Save */}
          <button
            onClick={vm.onSave}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
              vm.saved
                ? "border-green-400/30 text-green-400 bg-green-500/10"
                : "border-white/10 text-white/30 hover:text-green-400 hover:border-green-400/30"
            }`}
            aria-label={vm.saved ? "Saved" : "Save"}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={vm.saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
