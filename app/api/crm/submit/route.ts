import { NextRequest, NextResponse } from "next/server";

interface BriefingRequest {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  practiceType?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeInput(input: string | undefined, maxLength: number = 500): string {
  if (!input) return "";
  return input.slice(0, maxLength).replace(/[<>]/g, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    const body = (await req.json()) as BriefingRequest;

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const sanitizedData: BriefingRequest = {
      name: sanitizeInput(body.name, 100),
      email: sanitizeInput(body.email, 254),
      phone: sanitizeInput(body.phone, 20),
      organization: sanitizeInput(body.organization, 200),
      practiceType: sanitizeInput(body.practiceType, 100),
      message: sanitizeInput(body.message, 2000),
    };

    if (!sanitizedData.name || !sanitizedData.email) {
      return NextResponse.json({ error: "Invalid input provided" }, { status: 400 });
    }

    const baseUrl = process.env.VERCEL_URL
      ? "https://" + process.env.VERCEL_URL
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Save to briefings database
    let briefingId = null;
    try {
      const res = await fetch(baseUrl + "/api/briefings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sanitizedData, source: "Website Contact Form" }),
      });
      const result = await res.json();
      briefingId = result.briefing?.id || null;
    } catch (err) {
      console.error("[CRM] Failed to save briefing:", err);
    }

    // Send SMS notification
    try {
      await fetch(baseUrl + "/api/notify/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizedData.name,
          email: sanitizedData.email,
          organization: sanitizedData.organization,
          type: "Executive Briefing Request",
        }),
      });
    } catch (err) {
      console.error("[CRM] SMS failed:", err);
    }

    // Send email notification
    try {
      await fetch(baseUrl + "/api/notify/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sanitizedData,
          type: "Executive Briefing Request",
        }),
      });
    } catch (err) {
      console.error("[CRM] Email failed:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Your briefing request has been submitted successfully.",
      briefingId,
    });
  } catch (err) {
    console.error("[CRM] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
