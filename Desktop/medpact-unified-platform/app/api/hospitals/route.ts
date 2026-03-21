export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const radius = searchParams.get('radius') || '10000';

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=hospital&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json(
        { error: 'Failed to fetch hospitals' },
        { status: 500 }
      );
    }

    const hospitals = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      rating: place.rating || 0,
      totalRatings: place.user_ratings_total || 0,
      types: place.types || [],
    }));

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Hospitals API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospitals' },
      { status: 500 }
    );
  }
}
