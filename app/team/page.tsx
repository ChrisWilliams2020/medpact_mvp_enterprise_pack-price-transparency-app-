import { Container, Pill } from "@/components/ui";
import TeamGrid from "@/components/TeamGrid";
import AdvisoryBoards from "@/components/AdvisoryBoards";

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
      "Dr. Christopher Williams is a physician–entrepreneur, innovator, and Founder & CEO of MedPact, focused on transforming healthcare through data intelligence and scalable software platforms. Trained at the University of Iowa and Wills Eye Hospital, he has performed over 30,000 cataract and LASIK procedures. A lifelong builder, he developed early interactive medical education tools, pioneered real-time telemedicine solutions, and holds multiple patents in blockchain-based healthcare data storage. He contributes surgical expertise to underserved communities in rural Africa. His vision: create the intelligence infrastructure that enables providers to compete, thrive, and lead.",
  },
  {
    name: "Richard Lindstrom, MD",
    title: "Senior Advisor",
    focus: ["Strategic guidance", "Clinical integrity", "National ophthalmology credibility"],
    highlight:
      "Dr. Richard L. Lindstrom is a board-certified ophthalmologist and internationally recognized leader in cornea, cataract, refractive, and laser surgery. Founder of Minnesota Eye Consultants and Attending Surgeon Emeritus, he has spent over 55 years advancing ophthalmology. He has authored 400+ publications, holds 45 patents—including Optisol GS—and has served as President of multiple major ophthalmic societies. Widely honored, he is considered one of the most influential figures in ophthalmology worldwide.",
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
      "Dr. Jason Bacharach is a glaucoma consultant in Sonoma County, California since 1993. He is the Founding Partner as well as Medical & Research Director of North Bay Eye Associates, Inc., a multi-subspecialty ophthalmology practice. He serves on multiple advisory boards and consults for various ophthalmologic pharmaceutical and surgical manufacturers. Academically, he is Chair of the Department of Glaucoma at California Pacific Medical Center, in San Francisco, California.",
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
      "Cathleen McCabe, MD, is a board-certified ophthalmologist with extensive surgical experience in cataract and refractive procedures at The Eye Associates in Sarasota, Florida. As a MedPACT board member, she leverages leadership expertise as Past President of OOSS, Executive Board member and Chair of the Sustainability Clinical Committee for ASCRS, and currently Chief Medical Officer at Eye Health America. Recognized as an innovator in cataract surgery, she has contributed to numerous clinical trials involving intraocular lenses, glaucoma devices, and dry eye treatments.",
  },
  {
    name: "Brian Murphey",
    title: "Chief Commercialization Officer (CCO)",
    focus: ["Go-to-market execution", "Marketing positioning", "Sales strategy execution"],
    highlight:
      "Current Radius executive and MedPACT Chief Commercialization Officer; drives national lead generation and footprint expansion across independent and PE-backed groups.",
  },
  {
    name: "Terrence Duckette",
    title: "Chief Strategy & Sales Leadership",
    focus: ["Growth strategy", "Brand positioning", "Sales leadership", "National expansion"],
    highlight:
      "Leads sales management, marketing communications, and overall brand strategy—aligning growth with long-term corporate vision.",
  },
  {
    name: "Dave Davis",
    title: "Operations & Business Planning",
    focus: ["Operating cadence", "Business planning", "Milestone execution", "Cross-functional alignment"],
    highlight:
      "Founder and operating executive of technology and ISO-certified medical device companies. Extensive experience in strategy and managing growth from concept to market leadership. Active in charitable and community organizations, and has been a board member, advisor, and investor in entrepreneurial ventures. He holds a BBA from Ursinus College and is working toward a Master's degree in Psychology at Harvard University.",
  },
  {
    name: "Rob Ostoich",
    title: "President of Sales",
    focus: ["Revenue engine buildout", "CRM & sales infrastructure", "Pricing & packaging", "Conversion optimization"],
    highlight:
      "With over 30 years in enterprise software sales, Rob has helped companies of all sizes—from agile startups to global software leaders—achieve exceptional growth. A proven sales leader and hands-on contributor, he combines strategic insight with practical execution. Passionate about driving results and building lasting client relationships, Rob brings both experience and energy to every venture.",
  },
  {
    name: "Bill Williams",
    title: "Corporate Governance & Contracts",
    focus: ["Governance", "Contract execution", "Institutional discipline", "Risk management"],
    highlight:
      "Former CFO at MetricStream and LifeScan; former Comptroller at McNeil Pharma—bringing public-company grade controls and contracting discipline.",
  },
  {
    name: "Zaina Al-Mohtaseb, MD",
    title: "Medical Advisory Board | Cataract & Refractive Specialist",
    focus: ["Cataract surgery", "Refractive surgery", "Clinical research", "Surgical innovation"],
    highlight:
      "Dr. Zaina Al-Mohtaseb is a board-certified ophthalmologist specializing in cataract and refractive surgery at Whitsett Vision Group in Houston, Texas. She is fellowship-trained in cornea, external disease, and refractive surgery, and is recognized for her expertise in premium lens implants and advanced surgical techniques. Dr. Al-Mohtaseb serves on MedPACT's Medical Advisory Board, bringing clinical excellence and real-world surgical insight to the platform.",
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
      "Lindsay Saddic is the Director of Communications and Assistant to Chris Williams, managing internal and external communications and supporting key organizational initiatives. She brings a strong foundation in strategic messaging, organization, and cross-functional collaboration. She graduated cum laude from Washington College with a degree in Clinical Psychology. As a four-year varsity volleyball student-athlete, she developed a disciplined, team-oriented approach that informs her work today.",
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
      "Chris Louis is a teacher, author, father and ritualist. Chris has spent most of his adult life building businesses, traveling the world and exploring consciousness.",
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

        {/* Advisory Boards Section */}
        <div className="mt-20 pt-16 border-t border-black/10">
          <div className="mb-4"><Pill>Advisory Boards</Pill></div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Strategic Guidance</h2>
          <p className="mt-4 max-w-3xl text-base text-black/70 md:text-lg">
            MedPACT is guided by distinguished leaders across medicine, technology, practice management, and strategic consulting—ensuring our platform delivers real-world value at every level of healthcare operations.
          </p>
          
          <AdvisoryBoards />
        </div>

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
