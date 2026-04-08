import Link from "next/link";
import { Container, Button, Pill } from "@/components/ui";

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 flex justify-center"><Pill>{kicker}</Pill></div>
      <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base text-black/70 md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

export default function Page() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-28 top-[-120px] h-[360px] w-[360px] rounded-full bg-[rgb(var(--platinum-300)/0.18)] blur-3xl" />
          <div className="absolute -right-28 top-[-100px] h-[400px] w-[400px] rounded-full bg-[rgb(var(--platinum-500)/0.12)] blur-3xl" />
        </div>

  <Container className="py-16 md:py-24 hero-platinum-accent">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 flex justify-center gap-2 animate-fade-in-up animate-on-load" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
              <Pill>Healthcare Intelligence Infrastructure™</Pill>
              <Pill>Real‑time payer intelligence</Pill>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl animate-fade-in-up animate-on-load" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              Real‑time payer intelligence for independent eyecare, private equity, and industry — scalable beyond.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-black/70 md:text-lg animate-fade-in-up animate-on-load" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              MedPACT is building the National Data Intelligence layer that sits above fragmented healthcare systems — designed to heal opacity,
              activate transparency, and empower providers with actionable leverage.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row flex-wrap animate-fade-in-up animate-on-load" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              <Link href="/contact"><Button>Request Executive Briefing</Button></Link>
              <Link href="/category"><Button variant="secondary">Explore the Category</Button></Link>
              {/* KCN Chat - Internal */}
              <Link href="/kcn-chat">
                <Button variant="secondary">KCN Chat</Button>
              </Link>
              {/* MedTech - Pharma & Device Sales Impact */}
              <Link href="/medtech">
                <Button variant="secondary">MedTech</Button>
              </Link>
              {/* Network Map */}
              <Link href="/network">
                <Button variant="secondary">Join the Network</Button>
              </Link>
              {/* Interactive Demo */}
              <Link href="/demo">
                <Button variant="ghost">See Demo</Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { t: "Payer Behavior", d: "Make the invisible visible: reimbursement patterns, denials, compression, contract performance." },
                { t: "Price Transparency", d: "Turn fragmented transparency mandates into usable, decision-grade intelligence." },
                { t: "AI Automation", d: "Shift from dashboards to operational automation — signal, action, and accountability." },
              ].map((c, i) => (
                <div key={c.t} className="rounded-3xl border border-black/10 bg-white p-6 text-left shadow-sm card-hover animate-fade-in-up animate-on-load" style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: 'forwards' }}>
                  <div className="text-sm font-semibold">{c.t}</div>
                  <div className="mt-2 text-sm text-black/70">{c.d}</div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-black/10 animate-fade-in-up animate-on-load" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
              <div className="text-xs text-black/40 text-center mb-4 uppercase tracking-wider">Trusted by leading healthcare organizations</div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
                  <span className="text-green-600">🔒</span>
                  <span className="text-xs font-medium text-green-700">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                  <span className="text-blue-600">✓</span>
                  <span className="text-xs font-medium text-blue-700">SOC 2 Type II</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200">
                  <span className="text-purple-600">🛡️</span>
                  <span className="text-xs font-medium text-purple-700">256-bit Encryption</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-40">
                <div className="text-sm font-semibold text-black/50">Major Health System</div>
                <div className="text-sm font-semibold text-black/50">Regional ASC Network</div>
                <div className="text-sm font-semibold text-black/50">Private Equity Portfolio</div>
                <div className="text-sm font-semibold text-black/50">Academic Medical Center</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ENROLLMENT / DEFINITION */}
      <section className="border-t border-black/10 bg-white">
        <Container className="py-16 md:py-20">
          <SectionTitle
            kicker="What MedPACT is"
            title="Not a vendor. An intelligence operating system."
            subtitle="Healthcare doesn’t have a data problem — it has an intelligence problem. MedPACT connects fragmented infrastructure and turns scattered data into action."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-black/10 p-7">
              <div className="text-sm font-semibold">Healthcare Intelligence Infrastructure™</div>
              <p className="mt-2 text-sm text-black/70">
                A new category: real‑time payer intelligence + actionable transparency + AI automation — delivered as an infrastructure layer
                that sits above existing systems.
              </p>
              <div className="mt-5 flex gap-3">
                <Link href="/category"><Button variant="secondary">See definition</Button></Link>
                <Link href="/manifesto"><Button variant="ghost">Read the manifesto</Button></Link>
              </div>
            </div>
            <div className="rounded-3xl border border-black/10 p-7">
              <div className="text-sm font-semibold">Enrollment over engagement</div>
              <p className="mt-2 text-sm text-black/70">
                MedPACT is built for organizations that want leverage — not noise. We enroll select partners and build around clarity,
                accountability, and scalable intelligence.
              </p>
              <div className="mt-5">
                <Link href="/contact"><Button>Enroll / Request briefing</Button></Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* INVESTOR-GRADE CREDIBILITY STRIP */}
      <section className="border-t border-black/10 bg-gradient-to-b from-white to-black/[0.02]">
        <Container className="py-16 md:py-20">
          <SectionTitle
            kicker="Why now"
            title="The Post‑PE Era will be defined by intelligence."
            subtitle="Scale without transparency creates fragility. The next winners will aggregate insight — and operationalize it in real time."
          />

          <p className="mt-6 text-center text-sm text-black/60">
            Operationally guided by <span className="font-semibold">Cathleen McCabe, MD</span>, Chief Officer of Operational Logistics — bringing national surgical innovation leadership to real‑world deployment and scale.
          </p>


          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Defensible data advantage", d: "Cross‑entity benchmarking, payer pattern libraries, and longitudinal intelligence compounding over time." },
              { t: "Operating leverage", d: "Automation that reduces friction and standardizes execution across sites, portfolios, and systems." },
              { t: "Category tailwinds", d: "Transparency mandates, reimbursement pressure, and AI-driven admin automation are converging into a structural reset." },
            ].map((c) => (
              <div key={c.t} className="rounded-3xl border border-black/10 bg-white p-6">
                <div className="text-sm font-semibold">{c.t}</div>
                <div className="mt-2 text-sm text-black/70">{c.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/platform"><Button variant="secondary">See platform overview</Button></Link>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-black/10 bg-medpact-black text-white">
        <Container className="py-14">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-sm font-semibold text-white/80">Start with an Executive Intelligence Briefing</div>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">Bring transparency to payer behavior — and action to data.</h3>
              <p className="mt-3 text-sm text-white/70">
                We’ll map payer dynamics, operational blind spots, and the intelligence architecture needed to move from opacity to leverage.
              </p>
            </div>
            <div className="flex gap-3 md:justify-end">
              <Link href="/contact"><Button className="bg-white text-medpact-black hover:opacity-90">Request briefing</Button></Link>
              <Link href="/team"><Button variant="ghost" className="text-white hover:bg-white/10">Meet the team</Button></Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
