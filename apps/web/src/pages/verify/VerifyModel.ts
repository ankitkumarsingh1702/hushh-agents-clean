/** Verify page data — pure functions, no React */

/** Mask email: name@company.com → n***@company.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const masked = local[0] + "***";
  return `${masked}@${domain}`;
}

/** All UI copy for the verify screen */
export function getVerifyContent(email: string) {
  return {
    headerTitle: "Verify email",
    title: "Enter the 6-digit code",
    supportCopy: `We sent a code to ${maskEmail(email)}. It expires in 10 minutes.`,
    ctaLabel: "Verify and continue",
    resendWaiting: (seconds: number) => `Resend code in 00:${seconds.toString().padStart(2, "0")}`,
    resendReady: "Resend code",
    resending: "Sending…",
    changeEmail: "Change email",
    successCopy: "Email verified. Setting up your profile…",
    validation: {
      incomplete: "Please enter the full 6-digit code.",
      wrongCode: "That code doesn't match. Try again.",
      expiredCode: "This code has expired. Request a new one.",
    },
  };
}

/** Validate OTP format */
export function validateOtp(digits: string[]): { valid: boolean; error?: string } {
  const code = digits.join("");
  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    return { valid: false, error: getVerifyContent("").validation.incomplete };
  }
  return { valid: true };
}
