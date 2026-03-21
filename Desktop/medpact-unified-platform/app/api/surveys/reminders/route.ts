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
  const { surveyId } = await req.json();
  const responses = await prisma.surveyResponse.findMany({
    where: { surveyId },
    include: { employee: true },
  });
  const reminders = responses.filter(r => !r.answers || Object.keys(r.answers).length === 0);
  await Promise.all(reminders.map(r => {
    const emailPromise = r.employee.email ? transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: r.employee.email,
      subject: "Survey Reminder",
      text: "Please complete your survey!",
    }) : Promise.resolve();
    const smsPromise = r.employee.phone ? twilioClient.messages.create({
      body: "Survey Reminder: Please complete your survey!",
      from: process.env.TWILIO_PHONE,
      to: r.employee.phone,
    }) : Promise.resolve();
    return Promise.all([emailPromise, smsPromise]);
  }));
  return NextResponse.json({ success: true, count: reminders.length });
}
