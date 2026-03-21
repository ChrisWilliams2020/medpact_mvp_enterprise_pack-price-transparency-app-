// Enhanced Google Places API Integration
export interface PlaceDetails {
  placeId: string;
  name: string;
  rating: number;
  totalRatings: number;
  reviews: any[];
  phone?: string;
  website?: string;
  openingHours?: any;
  priceLevel?: number;
  photos?: string[];
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    const fields = [
      'name',
      'rating',
      'user_ratings_total',
      'reviews',
      'formatted_phone_number',
      'website',
      'opening_hours',
      'price_level',
      'photos'
    ].join(',');

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) throw new Error('Google Places API error');
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Places API error:', data.status);
      return null;
    }

    const result = data.result;
    
    return {
      placeId,
      name: result.name,
      rating: result.rating || 0,
      totalRatings: result.user_ratings_total || 0,
      reviews: result.reviews || [],
      phone: result.formatted_phone_number,
      website: result.website,
      openingHours: result.opening_hours,
      priceLevel: result.price_level,
      photos: result.photos?.map((p: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
      ) || [],
    };
  } catch (error) {
    console.error('Place details error:', error);
    return null;
  }
}

export async function searchNearbyPlaces(params: {
  location: string;
  radius?: number;
  type?: string;
  keyword?: string;
}) {
  try {
    const radius = params.radius || 5000;
    const type = params.type || 'doctor';
    
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${params.location}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    
    if (params.keyword) {
      url += `&keyword=${encodeURIComponent(params.keyword)}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) throw new Error('Google Places API error');
    
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places search error:', data.status);
      return [];
    }

    return data.results || [];
  } catch (error) {
    console.error('Nearby places error:', error);
    return [];
  }
}
