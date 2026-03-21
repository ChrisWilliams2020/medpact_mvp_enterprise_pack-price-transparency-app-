import { NextRequest, NextResponse } from 'next/server';
// In-memory notifications for demo
let notifications: { id: string; message: string; userId?: string }[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json(notifications);
}
}

export async function POST(request: NextRequest) {
  const { message, userId } = await request.json();
  const id = Date.now().toString();
  const notification = { id, message, userId };
  notifications.unshift(notification);
  return NextResponse.json(notification);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  notifications = notifications.filter(n => n.id !== id);
  return NextResponse.json({ success: true });
}
}
