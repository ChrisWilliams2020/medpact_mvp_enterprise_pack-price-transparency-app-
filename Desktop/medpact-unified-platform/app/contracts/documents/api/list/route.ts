import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { search, status } = Object.fromEntries(new URL(req.url).searchParams.entries());
  const where: any = {};
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (status) where.status = status;
  const docs = await prisma.contractDocument.findMany({ where });
  return NextResponse.json({ documents: docs });
}
