/* ── Settings / My Profile — View ── Onboarding-style redesign ── */

import { useSettingsViewModel } from "./SettingsViewModel";
import { getSettingsContent } from "./SettingsModel";
import HushhAgentHeading from "../../components/HushhAgentHeading";
import HushhAgentText from "../../components/HushhAgentText";
import HushhAgentCTA from "../../components/HushhAgentCTA";
import HushhAgentFooter from "../../components/HushhAgentFooter";

/* ── Duo-tone SVG Icons (matching onboarding style) ── */
function UserIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.3 21a1.94 1.94 0 003.4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Toggle component (dark theme) ── */
function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button onClick={onToggle} className="flex items-center justify-between w-full py-3">
      <span className="text-sm text-white/70 font-medium">{label}</span>
      <div className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-brand-primary" : "bg-white/15"}`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </div>
    </button>
  );
}

/* ── Read-only info row (dark theme) ── */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="text-brand-primary mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold leading-none mb-1">{label}</p>
        <p className="text-sm text-white/90 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

/* ── Editable input row (dark theme) ── */
function EditRow({ icon, label, value, onChange, placeholder }: {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="text-brand-primary mt-3">{icon}</span>
      <div className="flex-1">
        <label className="block text-xs text-white/40 uppercase tracking-widest font-semibold mb-1.5">{label}</label>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-custom text-white placeholder:text-white/25 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm font-medium"
        />
      </div>
    </div>
  );
}

