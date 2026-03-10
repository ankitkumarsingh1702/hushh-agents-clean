-- ============================================================
-- Migration: Consents + User Profiles + Preferences
-- Supports: S4 (Trust/Consent) and S5 (Basic Profile Setup)
-- ============================================================

-- ── Consents table (immutable audit-friendly records) ──
CREATE TABLE IF NOT EXISTS consents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('terms', 'privacy', 'messaging')),
  policy_version TEXT NOT NULL DEFAULT '1.0',
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address  TEXT,
  user_agent  TEXT,
  device_id   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consents_email ON consents(email);

-- ── User Profiles table ──
CREATE TABLE IF NOT EXISTS user_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  role            TEXT CHECK (role IN ('investor', 'family', 'founder', 'executive', 'other')),
  zip_code        TEXT,
  preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'chat', 'call')),
  avatar_url      TEXT,
  onboarding_step TEXT DEFAULT 'welcome' CHECK (onboarding_step IN (
    'welcome', 'trust_completed', 'profile_completed',
    'goals_completed', 'household_completed', 'location_completed',
    'notifications_completed', 'swipe_intro_completed', 'complete'
  )),
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- ── User Preferences table ──
CREATE TABLE IF NOT EXISTS user_preferences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL REFERENCES user_profiles(email) ON DELETE CASCADE,
  shopping_for    TEXT DEFAULT 'self' CHECK (shopping_for IN ('self', 'family', 'business')),
  preferred_language TEXT DEFAULT 'en',
  notification_enabled BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Auto-update updated_at trigger ──
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── RLS Policies ──
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (edge functions use service role)
CREATE POLICY "Service role full access on consents"
  ON consents FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on user_profiles"
  ON user_profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on user_preferences"
  ON user_preferences FOR ALL USING (true) WITH CHECK (true);
