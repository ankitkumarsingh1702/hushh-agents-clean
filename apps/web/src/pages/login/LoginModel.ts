/** Login page data — pure functions, no React */

/** All UI copy for the login screen */
export function getLoginContent() {
  return {
    headerTitle: "Sign in",
    title: "Enter your email",
    supportCopy:
      "We'll send a one-time code to your inbox to verify your identity.",
    fieldLabel: "Enter your email",
    placeholder: "name@email.com",
    helperText:
      "Use the email address you want to receive advisor updates on.",
    ctaLabel: "Send code",
    secondaryCta: "Need help accessing your email?",
    loadingPhase1: "Checking workspace…",
    loadingPhase2: "Sending code…",
    validation: {
      invalid: "Enter a valid email address.",
      unsupported: "This email is not enabled for Hushh Agents yet.",
    },
  };
}

/** Validate email format */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const content = getLoginContent();
  const trimmed = email.trim();

  if (!trimmed) {
    return { valid: false, error: content.validation.invalid };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: content.validation.invalid };
  }

  return { valid: true };
}
