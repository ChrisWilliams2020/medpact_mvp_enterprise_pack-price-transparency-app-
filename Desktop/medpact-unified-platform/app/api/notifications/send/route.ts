export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContractRenewalEmail, PerformanceAlertEmail } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { type, to, data } = await request.json();

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Resend API key not configured.',
          preview: data 
        },
        { status: 200 }
      );
    }

    let subject = '';
    let react;

    switch (type) {
      case 'contract-renewal':
        subject = `⚠️ Contract Renewal Alert: ${data.payorName} (${data.daysRemaining} days remaining)`;
        react = ContractRenewalEmail(data);
        break;

      case 'performance-alert':
        subject = `${data.trend === 'declining' ? '📉' : '📈'} Performance Alert: ${data.metricName}`;
        react = PerformanceAlertEmail(data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'MedPact Alerts <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      react: react,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: emailData?.id,
    });

  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
