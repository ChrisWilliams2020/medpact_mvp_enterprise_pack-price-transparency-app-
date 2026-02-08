import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const responses = await prisma.surveyResponse.findMany({
      include: {
        survey: true,
        employee: true,
      },
    });
    const results = responses.map(r => ({
      surveyTitle: r.survey?.title || "N/A",
      employeeEmail: r.employee?.email || "N/A",
      answers: r.answers,
      submitted: !!r.answers && Object.keys(r.answers).length > 0,
    }));
    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) });
  }
}
