import { Container, Pill, Button } from "@/components/ui";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <Container className="py-14 md:py-20">
        <div className="mb-4"><Pill>Resources</Pill></div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Insights, briefs, and transparency intelligence.</h1>
        <p className="mt-4 max-w-3xl text-base text-black/70 md:text-lg">
          Use this space for white papers (Post‑PE era, payer transparency), conference decks, webinars, and your demo video.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { t: "Executive Brief: The Post‑PE Era", d: "Why intelligence infrastructure is the next healthcare advantage.", cta: "Download PDF" },
            { t: "Payer Transparency Playbook", d: "Turn payer opacity into actionable leverage.", cta: "Download PDF" },
            { t: "Platform Walkthrough Video", d: "A short tour of payer intelligence + automation.", cta: "Watch" },
          ].map((x) => (
            <div key={x.t} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">{x.t}</div>
              <div className="mt-2 text-sm text-black/70">{x.d}</div>
              <div className="mt-5">
                <Button variant="secondary">{x.cta}</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/contact"><Button>Request Executive Briefing</Button></Link>
        </div>
      </Container>
    </main>
  );
}
