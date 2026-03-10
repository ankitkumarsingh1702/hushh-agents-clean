import HushhAgentHeader from "../../components/HushhAgentHeader";
import HushhAgentFooter from "../../components/HushhAgentFooter";
import HushhAgentHeading from "../../components/HushhAgentHeading";
import HushhAgentTitle from "../../components/HushhAgentTitle";
import HushhAgentText from "../../components/HushhAgentText";
import HushhAgentCTA from "../../components/HushhAgentCTA";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="mb-6 pb-3 border-b border-white/10">
        <p className="text-xs font-mono uppercase tracking-widest text-brand-primary">{title}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Showcase({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <p className="text-xs font-mono text-white/40 mb-4">{label}</p>
      {children}
    </div>
  );
}

export default function ComponentLibraryView() {
  return (
    <div className="relative min-h-screen bg-brand-dark overflow-x-hidden">
      {/* Header */}
      <HushhAgentHeader onLogin={() => alert("Login clicked")} />

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-32">
        <div className="mb-12">
          <HushhAgentHeading level="h1">
            Component Library
          </HushhAgentHeading>
          <HushhAgentText size="lg" muted className="mt-4">
            All Hushh Agent common components in one place.
          </HushhAgentText>
        </div>

        {/* ─── HushhAgentHeading ─── */}
        <Section title="HushhAgentHeading">
          <Showcase label='level="h1"'>
            <HushhAgentHeading level="h1">Heading Level 1</HushhAgentHeading>
          </Showcase>
          <Showcase label='level="h2"'>
            <HushhAgentHeading level="h2">Heading Level 2</HushhAgentHeading>
          </Showcase>
          <Showcase label='level="h3"'>
            <HushhAgentHeading level="h3">Heading Level 3</HushhAgentHeading>
          </Showcase>
          <Showcase label='level="h1" italic'>
            <HushhAgentHeading level="h1" italic>Italic Heading</HushhAgentHeading>
          </Showcase>
        </Section>

        {/* ─── HushhAgentTitle ─── */}
        <Section title="HushhAgentTitle">
          <Showcase label='size="lg"'>
            <HushhAgentTitle size="lg">Large Title</HushhAgentTitle>
          </Showcase>
          <Showcase label='size="md"'>
            <HushhAgentTitle size="md">Medium Title</HushhAgentTitle>
          </Showcase>
          <Showcase label='size="sm"'>
            <HushhAgentTitle size="sm">Small Title</HushhAgentTitle>
          </Showcase>
        </Section>

        {/* ─── HushhAgentText ─── */}
        <Section title="HushhAgentText">
          <Showcase label='size="lg"'>
            <HushhAgentText size="lg">
              Large body text — used for hero subtitles and key descriptions.
            </HushhAgentText>
          </Showcase>
          <Showcase label='size="md"'>
            <HushhAgentText size="md">
              Medium body text — default size for paragraphs and content.
            </HushhAgentText>
          </Showcase>
          <Showcase label='size="sm"'>
            <HushhAgentText size="sm">
              Small body text — used for secondary information and captions.
            </HushhAgentText>
          </Showcase>
          <Showcase label='size="xs"'>
            <HushhAgentText size="xs">
              Extra small text — used for fine print and labels.
            </HushhAgentText>
          </Showcase>
          <Showcase label='size="md" muted'>
            <HushhAgentText size="md" muted>
              Muted text — reduced opacity for secondary content.
            </HushhAgentText>
          </Showcase>
        </Section>

        {/* ─── HushhAgentCTA ─── */}
        <Section title="HushhAgentCTA">
          <Showcase label='variant="primary" size="lg"'>
            <HushhAgentCTA label="Get Started" variant="primary" size="lg" />
          </Showcase>
          <Showcase label='variant="primary" size="md"'>
            <HushhAgentCTA label="Continue" variant="primary" size="md" />
          </Showcase>
          <Showcase label='variant="primary" size="sm"'>
            <HushhAgentCTA label="Next" variant="primary" size="sm" />
          </Showcase>
          <Showcase label='variant="outline" size="lg"'>
            <HushhAgentCTA label="Learn More" variant="outline" size="lg" />
          </Showcase>
          <Showcase label='variant="outline" size="md" showArrow={false}'>
            <HushhAgentCTA label="Cancel" variant="outline" size="md" showArrow={false} />
          </Showcase>
          <div className="flex flex-wrap gap-4">
            <Showcase label="Buttons side by side">
              <div className="flex flex-wrap gap-3">
                <HushhAgentCTA label="Primary" variant="primary" size="md" />
                <HushhAgentCTA label="Outline" variant="outline" size="md" />
              </div>
            </Showcase>
          </div>
        </Section>

        {/* ─── HushhAgentHeader ─── */}
        <Section title="HushhAgentHeader">
          <Showcase label="Fixed header at top of page (scroll up to see)">
            <HushhAgentText size="sm" muted>
              The header is rendered at the top of this page with logo, nav links,
              login button, and mobile hamburger menu.
            </HushhAgentText>
          </Showcase>
        </Section>

        {/* ─── HushhAgentFooter ─── */}
        <Section title="HushhAgentFooter">
          <Showcase label="Footer with privacy info and links">
            <div className="relative h-24">
              <HushhAgentFooter />
            </div>
          </Showcase>
        </Section>
      </main>
    </div>
  );
}
