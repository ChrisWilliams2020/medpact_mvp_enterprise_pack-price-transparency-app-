import { NextRequest, NextResponse } from 'next/server';

let messages = [
  { id: '1', from: 'Provider', to: 'Staff', content: 'Please follow up with patient John Doe.' },
];

export async function GET() {
  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const { from, to, content } = await request.json();
  const id = Date.now().toString();
  const msg = { id, from, to, content };
  messages.push(msg);
  return NextResponse.json(msg);
}
