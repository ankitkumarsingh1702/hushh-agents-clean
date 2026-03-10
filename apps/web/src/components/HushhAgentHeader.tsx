import { Link } from "react-router-dom";
import HushhAgentLogo from "./HushhAgentLogo";

interface HushhAgentHeaderProps {
  onLogin?: () => void;
}

export default function HushhAgentHeader({ onLogin }: HushhAgentHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-transparent">
      {/* Logo / Wordmark */}
      <Link to="/" className="flex items-center gap-2">
        <HushhAgentLogo size="md" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Hushh Agents</h1>
      </Link>

      {/* Right side — lightweight "How it works" link */}
      <div className="flex items-center gap-6">
        <a
          className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block"
          href="#how-it-works"
        >
          How it works
        </a>
        {onLogin && (
          <button
            onClick={onLogin}
            className="px-5 py-2 text-sm font-semibold text-white border border-white/20 rounded-custom hover:bg-white/10 transition-all"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
}
