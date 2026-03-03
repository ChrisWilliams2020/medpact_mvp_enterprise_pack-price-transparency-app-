import { Container, Pill } from "@/components/ui";
import TeamGrid from "@/components/TeamGrid";

type Member = {
  name: string;
  title: string;
  focus: string[];
  highlight?: string;
  note?: string;
};

const members: Member[] = [
  {
    name: "Christopher Williams, MD",
    title: "Founder & Chief Executive Officer | Head of Software Development",
    focus: [
      "Company vision & strategy",
      "Platform architecture",
      "Scalability & execution",
      "Physician-aligned data intelligence",
    ],
    highlight:
      "Practicing ophthalmologist; founder of OnPacePlus and MedPACT—building Healthcare Intelligence Infrastructure™ on top of fragmented healthcare systems.",
  },
  {
    name: "Jason Bacharach, MD",
    title: "Medical Director | Corporate Development & Market Positioning",
    focus: [
      "Clinical oversight",
      "Workflow validation",
      "Corporate development & industry positioning",
      "Conference & event strategy",
    ],
    highlight:
      "Bridges real-world ophthalmology practice dynamics with operational intelligence to ensure the platform enhances—not burdens—clinical workflows.",
  },
  {
    name: "Cathleen McCabe, MD",
    title: "Chief Officer of Operational Logistics",
    focus: [
      "Surgical innovation & premium cataract leadership",
      "Operational scaling & workflow validation",
      "Clinical adoption & change management",
      "Industry alignment & real‑world evidence",
    ],
    highlight:
      "National cataract & refractive surgery innovation leader who operationalizes clinical excellence—validating real‑world deployment, workflow impact, and scalability across ophthalmic enterprises.",
  },
  {
    name: "Richard Lindstrom, MD",
    title: "Senior Advisor",
    focus: ["Strategic guidance", "Clinical integrity", "National ophthalmology credibility"],
    highlight:
      "Provides platform validation and national positioning guidance to ensure clinical integrity at scale.",
  },
  {
    name: "Terrence Duckette",
    title: "Chief Strategy & Sales Leadership",
    focus: ["Growth strategy", "Brand positioning", "Sales leadership", "National expansion"],
    highlight:
      "Leads sales management, marketing communications, and overall brand strategy—aligning growth with long-term corporate vision.",
  },
  {
    name: "Brian Murphey",
    title: "Chief Commercial Officer (CCO)",
    focus: ["Go-to-market execution", "Marketing positioning", "Sales strategy execution"],
    highlight:
      "Former RadiusXR commercial leader; drives national lead generation and footprint expansion across independent and PE-backed groups.",
  },
  {
    name: "Rob Ostoich",
    title: "President of Sales",
    focus: ["Revenue engine buildout", "CRM & sales infrastructure", "Pricing & packaging", "Conversion optimization"],
    highlight:
      "30+ years in enterprise software sales leadership—including Director of Sales experience with companies such as SAP—building repeatable growth systems.",
  },
  {
    name: "Bill Williams",
    title: "Corporate Governance & Contracts",
    focus: ["Governance", "Contract execution", "Institutional discipline", "Risk management"],
    highlight:
      "Former CFO at MetricStream and LifeScan; former Comptroller at McNeil Pharma—bringing public-company grade controls and contracting discipline.",
  },
  {
    name: "Dave Davis",
    title: "Operations & Business Planning",
    focus: ["Operating cadence", "Business planning", "Milestone execution", "Cross-functional alignment"],
    highlight:
      "Serial entrepreneur and inventor focused on translating strategy into measurable operational milestones.",
  },
  {
    name: "Anita Galiano",
    title: "Human Resources & Organizational Infrastructure (OnPace)",
    focus: ["HR strategy", "Operational systems", "Documentation infrastructure", "Innovation Hub enablement"],
    highlight:
      "President of a New Jersey school board and foundation leader for a Black museum—building strong people systems and organizational infrastructure.",
  },
  {
    name: "Diana Banks",
    title: "Board Relations | Operations (OnPace)",
    focus: ["Board relations", "Operational coordination", "Governance communications"],
    highlight:
      "CEO of a Washington, D.C. nonprofit; supports governance alignment and executive coordination as MedPACT scales.",
  },
  {
    name: "Lindsay Saddic",
    title: "Communications | Research | CRM Management",
    focus: ["Corporate communications", "Research initiatives", "Executive coordination", "CRM oversight"],
    highlight:
      "Owns messaging alignment, research, and CRM hygiene to keep internal intelligence systems and external communications coherent at scale.",
  },
  {
    name: "Chuck Yardley (Advisor)",
    title: "Software Design | Compliance | Development Management (OnPace)",
    focus: ["Software design", "Compliance oversight", "Developer management", "Security & regulatory alignment"],
    highlight:
      "Leads secure-by-design software development management and compliance oversight to keep the platform scalable and regulation-ready.",
  },
  {
    name: "Robel Tadele",
    title: "IT | Software Development (OnPace)",
    focus: ["Technical infrastructure", "Development execution", "Platform reliability", "Internal IT systems"],
    highlight:
      "Supports MedPACT’s technical backbone—stability, development velocity, and IT systems required for a national intelligence platform.",
  },
  {
    name: "Chris Louis",
    title: "Product Testing | Quality Assurance",
    focus: ["Testing strategy", "Release validation", "Quality systems", "Operational reliability"],
    highlight:
      "Author, tennis professional, and founder of a padel facility management company—brings performance discipline and execution rigor to product QA.",
  },
];

export default function Page() {
  return (
    <main>
      <Container className="py-14 md:py-20">
        <div className="mb-4"><Pill>Team</Pill></div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Built by clinicians, operators, and infrastructure builders.</h1>
        <p className="mt-4 max-w-3xl text-base text-black/70 md:text-lg">
          MedPACT’s leadership spans clinical oversight, strategy, software architecture, revenue operations, governance, and market expansion —
          aligned around a single mission: build the national intelligence backbone for independent ophthalmology, scalable beyond.
        </p>

  <TeamGrid members={members} />

        <div className="mt-12 rounded-3xl border border-black/10 bg-black/[0.02] p-7">
          <div className="text-sm font-semibold">How to strengthen this page</div>
          <p className="mt-2 text-sm text-black/70">
            For members with limited or ambiguous public footprint, add official LinkedIn URLs or internal bios. This prevents mistaken identity and
            lets the site confidently highlight the team’s credibility with verifiable sourcing.
          </p>
        </div>
      </Container>
    </main>
  );
}
