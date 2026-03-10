import { ReactNode } from "react";

interface HushhAgentTitleProps {
  children: ReactNode;
  size?: "lg" | "md" | "sm";
  className?: string;
}

/**
 * HushhAgentTitle — Section title / label text
 *
 * Font sizing:
 *   lg → 18px / 20px / 24px  (text-lg sm:text-xl md:text-2xl)
 *   md → 16px / 18px / 20px  (text-base sm:text-lg md:text-xl)
 *   sm → 14px / 16px         (text-sm sm:text-base)
 *
 * Font: Manrope (font-sans), semibold
 */
export default function HushhAgentTitle({
  children,
  size = "lg",
  className = "",
}: HushhAgentTitleProps) {
  const sizeClasses = {
    lg: "text-lg sm:text-xl md:text-2xl",
    md: "text-base sm:text-lg md:text-xl",
    sm: "text-sm sm:text-base",
  };

  return (
    <p
      className={`font-sans font-semibold text-white ${sizeClasses[size]} ${className}`}
    >
      {children}
    </p>
  );
}