/* ── Chip list (dark theme) ── */
function ChipList({ items, label, icon }: { items: string[]; label: string; icon: React.ReactNode }) {
  if (!items.length) return null;
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="text-brand-primary mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-2">{label}</p>
        <div className="flex flex-wrap gap-2">
          {items.map(item => (
            <span key={item} className="px-3 py-1.5 bg-brand-primary/15 text-brand-primary text-xs font-medium rounded-custom border border-brand-primary/30">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section Card ── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white/5 rounded-custom border border-white/10 px-4 sm:px-5 divide-y divide-white/5">
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest py-3.5">{title}</h3>
      {children}
    </section>
  );
}

export default function SettingsView() {
  const vm = useSettingsViewModel();
  const content = getSettingsContent();

  if (vm.loading) {
    return (
      <div className="bg-brand-dark min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-brand-primary rounded-full" />
      </div>
    );
  }

  const { profile } = vm.data;
  const initials = profile.fullName
    ? profile.fullName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="bg-brand-dark text-white font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
      {/* ── Header — matches onboarding header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-brand-dark/95 backdrop-blur-md border-b border-white/5">
        <button
          onClick={vm.onBack}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-custom hover:bg-white/10 transition-colors border border-white/10"
          aria-label="Go back"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xs sm:text-sm font-medium text-white/50 tracking-widest uppercase">
          My Profile
        </span>
        {vm.dirty ? (
          <button
            onClick={vm.onSave}
            disabled={vm.saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-custom shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all"
          >
            {vm.saving ? "Saving…" : "Save"}
          </button>
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10" />
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col items-center pt-20 sm:pt-24 pb-32 px-4 sm:px-6">
        <div className="w-full max-w-lg space-y-6">

          {/* ── Status messages ── */}
          {vm.error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-custom font-medium">{vm.error}</div>
          )}
          {vm.successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-custom font-medium">{vm.successMsg}</div>
          )}

          {/* ── Avatar + Name Hero ── */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center text-white/60 text-xl sm:text-2xl font-bold overflow-hidden mb-4">
              {profile.avatarUrl
                ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                : <span className="font-serif">{initials}</span>}
            </div>
            <HushhAgentHeading level="h3">{profile.fullName || "Your Name"}</HushhAgentHeading>
            <div className="mt-1">
              <HushhAgentText size="sm" muted>{profile.email}</HushhAgentText>
            </div>
          </div>

          {/* ── Section: Profile Details (editable) ── */}
          <SectionCard title="Profile">
            <EditRow
              icon={<UserIcon />}
              label="Full Name"
              value={profile.fullName}
              onChange={v => vm.updateProfile("fullName", v)}
              placeholder="Enter your name"
            />
            <InfoRow icon={<MailIcon />} label="Email" value={profile.email} />
            <EditRow
              icon={<MapPinIcon />}
              label="ZIP Code"
              value={profile.zip}
              onChange={v => vm.updateProfile("zip", v)}
              placeholder="e.g. 94105"
            />
            <EditRow
              icon={<PhoneIcon />}
              label="Preferred Contact"
              value={profile.contactPref}
              onChange={v => vm.updateProfile("contactPref", v)}
              placeholder="email / chat / call"
            />
          </SectionCard>

          {/* ── Section: Goals & Preferences ── */}
          {(vm.data.goals.length > 0 || vm.data.primaryGoal || vm.data.timeline) && (
            <SectionCard title="Goals & Preferences">
              <ChipList items={vm.data.goals} label="Selected Goals" icon={<TargetIcon />} />
              <InfoRow icon={<TargetIcon />} label="Primary Goal" value={vm.data.primaryGoal} />
              <InfoRow icon={<ClockIcon />} label="Timeline" value={vm.data.timeline} />
              <InfoRow icon={<MessageIcon />} label="Communication Style" value={vm.data.communicationStyle} />
            </SectionCard>
          )}

          {/* ── Section: Coverage Details ── */}
          {(vm.data.connectPrefs.length > 0 || vm.data.coverageTimeline || vm.data.householdSize) && (
            <SectionCard title="Coverage Details">
              <ChipList items={vm.data.connectPrefs} label="Connection Preferences" icon={<PhoneIcon />} />
              <InfoRow icon={<ClockIcon />} label="Coverage Timeline" value={vm.data.coverageTimeline} />
              <InfoRow icon={<ShieldIcon />} label="Currently Insured" value={vm.data.insuredStatus} />
              <InfoRow icon={<UsersIcon />} label="Household Size" value={vm.data.householdSize} />
            </SectionCard>
          )}

          {/* ── Section: Notifications ── */}
          <SectionCard title="Notifications">
            <div className="flex items-center gap-3">
              <span className="text-brand-primary"><BellIcon /></span>
              <div className="flex-1">
                <Toggle on={vm.data.notificationEmail} onToggle={vm.toggleNotifEmail} label="Email alerts" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-brand-primary"><BellIcon /></span>
              <div className="flex-1">
                <Toggle on={vm.data.notificationPush} onToggle={vm.toggleNotifPush} label="Push notifications" />
              </div>
            </div>
          </SectionCard>

          {/* ── Section: Privacy & Data ── */}
          <SectionCard title="Privacy & Data">
            <div className="flex items-center gap-3">
              <span className="text-brand-primary"><ShieldIcon /></span>
              <div className="flex-1">
                <Toggle on={vm.data.dataSharing} onToggle={vm.toggleDataSharing} label="Data sharing for better matches" />
              </div>
            </div>
            <button
              onClick={vm.onExportData}
              className="flex items-center gap-3 w-full py-3 text-left group"
            >
              <span className="text-brand-primary"><DownloadIcon /></span>
              <span className="text-sm text-white/70 font-medium group-hover:text-white transition-colors">{content.exportLabel}</span>
            </button>
            {vm.exportRequested && (
              <p className="text-xs text-emerald-400 py-2 pl-8">Export downloaded!</p>
            )}
          </SectionCard>

          {/* ── Section: Account Actions ── */}
          <SectionCard title="Account">
            <button
              onClick={vm.onSignOut}
              className="flex items-center gap-3 w-full py-3.5 text-left group"
            >
              <span className="text-white/50 group-hover:text-white transition-colors"><LogOutIcon /></span>
              <span className="text-sm text-white/70 font-medium group-hover:text-white transition-colors">{content.signOutLabel}</span>
            </button>
            <button
              onClick={vm.onToggleDeleteConfirm}
              className="flex items-center gap-3 w-full py-3.5 text-left group"
            >
              <span className="text-red-400/70 group-hover:text-red-400 transition-colors"><TrashIcon /></span>
              <span className="text-sm text-red-400/70 font-medium group-hover:text-red-400 transition-colors">{content.deleteLabel}</span>
            </button>
          </SectionCard>

          {/* ── Save CTA (when dirty) ── */}
          {vm.dirty && (
            <div className="pt-2">
              <HushhAgentCTA
                label={vm.saving ? "Saving…" : "Save Changes"}
                onClick={vm.onSave}
                variant="primary"
                size="lg"
                showArrow={!vm.saving}
                disabled={vm.saving}
                className="w-full"
              />
            </div>
          )}

          {/* ── Delete Confirm Dialog ── */}
          {vm.deleteConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
              <div className="bg-brand-dark rounded-custom border border-white/10 p-6 max-w-sm w-full shadow-2xl">
                <HushhAgentHeading level="h3" className="mb-2">Delete account?</HushhAgentHeading>
                <HushhAgentText size="sm" muted className="mb-6">
                  This will permanently remove your profile, saved agents, conversations, and all data. This action cannot be undone.
                </HushhAgentText>
                <div className="flex gap-3">
                  <button
                    onClick={vm.onToggleDeleteConfirm}
                    className="flex-1 py-3 text-sm font-bold text-white/70 bg-white/10 rounded-custom hover:bg-white/20 transition-colors border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { vm.onDeleteAccount(); vm.onToggleDeleteConfirm(); }}
                    className="flex-1 py-3 text-sm font-bold text-white bg-red-600 rounded-custom hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Footer links ── */}
          <div className="text-center pt-4">
            <HushhAgentText size="xs" muted>
              <a href="/terms" className="hover:text-white/60 transition-colors underline underline-offset-4 decoration-white/20">Terms of Service</a>
              {" · "}
              <a href="/privacy" className="hover:text-white/60 transition-colors underline underline-offset-4 decoration-white/20">Privacy Policy</a>
              {" · "}
              <a href="mailto:support@hushh.ai" className="hover:text-white/60 transition-colors underline underline-offset-4 decoration-white/20">Contact support</a>
            </HushhAgentText>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <HushhAgentFooter />
    </div>
  );
}
