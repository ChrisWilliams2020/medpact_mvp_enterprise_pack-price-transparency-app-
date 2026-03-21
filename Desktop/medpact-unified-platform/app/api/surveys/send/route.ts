import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import twilio from "twilio";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export async function POST(req: NextRequest) {
  const { title, description, questions, employeeEmails, employeePhones } = await req.json();
  try {
    // Create survey
    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        questions,
        userId: "demo-user-id", // Replace with actual userId
      },
    });
    // Find employees by email
    const employees = await prisma.employee.findMany({
      where: { email: { in: employeeEmails } },
    });
    // Create empty responses for each employee
    await Promise.all(
      employees.map((emp) =>
        prisma.surveyResponse.create({
          data: {
            surveyId: survey.id,
            employeeId: emp.id,
            answers: {},
          },
        })
      )
    );
    // Send email invitations
    await Promise.all(
      (employeeEmails || []).map((email: string) =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Survey Invitation: ${title}`,
          text: `You have been invited to participate in a survey.\n${description}`,
        })
      )
    );
    // Send SMS invitations
    await Promise.all(
      (employeePhones || []).map((phone: string) =>
        twilioClient.messages.create({
          body: `Survey Invitation: ${title} - ${description}`,
          from: process.env.TWILIO_PHONE,
          to: phone,
        })
      )
    );
    return NextResponse.json({ success: true, surveyId: survey.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) });
  }
}
