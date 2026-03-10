import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HushhAgentHeader from "../../components/HushhAgentHeader";
import HushhAgentHeading from "../../components/HushhAgentHeading";
import HushhAgentText from "../../components/HushhAgentText";
import HushhAgentCTA from "../../components/HushhAgentCTA";

const SUPABASE_URL = "https://gsqmwxqgqrgzhlhmbscg.supabase.co";

export default function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      // Navigate to verify page with email
      navigate("/verify", { state: { email } });
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-dark overflow-hidden">
      <HushhAgentHeader />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-brand-primary rounded-custom flex items-center justify-center">
              <span className="text-brand-dark font-black text-2xl">H</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <HushhAgentHeading level="h2">Welcome Back</HushhAgentHeading>
            <HushhAgentText size="md" muted className="mt-3">
              Enter your email to receive a verification code
            </HushhAgentText>
          </div>

          {/* Email Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-base"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <HushhAgentCTA
              label={loading ? "Sending..." : "Send Verification Code"}
              onClick={handleSendOTP}
              variant="primary"
              size="lg"
              showArrow={!loading}
              className="w-full"
            />
          </div>

          <div className="mt-8 text-center">
            <HushhAgentText size="xs" muted>
              We'll send a 6-digit code to your email. No password needed.
            </HushhAgentText>
          </div>
        </div>
      </main>
    </div>
  );
}
