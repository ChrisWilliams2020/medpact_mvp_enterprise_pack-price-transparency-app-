import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        responses: true,
        user: true,
      },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    if (survey.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { recipients } = body;

    // Send reminder emails
    const emailPromises = recipients.map((email: string) =>
      resend.emails.send({
        from: 'MedPact Surveys <surveys@medpact.com>',
        to: email,
        subject: `Reminder: ${survey.title}`,
        html: `
          <h2>Survey Reminder</h2>
          <p>You haven't completed this survey yet:</p>
          <h3>${survey.title}</h3>
          <p>${survey.description || ''}</p>
          <p><a href="${process.env.NEXTAUTH_URL}/surveys/take/${survey.distributionToken}">Take Survey Now</a></p>
        `,
      })
    );

    await Promise.all(emailPromises);

    // Update reminder count
    await prisma.survey.update({
      where: { id },
      data: {
        remindersSent: survey.remindersSent + 1,
        lastReminderAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      sent: recipients.length 
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
  }
}
