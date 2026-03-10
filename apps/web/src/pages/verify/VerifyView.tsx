import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HushhAgentHeader from "../../components/HushhAgentHeader";
import HushhAgentHeading from "../../components/HushhAgentHeading";
import HushhAgentText from "../../components/HushhAgentText";
import HushhAgentCTA from "../../components/HushhAgentCTA";

const SUPABASE_URL = "https://gsqmwxqgqrgzhlhmbscg.supabase.co";

export default function VerifyView() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate("/login/email");
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verification failed");

      setSuccess(true);
      // TODO: Navigate to dashboard after successful verification
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid code");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to resend");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <HushhAgentHeading level="h2">Verified!</HushhAgentHeading>
          <HushhAgentText size="md" muted className="mt-3">
            Welcome, {email}
          </HushhAgentText>
          <div className="mt-6">
            <HushhAgentCTA label="Go to Home" onClick={() => navigate("/")} variant="primary" size="md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-brand-dark overflow-hidden">
      <HushhAgentHeader />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => navigate("/login/email")}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Change email</span>
          </button>

          <div className="text-center mb-8">
            <HushhAgentHeading level="h2">Enter Code</HushhAgentHeading>
            <HushhAgentText size="md" muted className="mt-3">
              We sent a 6-digit code to
            </HushhAgentText>
            <HushhAgentText size="md" className="font-semibold text-brand-primary">
              {email}
            </HushhAgentText>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-white/5 border rounded-xl text-white focus:outline-none transition-all ${
                  digit ? "border-brand-primary" : "border-white/10"
                } focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`}
                disabled={loading}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center mb-4">
              {error}
            </div>
          )}

          <HushhAgentCTA
            label={loading ? "Verifying..." : "Verify Code"}
            onClick={() => handleVerify()}
            variant="primary"
            size="lg"
            showArrow={!loading}
            className="w-full"
          />

          {/* Resend */}
          <div className="mt-6 text-center">
            <HushhAgentText size="sm" muted>
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-brand-primary hover:underline font-semibold disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend"}
              </button>
            </HushhAgentText>
          </div>
        </div>
      </main>
    </div>
  );
}
