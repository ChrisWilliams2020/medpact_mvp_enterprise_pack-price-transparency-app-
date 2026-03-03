import { Container, Pill } from "@/components/ui";

export default function Page() {
  return (
    <main>
      <Container className="py-14 md:py-20">
        <div className="mb-4"><Pill>Platform</Pill></div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">An intelligence operating system — sitting above existing infrastructure.</h1>
        <p className="mt-4 max-w-3xl text-base text-black/70 md:text-lg">
          MedPACT is designed to integrate with the systems you already run (EHR/PM, billing workflows, clearinghouse data, operational logs),
          and convert fragmented signals into real-time payer intelligence, price transparency insight, and AI-driven operational automation.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { t: "Data unification", d: "Normalize fragmented inputs into a single, analyzable layer." },
            { t: "Intelligence engine", d: "Model payer behavior, denials, compression, and contract performance." },
            { t: "Automation layer", d: "Turn intelligence into workflows, alerts, and action — not static reports." },
          ].map((x) => (
            <div key={x.t} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">{x.t}</div>
              <div className="mt-2 text-sm text-black/70">{x.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-7">
          <div className="text-sm font-semibold">Note on outcomes</div>
          <p className="mt-2 text-sm text-black/70">
            MedPACT is built around aspirational benchmarks informed by modeling and early implementation objectives. Actual results vary by organization.
            We focus on transparency, accountability, and measurable execution — not promises.
          </p>
        </div>
      </Container>
    </main>
  );
}
