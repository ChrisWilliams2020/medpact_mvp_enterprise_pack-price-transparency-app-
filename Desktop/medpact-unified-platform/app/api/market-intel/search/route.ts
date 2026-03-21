import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, radius, placeType } = body;

    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    // Geocode the location first
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData = await geocodeRes.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Search for places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius || 8046.72}&type=doctor&keyword=eye+care+optometry+ophthalmology&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    
    const placesRes = await fetch(searchUrl);
    const placesData = await placesRes.json();

    return NextResponse.json({
      results: placesData.results || [],
      center: { lat, lng },
    });

  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'Search failed',
      details: error.message 
    }, { status: 500 });
  }
}
