interface HushhAgentLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showGlow?: boolean;
}

/**
 * HushhAgentLogo — Reusable brand logo component
 *
 * Sizes:
 *   sm → 32px / 36px  (header inline)
 *   md → 40px / 48px  (header standalone)
 *   lg → 56px / 64px  (page hero)
 *   xl → 72px / 80px  (splash / landing)
 */
export default function HushhAgentLogo({
  size = "md",
  className = "",
  showGlow = false,
}: HushhAgentLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 sm:w-9 sm:h-9",
    md: "w-10 h-10 sm:w-12 sm:h-12",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
    xl: "w-[72px] h-[72px] sm:w-20 sm:h-20",
  };

  const glowClass = showGlow ? "shadow-lg shadow-[#ff5864]/25" : "";

  return (
    <img
      src="/assets/hushhlogo.jpg"
      alt="Hushh Agents"
      className={`rounded-custom object-cover ${sizeClasses[size]} ${glowClass} ${className}`}
    />
  );
}
