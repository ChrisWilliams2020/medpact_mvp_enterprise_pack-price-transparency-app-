import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/notify/email
 * Sends email notification when a lead comes in.
 * Supports both SendGrid and Resend as providers.
 * 
 * Environment variables:
 *   SENDGRID_API_KEY      - SendGrid API key (if using SendGrid)
 *   RESEND_API_KEY        - Resend API key (if using Resend)
 *   NOTIFY_EMAIL          - Email to send notifications to
 *   FROM_EMAIL            - Sender email address
 */

interface NotificationPayload {
  name: string;
  email: string;
  organization?: string;
  message?: string;
  type: string;
}

async function sendWithSendGrid(payload: NotificationPayload, toEmail: string, fromEmail: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return { success: false, provider: 'sendgrid', error: 'Not configured' };

  const emailBody = {
    personalizations: [{ to: [{ email: toEmail }] }],
    from: { email: fromEmail, name: 'MedPACT Website' },
    subject: `🚨 New Lead: ${payload.type}`,
    content: [{
      type: 'text/html',
      value: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚨 New MedPACT Lead</h1>
          </div>
          <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #6c757d; margin: 0 0 20px 0; font-size: 14px;">${payload.type}</p>
            
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e9ecef;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; width: 100px;">Name:</td>
                  <td style="padding: 8px 0; color: #212529; font-weight: 600;">${payload.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6c757d;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${payload.email}" style="color: #0066cc;">${payload.email}</a></td>
                </tr>
                ${payload.organization ? `
                <tr>
                  <td style="padding: 8px 0; color: #6c757d;">Organization:</td>
                  <td style="padding: 8px 0; color: #212529;">${payload.organization}</td>
                </tr>
                ` : ''}
                ${payload.message ? `
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; vertical-align: top;">Message:</td>
                  <td style="padding: 8px 0; color: #212529;">${payload.message}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="https://medpact-site-vscode-packet-v3.vercel.app/admin" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View in Admin Panel</a>
            </div>
            
            <p style="color: #adb5bd; font-size: 12px; margin-top: 20px; text-align: center;">
              Sent from MedPACT Website • ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    }]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailBody),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, provider: 'sendgrid', error };
  }

  return { success: true, provider: 'sendgrid' };
}

async function sendWithResend(payload: NotificationPayload, toEmail: string, fromEmail: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, provider: 'resend', error: 'Not configured' };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `MedPACT Website <${fromEmail}>`,
      to: [toEmail],
      subject: `🚨 New Lead: ${payload.type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚨 New MedPACT Lead</h1>
          </div>
          <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #6c757d; margin: 0 0 20px 0; font-size: 14px;">${payload.type}</p>
            
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e9ecef;">
              <p><strong>Name:</strong> ${payload.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
              ${payload.organization ? `<p><strong>Organization:</strong> ${payload.organization}</p>` : ''}
              ${payload.message ? `<p><strong>Message:</strong> ${payload.message}</p>` : ''}
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="https://medpact-site-vscode-packet-v3.vercel.app/admin" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View in Admin Panel</a>
            </div>
          </div>
        </div>
      `
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, provider: 'resend', error };
  }

  const result = await response.json();
  return { success: true, provider: 'resend', id: result.id };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as NotificationPayload;
    
    const toEmail = process.env.NOTIFY_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@medpact.com';
    
    if (!toEmail) {
      console.log("[Email] NOTIFY_EMAIL not configured. Would have sent notification:", body);
      return NextResponse.json({ 
        success: true, 
        message: "Email not sent (NOTIFY_EMAIL not configured)",
        configured: false 
      });
    }
    
    // Try SendGrid first, then Resend as fallback
    let result = await sendWithSendGrid(body, toEmail, fromEmail);
    
    if (!result.success && process.env.RESEND_API_KEY) {
      console.log("[Email] SendGrid failed, trying Resend...");
      result = await sendWithResend(body, toEmail, fromEmail);
    }
    
    if (result.success) {
      console.log(`[Email] Sent via ${result.provider}`);
      return NextResponse.json({ 
        success: true, 
        message: `Email sent via ${result.provider}`,
        configured: true 
      });
    } else {
      console.error("[Email] All providers failed:", result.error);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to send email" 
      }, { status: 500 });
    }
    
  } catch (err) {
    console.error("[Email] Error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// GET endpoint to check email configuration status
export async function GET() {
  const hasSendGrid = !!process.env.SENDGRID_API_KEY;
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasNotifyEmail = !!process.env.NOTIFY_EMAIL;
  
  // Mask the email for security
  const notifyEmail = process.env.NOTIFY_EMAIL;
  const maskedEmail = notifyEmail 
    ? `${notifyEmail.slice(0, 3)}***@${notifyEmail.split('@')[1] || '***'}` 
    : null;
  
  return NextResponse.json({
    configured: (hasSendGrid || hasResend) && hasNotifyEmail,
    providers: {
      sendgrid: hasSendGrid,
      resend: hasResend,
    },
    notifyEmail: maskedEmail,
  });
}
