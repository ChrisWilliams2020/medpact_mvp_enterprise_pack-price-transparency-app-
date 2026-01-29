import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const radius = searchParams.get('radius') || '5000';

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    // Mock patient demographic data
    const demographicData = {
      location,
      radius: parseInt(radius),
      totalPopulation: 125000,
      ageGroups: [
        { range: '0-17', count: 25000, percentage: 20 },
        { range: '18-34', count: 35000, percentage: 28 },
        { range: '35-54', count: 37500, percentage: 30 },
        { range: '55+', count: 27500, percentage: 22 },
      ],
      insuranceCoverage: [
        { type: 'Commercial', count: 62500, percentage: 50 },
        { type: 'Medicare', count: 31250, percentage: 25 },
        { type: 'Medicaid', count: 18750, percentage: 15 },
        { type: 'Uninsured', count: 12500, percentage: 10 },
      ],
      estimatedEyeCareNeeds: {
        total: 87500,
        routine: 50000,
        medicalEyeExams: 25000,
        surgicalCandidates: 12500,
      },
    };

    return NextResponse.json(demographicData);
  } catch (error) {
    console.error('Patient demographics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient demographics' },
      { status: 500 }
    );
  }
}
