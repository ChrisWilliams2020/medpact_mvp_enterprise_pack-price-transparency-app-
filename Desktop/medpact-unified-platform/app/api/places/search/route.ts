import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, radius } = body;

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // First, geocode the location to get lat/lng
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${apiKey}`;

    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Search for eye care practices
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${
      (radius || 5) * 1609.34
    }&type=doctor&keyword=ophthalmology|optometry|eye+care&key=${apiKey}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK') {
      console.error('Places API error:', searchData);
      return NextResponse.json(
        { error: 'Failed to search places', details: searchData },
        { status: 500 }
      );
    }

    return NextResponse.json({
      results: searchData.results || [],
      location: { lat, lng },
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
