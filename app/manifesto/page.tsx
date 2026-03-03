import { Container, Pill } from "@/components/ui";

export default function Page() {
  return (
    <main>
      <Container className="py-14 md:py-20">
        <div className="mb-4"><Pill>Manifesto</Pill></div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">The Post‑PE Healthcare Era</h1>
        <p className="mt-4 max-w-3xl text-base text-black/70 md:text-lg">
          Private equity reshaped healthcare through consolidation and operational standardization — but scale did not solve the core problem:
          opacity. The next era will be defined by intelligence: transparency that becomes leverage, and automation that becomes operating advantage.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 p-7">
            <div className="text-sm font-semibold">What broke</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
              <li>Payer behavior stayed opaque as consolidation accelerated</li>
              <li>Transparency mandates became compliance artifacts, not decision systems</li>
              <li>Admin work expanded while reimbursement compressed</li>
              <li>Data sprawl grew faster than the ability to act</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-black/10 p-7">
            <div className="text-sm font-semibold">What wins now</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
              <li>Real-time intelligence that compounds</li>
              <li>Automation that standardizes execution</li>
              <li>Benchmarking that restores negotiating leverage</li>
              <li>Infrastructure that empowers independence and scale</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-medpact-black p-8 text-white">
          <div className="text-sm font-semibold text-white/80">The thesis</div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight">
            The next decade won’t be won by the largest platforms — it will be won by the most informed.
          </div>
          <p className="mt-3 text-sm text-white/70">
            MedPACT exists to build the national intelligence layer above fragmented healthcare — designed to heal opacity and empower organizations
            with clarity, action, and leverage.
          </p>
        </div>
      </Container>
    </main>
  );
}
