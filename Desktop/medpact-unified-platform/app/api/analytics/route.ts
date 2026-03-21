import { NextRequest, NextResponse } from 'next/server';

const analytics = {
  revenue: 1234567,
  patientVolume: 2847,
  avgVisitValue: 433,
  satisfaction: 94.5,
  trends: [12.5, 8.2, 3.1, 2.3],
};

export async function GET() {
  return NextResponse.json(analytics);
}
