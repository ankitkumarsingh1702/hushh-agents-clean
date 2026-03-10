export default function HushhAgentFooter() {
  return (
    <footer className="absolute bottom-0 w-full px-4 sm:px-6 py-4 sm:py-6 border-t border-white/10 z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-[10px] md:text-xs text-white/40 max-w-md text-center md:text-left">
          We value your privacy. Your data is protected with enterprise-grade encryption.
          Hushh Agents never sells your personal contact information to third parties
          without your explicit consent. Kirkland, WA compliance standards applied.
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[10px] md:text-xs text-white/40">
          <a className="hover:text-white transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-white transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-white transition-colors" href="#">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
}
