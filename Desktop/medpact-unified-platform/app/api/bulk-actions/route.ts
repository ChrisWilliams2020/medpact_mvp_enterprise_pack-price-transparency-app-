import { NextRequest, NextResponse } from 'next/server';

let employees: any[] = [];
let contracts: any[] = [];
let reports: any[] = [];

export async function POST(request: NextRequest) {
  const { type, data } = await request.json();
  if (type === 'employee') employees.push(...data);
  if (type === 'contract') contracts.push(...data);
  if (type === 'report') reports.push(...data);
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ employees, contracts, reports });
}
