import { NextRequest, NextResponse } from 'next/server';

let documents: any[] = [];
let labResults: any[] = [];
let messages: any[] = [];

export async function GET() {
  return NextResponse.json({ documents, labResults, messages });
}

export async function POST(request: NextRequest) {
  const { type, data } = await request.json();
  if (type === 'document') documents.push(data);
  if (type === 'labResult') labResults.push(data);
  if (type === 'message') messages.push(data);
  return NextResponse.json({ success: true });
}
