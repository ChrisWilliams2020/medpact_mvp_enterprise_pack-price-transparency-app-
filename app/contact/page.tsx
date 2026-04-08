"use client";

import { useState, FormEvent } from "react";
import { Container, Pill, Button } from "@/components/ui";
import { CalendlyButton } from "@/components/Calendly";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/crm/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }

      setStatus("success");
      // Clear form
      setName("");
      setEmail("");
      setOrganization("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <main>
      <Container className="py-14 md:py-20">
        <div className="mb-4"><Pill>Contact</Pill></div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Request an Executive Intelligence Briefing
        </h1>
        <p className="mt-4 max-w-2xl text-base text-black/70 md:text-lg">
          Share a few details and we'll schedule a briefing to map payer dynamics, transparency priorities, and the intelligence architecture
          required to move from opacity to leverage.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
            <div className="text-sm font-semibold">Executive Briefing Request</div>

            {status === "success" ? (
              <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
                <strong>Thank you!</strong> Your request has been submitted. We will be in touch shortly to schedule your briefing.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 grid gap-3 text-sm">
                <input
                  className="w-full rounded-2xl border border-black/15 px-4 py-3"
                  placeholder="Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="w-full rounded-2xl border border-black/15 px-4 py-3"
                  placeholder="Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="w-full rounded-2xl border border-black/15 px-4 py-3"
                  placeholder="Organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
                <textarea
                  className="w-full rounded-2xl border border-black/15 px-4 py-3"
                  placeholder="What do you want to solve?"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting..." : "Submit"}
                </Button>

                {status === "error" && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
                    {errorMsg || "Something went wrong. Please try again."}
                  </div>
                )}
              </form>
            )}

            <div className="mt-3 text-xs text-black/50">
              Your information is sent securely to our team via OnPacePlus CRM.
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-7">
            <div className="text-sm font-semibold">What you will get</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
              <li>Payer behavior and denial pattern hypothesis map</li>
              <li>Transparency opportunities and data availability review</li>
              <li>Operational automation targets (throughput, staffing, workflows)</li>
              <li>Implementation path and enrollment fit</li>
            </ul>

            {/* Calendly Quick Schedule */}
            <div className="mt-8 pt-6 border-t border-black/10">
              <div className="text-sm font-semibold mb-3">Prefer to schedule directly?</div>
              <CalendlyButton 
                text="📅 Book a Demo Call"
                className="w-full justify-center"
              />
              <p className="mt-2 text-xs text-black/50 text-center">
                Skip the form — pick a time that works for you
              </p>
            </div>

            <div className="mt-8 text-xs text-black/50">
              Note: MedPACT focuses on measurable execution and transparency — outcomes vary by organization.
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
