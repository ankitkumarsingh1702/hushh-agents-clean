import { ReactNode } from "react";

interface HushhAgentHeadingProps {
  children: ReactNode;
  level?: "h1" | "h2" | "h3";
  italic?: boolean;
  className?: string;
}

/**
 * HushhAgentHeading — Brand serif heading
 *
 * Font sizing:
 *   h1 → 30px / 40px / 56px / 72px  (text-3xl sm:text-4xl md:text-6xl lg:text-7xl)
 *   h2 → 24px / 30px / 36px / 48px  (text-2xl sm:text-3xl md:text-4xl lg:text-5xl)
 *   h3 → 20px / 24px / 30px         (text-xl sm:text-2xl md:text-3xl)
 *
 * Font: Playfair Display (font-serif)
 */
export default function HushhAgentHeading({
  children,
  level = "h1",
  italic = false,
  className = "",
}: HushhAgentHeadingProps) {
  const sizeClasses = {
    h1: "text-3xl sm:text-4xl md:text-6xl lg:text-7xl",
    h2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    h3: "text-xl sm:text-2xl md:text-3xl",
  };

  const Tag = level;
  const italicClass = italic ? "italic font-normal" : "font-bold";

  return (
    <Tag
      className={`font-serif ${italicClass} tracking-tight leading-[1.1] text-white ${sizeClasses[level]} ${className}`}
    >
      {children}
    </Tag>
  );
}
