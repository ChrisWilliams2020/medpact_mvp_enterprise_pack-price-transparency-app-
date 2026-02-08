import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const soon = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const expiring = await prisma.contractDocument.findMany({
    where: {
      expiresAt: { lte: soon },
      status: "Active",
    },
  });
  await Promise.all(expiring.map(doc =>
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Contract Expiration Reminder: ${doc.name}`,
      text: `Contract ${doc.name} expires on ${doc.expiresAt}`,
    })
  ));
  return NextResponse.json({ success: true, count: expiring.length });
}
