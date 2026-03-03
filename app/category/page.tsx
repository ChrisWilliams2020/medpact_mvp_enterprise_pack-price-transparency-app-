import { Container, Pill } from "@/components/ui";

export default function Page() {
  return (
    <main>
      <Container className="py-14 md:py-20">
        <div className="mb-4"><Pill>Category</Pill></div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Healthcare Intelligence Infrastructure™</h1>
        <p className="mt-4 max-w-3xl text-base text-black/70 md:text-lg">
          A new category: an intelligence layer that sits above fragmented healthcare systems — connecting data sources, interpreting payer behavior,
          activating transparency, and automating operations in real time.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 p-7">
            <div className="text-sm font-semibold">What it replaces</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
              <li>Static reporting that arrives too late</li>
              <li>Vendor sprawl without accountability</li>
              <li>Opaque payer dynamics and denial whiplash</li>
              <li>Disconnected transparency requirements with no action path</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-black/10 p-7">
            <div className="text-sm font-semibold">What it enables</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
              <li>Real-time payer intelligence and contract performance visibility</li>
              <li>Actionable price transparency intelligence</li>
              <li>AI-driven operational automation and throughput alignment</li>
              <li>Benchmarking and leverage that compound over time</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-7">
          <div className="text-sm font-semibold">Positioning statement</div>
          <p className="mt-2 text-sm text-black/70">
            MedPACT is the operating system built on top of fragmented healthcare infrastructure — designed to heal opacity and empower providers,
            portfolios, and partners with intelligence that drives action.
          </p>
        </div>
      </Container>
    </main>
  );
}
