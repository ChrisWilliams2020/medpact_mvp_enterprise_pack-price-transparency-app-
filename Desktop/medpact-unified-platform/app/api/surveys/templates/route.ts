import { NextRequest, NextResponse } from 'next/server';

let templates = [
  { id: '1', name: 'Patient Satisfaction', department: 'General' },
  { id: '2', name: 'Post-Discharge', department: 'Care Management' },
  { id: '3', name: 'Staff Feedback', department: 'HR' },
];

export async function GET() {
  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  const { name, department } = await request.json();
  const id = Date.now().toString();
  const template = { id, name, department };
  templates.push(template);
  return NextResponse.json(template);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  templates = templates.filter(t => t.id !== id);
  return NextResponse.json({ success: true });
}
