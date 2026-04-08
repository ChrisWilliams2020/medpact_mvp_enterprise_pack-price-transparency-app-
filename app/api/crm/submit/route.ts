import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/crm/submit
 * Forwards Executive Briefing requests to the OnPacePlus CRM.
 * Also sends SMS notification to communications director.
 *
 * Expected body: { name, email, organization, message }
 *
 * Environment variables:
 *   ONPACEPLUS_CRM_URL   – The CRM endpoint URL (e.g., https://crm.onpaceplus.com/api/leads)
 *   ONPACEPLUS_CRM_KEY   – API key or bearer token for authentication (optional)
 *   TWILIO_ACCOUNT_SID   - For SMS notifications
 *   TWILIO_AUTH_TOKEN    - For SMS notifications
 *   TWILIO_PHONE_NUMBER  - Sender phone number
 *   NOTIFY_PHONE_NUMBER  - Communications director's phone
 */

interface BriefingRequest {
  name: string;
  email: string;
  organization?: string;
  message?: string;
}

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Input sanitization - remove potential XSS vectors
function sanitizeInput(input: string | undefined, maxLength: number = 500): string {
  if (!input) return "";
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers like onclick=
    .trim();
}

// Send SMS notification to communications director
async function sendSmsNotification(data: { name: string; email: string; organization?: string; type: string }) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    await fetch(`${baseUrl}/api/notify/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('[CRM] Failed to send SMS notification:', err);
    // Don't fail the main request if SMS fails
  }
}

// Send email notification (backup to SMS)
async function sendEmailNotification(data: { name: string; email: string; organization?: string; message?: string; type: string }) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    await fetch(`${baseUrl}/api/notify/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('[CRM] Failed to send email notification:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check content type
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const body = (await req.json()) as BriefingRequest;

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize all inputs
    const sanitizedName = sanitizeInput(body.name, 100);
    const sanitizedEmail = sanitizeInput(body.email, 254);
    const sanitizedOrg = sanitizeInput(body.organization, 200);
    const sanitizedMessage = sanitizeInput(body.message, 2000);

    // Validate sanitized inputs aren't empty
    if (!sanitizedName || !sanitizedEmail) {
      return NextResponse.json(
        { error: "Invalid input provided" },
        { status: 400 }
      );
    }

    const crmUrl = process.env.ONPACEPLUS_CRM_URL;
    const crmKey = process.env.ONPACEPLUS_CRM_KEY;

    // Send SMS notification to communications director (async, don't block)
    sendSmsNotification({
      name: sanitizedName,
      email: sanitizedEmail,
      organization: sanitizedOrg,
      type: 'Executive Briefing Request',
    });

    // Send email notification as backup (async, don't block)
    sendEmailNotification({
      name: sanitizedName,
      email: sanitizedEmail,
      organization: sanitizedOrg,
      message: sanitizedMessage,
      type: 'Executive Briefing Request',
    });

    if (!crmUrl) {
      // If CRM URL is not configured, log locally and return success
      // This allows the form to work in dev without a real CRM
      console.log("[CRM] No ONPACEPLUS_CRM_URL configured. Logging submission locally:");
      console.log("[CRM] Briefing Request:", JSON.stringify({
        name: sanitizedName,
        email: sanitizedEmail,
        organization: sanitizedOrg,
        message: sanitizedMessage,
      }, null, 2));
      return NextResponse.json({
        success: true,
        message: "Submission received (CRM not configured, logged locally)",
      });
    }

    // Build the payload for OnPacePlus CRM
    const crmPayload = {
      source: "MedPACT Website",
      type: "Executive Briefing Request",
      name: sanitizedName,
      email: sanitizedEmail,
      organization: sanitizedOrg,
      message: sanitizedMessage,
      submittedAt: new Date().toISOString(),
    };

    // Forward to the CRM
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (crmKey) {
      headers["Authorization"] = `Bearer ${crmKey}`;
    }

    const crmResponse = await fetch(crmUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(crmPayload),
    });

    if (!crmResponse.ok) {
      const errorText = await crmResponse.text();
      console.error("[CRM] Failed to submit to OnPacePlus CRM:", crmResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to submit to CRM", details: errorText },
        { status: 502 }
      );
    }

    const crmResult = await crmResponse.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      message: "Briefing request submitted successfully",
      crmId: crmResult.id || crmResult.leadId || null,
    });
  } catch (err) {
    console.error("[CRM] Error processing submission:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
