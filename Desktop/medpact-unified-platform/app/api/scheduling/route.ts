import { NextRequest, NextResponse } from 'next/server';

let appointments = [
  { id: '1', patient: 'John Doe', date: '2026-02-10T09:00', status: 'Confirmed' },
  { id: '2', patient: 'Jane Smith', date: '2026-02-12T14:30', status: 'Pending' },
];

export async function GET() {
  return NextResponse.json(appointments);
}

export async function POST(request: NextRequest) {
  const { patient, date, status } = await request.json();
  const id = Date.now().toString();
  const appt = { id, patient, date, status };
  appointments.push(appt);
  return NextResponse.json(appt);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  appointments = appointments.filter(a => a.id !== id);
  return NextResponse.json({ success: true });
}
