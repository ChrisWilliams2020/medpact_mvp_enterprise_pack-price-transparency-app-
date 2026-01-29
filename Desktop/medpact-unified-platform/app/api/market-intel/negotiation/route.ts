import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const practiceId = searchParams.get('practiceId');

    // Mock negotiation playbook data
    const playbook = {
      practiceId: practiceId || 'mock-practice-1',
      recommendations: [
        { payer: 'Blue Cross', strategy: 'Leverage market share', confidence: 0.85 },
        { payer: 'UnitedHealthcare', strategy: 'Bundle services', confidence: 0.75 }
      ],
      marketPosition: 'strong',
      leveragePoints: ['High patient volume', 'Excellent outcomes', 'Geographic coverage']
    };

    return NextResponse.json(playbook);
  } catch (error: any) {
    console.error('Negotiation API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

