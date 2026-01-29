import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Mock capabilities data
    const capabilities = {
      practices: ['vision_care', 'surgical', 'diagnostic'],
      services: ['cataract_surgery', 'lasik', 'glaucoma_treatment'],
      equipment: ['oct_scanner', 'fundus_camera', 'visual_field_analyzer']
    };

    return NextResponse.json(capabilities);
  } catch (error: any) {
    console.error('Capabilities API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
