import { Link } from "react-router-dom";
import { useState } from "react";

interface HushhAgentHeaderProps {
  onLogin?: () => void;
}

export default function HushhAgentHeader({ onLogin }: HushhAgentHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-transparent">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-primary rounded-custom flex items-center justify-center">
          <span className="text-brand-dark font-black text-lg sm:text-xl">H</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Hushh Agents</h1>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a className="text-white hover:text-brand-primary transition-colors" href="#how-it-works">
          How it works
        </a>
        <a className="text-white hover:text-brand-primary transition-colors" href="#for-agents">
          For Agents
        </a>
        <a className="text-white hover:text-brand-primary transition-colors" href="#resources">
          Resources
        </a>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Login Button */}
        <button
          onClick={onLogin}
          className="hidden sm:block px-5 py-2 text-sm font-semibold text-white border border-white/20 rounded-custom hover:bg-white/10 transition-all"
        >
          Log In
        </button>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-brand-dark/95 backdrop-blur-md border-t border-white/10 md:hidden">
          <nav className="flex flex-col px-4 sm:px-6 py-4 gap-4 text-sm font-medium">
            <a
              className="text-white hover:text-brand-primary transition-colors py-2"
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </a>
            <a
              className="text-white hover:text-brand-primary transition-colors py-2"
              href="#for-agents"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Agents
            </a>
            <a
              className="text-white hover:text-brand-primary transition-colors py-2"
              href="#resources"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </a>
            <button
              onClick={() => { setMobileMenuOpen(false); onLogin?.(); }}
              className="sm:hidden text-left text-brand-primary font-semibold py-2"
            >
              Log In
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
