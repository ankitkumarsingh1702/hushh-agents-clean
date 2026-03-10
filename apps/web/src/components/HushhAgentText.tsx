import { ReactNode } from "react";

interface HushhAgentTextProps {
  children: ReactNode;
  size?: "lg" | "md" | "sm" | "xs";
  muted?: boolean;
  className?: string;
}

/**
 * HushhAgentText — Body / content text
 *
 * Font sizing:
 *   lg → 18px / 20px  (text-lg sm:text-xl)
 *   md → 16px / 18px  (text-base sm:text-lg)
 *   sm → 14px / 16px  (text-sm sm:text-base)
 *   xs → 12px / 14px  (text-xs sm:text-sm)
 *
 * Font: Manrope (font-sans), regular weight
 */
export default function HushhAgentText({
  children,
  size = "md",
  muted = false,
  className = "",
}: HushhAgentTextProps) {
  const sizeClasses = {
    lg: "text-lg sm:text-xl",
    md: "text-base sm:text-lg",
    sm: "text-sm sm:text-base",
    xs: "text-xs sm:text-sm",
  };

  const colorClass = muted ? "text-white/60" : "text-white";

  return (
    <p
      className={`font-sans font-normal leading-relaxed ${colorClass} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </p>
  );
}
