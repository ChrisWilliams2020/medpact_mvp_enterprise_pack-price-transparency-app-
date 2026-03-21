import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const employees = await prisma.employee.findMany({});
    return NextResponse.json({ employees });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) });
  }
}
