import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json();

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }

    // Fetch place details from Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: 'Failed to fetch reputation data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      name: data.result.name,
      rating: data.result.rating || 0,
      totalReviews: data.result.user_ratings_total || 0,
      reviews: data.result.reviews || [],
    });
  } catch (error) {
    console.error('Reputation API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reputation data' },
      { status: 500 }
    );
  }
}
