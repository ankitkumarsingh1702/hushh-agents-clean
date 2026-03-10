/** Welcome / Trust Promise page data — pure functions, no React */

export interface PromiseCard {
  icon: string;
  title: string;
  description: string;
}

export interface HouseRule {
  text: string;
}

export function getWelcomeContent() {
  return {
    headerStep: "Step 1 of 5",
    title: "Welcome to Hushh Agents",
    supportCopy:
      "This is a trust-first marketplace for discovering professionals near you. You'll set a few preferences, then start browsing.",
    ctaLabel: "Continue",
    secondaryCta: "Review terms",
    footerNote:
      "We never post on your behalf or expose your details without a clear action from you.",
  };
}

export function getPromiseCards(): PromiseCard[] {
  return [
    {
      icon: "✓",
      title: "Verified businesses",
      description: "Every professional is verified before appearing in your feed.",
    },
    {
      icon: "📍",
      title: "Local relevance",
      description: "Discover advisors and agents based on your city and needs.",
    },
    {
      icon: "🔒",
      title: "Secure contact",
      description: "Your details are shared only when you explicitly choose to connect.",
    },
  ];
}

export function getHouseRules(): HouseRule[] {
  return [
    { text: "Be real." },
    { text: "Protect private information." },
    { text: "Keep conversations relevant to advice, coverage, or planning." },
    { text: "Report suspicious profiles." },
  ];
}
