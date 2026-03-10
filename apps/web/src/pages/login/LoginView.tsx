import { useLoginViewModel } from "./LoginViewModel";

export default function LoginView() {
  const {
    content,
    email,
    error,
    isLoading,
    buttonLabel,
    onBack,
    onEmailChange,
    onSendCode,
    onNeedHelp,
  } = useLoginViewModel();

  return (
    <div className="relative min-h-screen bg-brand-dark overflow-hidden">
      {/* Header — Back arrow + "Sign in" center title */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        {/* Left: Back arrow */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Center: Title */}
        <h1 className="text-base font-semibold text-white">
          {content.headerTitle}
        </h1>

        {/* Right: Blank spacer */}
        <div className="w-10 h-10" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {content.title}
          </h2>

          {/* Support copy */}
          <p className="text-sm sm:text-base text-white/60 mb-8 leading-relaxed">
            {content.supportCopy}
          </p>

          {/* Email Field */}
          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-white/70">
              {content.fieldLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && onSendCode()}
              placeholder={content.placeholder}
              className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-white/30 focus:outline-none transition-all text-base ${
                error
                  ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-white/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              }`}
              disabled={isLoading}
              autoFocus
              autoComplete="email"
            />
            {/* Error or Helper text */}
            {error ? (
              <p className="text-xs text-red-400 mt-1">{error}</p>
            ) : (
              <p className="text-xs text-white/40 mt-1">{content.helperText}</p>
            )}
          </div>

          {/* Primary CTA — Send code */}
          <button
            onClick={onSendCode}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-brand-primary/60 text-brand-dark/80 cursor-wait"
                : "bg-brand-primary text-brand-dark hover:brightness-110 active:scale-[0.98]"
            }`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {buttonLabel}
          </button>

          {/* Secondary CTA */}
          <div className="mt-6 text-center">
            <button
              onClick={onNeedHelp}
              className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
            >
              {content.secondaryCta}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
