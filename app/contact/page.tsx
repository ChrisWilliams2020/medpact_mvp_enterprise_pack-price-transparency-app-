import { Container, Pill, Button } from "@/components/ui";

export default function Page() {
  return (
    <main>
      <Container className="py-14 md:py-20">
        <div className="mb-4"><Pill>Contact</Pill></div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Request an Executive Intelligence Briefing</h1>
        <p className="mt-4 max-w-2xl text-base text-black/70 md:text-lg">
          Share a few details and we’ll schedule a briefing to map payer dynamics, transparency priorities, and the intelligence architecture
          required to move from opacity to leverage.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
            <div className="text-sm font-semibold">Briefing request form (placeholder)</div>
            <div className="mt-4 grid gap-3 text-sm">
              <input className="w-full rounded-2xl border border-black/15 px-4 py-3" placeholder="Name" />
              <input className="w-full rounded-2xl border border-black/15 px-4 py-3" placeholder="Email" />
              <input className="w-full rounded-2xl border border-black/15 px-4 py-3" placeholder="Organization" />
              <textarea className="w-full rounded-2xl border border-black/15 px-4 py-3" placeholder="What do you want to solve?" rows={4} />
              <Button>Submit</Button>
            </div>
            <div className="mt-3 text-xs text-black/50">
              Replace this form with HubSpot, Salesforce, or your preferred CRM embed.
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-7">
            <div className="text-sm font-semibold">What you’ll get</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
              <li>Payer behavior and denial pattern hypothesis map</li>
              <li>Transparency opportunities and data availability review</li>
              <li>Operational automation targets (throughput, staffing, workflows)</li>
              <li>Implementation path and enrollment fit</li>
            </ul>

            <div className="mt-8 text-xs text-black/50">
              Note: MedPACT focuses on measurable execution and transparency — outcomes vary by organization.
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
