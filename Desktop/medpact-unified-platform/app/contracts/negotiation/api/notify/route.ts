import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  const { email, step } = await req.json();
  const subject = `Contract Negotiation Update: ${step}`;
  const text = `You have reached the step: ${step} in your contract negotiation.`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
  });
  return NextResponse.json({ success: true });
}
