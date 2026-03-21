import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const name = formData.get("name");
  const uploadedBy = formData.get("uploadedBy");
  const expiresAt = formData.get("expiresAt");

  // Validate file type
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ success: false, error: "No file uploaded." });
  }
  const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ success: false, error: "Invalid file type." });
  }

  // Simulate upload (replace with actual storage logic)
  const url = `/uploads/${uuidv4()}-${name}`;

  const doc = await prisma.contractDocument.create({
    data: {
      name: name as string,
      url,
      status: "Active",
      uploadedBy: uploadedBy as string,
      expiresAt: expiresAt ? new Date(expiresAt as string) : undefined,
      activity: JSON.stringify([{ action: "upload", at: new Date(), by: uploadedBy }]),
    },
  });

  return NextResponse.json({ success: true, document: doc });
}
