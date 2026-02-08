import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "json2csv";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const responses = await prisma.surveyResponse.findMany({
      include: { survey: true, employee: true },
    });
    const data = responses.map(r => ({
      surveyTitle: r.survey?.title || "N/A",
      employeeEmail: r.employee?.email || "N/A",
      answers: JSON.stringify(r.answers),
      submitted: !!r.answers && Object.keys(r.answers).length > 0,
    }));
    const csv = parse(data);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=survey-results.csv",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) });
  }
}
