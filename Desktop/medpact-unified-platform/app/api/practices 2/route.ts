import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const radius = searchParams.get('radius') || '5000';
    const specialty = searchParams.get('specialty');

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    // Build the search query
    let query = specialty || 'eye care';
    
    // Fetch practices from Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location}&radius=${radius}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json(
        { error: 'Failed to fetch practices' },
        { status: 500 }
      );
    }

    const practices = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      rating: place.rating || 0,
      totalRatings: place.user_ratings_total || 0,
      types: place.types || [],
      businessStatus: place.business_status,
    }));

    return NextResponse.json(practices);
  } catch (error) {
    console.error('Practices API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch practices' },
      { status: 500 }
    );
  }
}
