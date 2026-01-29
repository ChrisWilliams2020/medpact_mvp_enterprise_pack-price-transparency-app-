import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '16093';
  const query = searchParams.get('query') || 'eye doctor';

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng parameters' }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    console.error('❌ Google Maps API key not configured');
    return NextResponse.json({ error: 'Google Maps API key not configured' }, { status: 500 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;
    
    console.log(`🔍 Text searching for "${query}" near (${lat}, ${lng})`);
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('❌ Google Places API error:', data.status, data.error_message);
      
      return NextResponse.json({
        results: [],
        status: data.status,
        error: data.error_message,
      });
    }

    console.log(`✅ Found ${data.results?.length || 0} results for "${query}"`);

    return NextResponse.json({
      results: data.results || [],
      status: data.status,
      nextPageToken: data.next_page_token,
    });
  } catch (error: any) {
    console.error('❌ Places API error:', error);
    return NextResponse.json(
      { error: error.message, results: [] },
      { status: 500 }
    );
  }
}