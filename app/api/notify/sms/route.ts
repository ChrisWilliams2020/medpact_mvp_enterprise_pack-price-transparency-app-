import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/notify/sms
 * Sends SMS notification to the communications director when a lead comes in.
 * 
 * Uses Twilio for SMS delivery.
 * 
 * Environment variables:
 *   TWILIO_ACCOUNT_SID    - Twilio account SID
 *   TWILIO_AUTH_TOKEN     - Twilio auth token
 *   TWILIO_PHONE_NUMBER   - Your Twilio phone number (sender)
 *   NOTIFY_PHONE_NUMBER   - Communications director's phone number (recipient)
 */

interface NotificationPayload {
  name: string;
  email: string;
  organization?: string;
  type: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as NotificationPayload;
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    const notifyPhone = process.env.NOTIFY_PHONE_NUMBER;
    
    // If Twilio not configured, log and return
    if (!accountSid || !authToken || !twilioPhone || !notifyPhone) {
      console.log("[SMS] Twilio not configured. Would have sent notification:");
      console.log(`[SMS] New ${body.type}: ${body.name} (${body.email}) from ${body.organization || 'N/A'}`);
      return NextResponse.json({ 
        success: true, 
        message: "SMS not sent (Twilio not configured)",
        configured: false 
      });
    }
    
    // Build the SMS message
    const message = `🚨 MedPACT New Lead\n\n${body.type}\n\nName: ${body.name}\nEmail: ${body.email}${body.organization ? `\nOrg: ${body.organization}` : ''}\n\nCheck admin panel for details.`;
    
    // Send via Twilio REST API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', notifyPhone);
    formData.append('From', twilioPhone);
    formData.append('Body', message);
    
    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text();
      console.error("[SMS] Twilio error:", errorText);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to send SMS" 
      }, { status: 500 });
    }
    
    const result = await twilioResponse.json();
    console.log("[SMS] Sent successfully:", result.sid);
    
    return NextResponse.json({ 
      success: true, 
      message: "SMS notification sent",
      configured: true,
      sid: result.sid 
    });
    
  } catch (err) {
    console.error("[SMS] Error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// GET endpoint to check SMS configuration status
export async function GET() {
  const configured = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER &&
    process.env.NOTIFY_PHONE_NUMBER
  );
  
  // Mask the phone number for security
  const notifyPhone = process.env.NOTIFY_PHONE_NUMBER;
  const maskedPhone = notifyPhone 
    ? `***-***-${notifyPhone.slice(-4)}` 
    : null;
  
  return NextResponse.json({
    configured,
    notifyPhone: maskedPhone,
  });
}
