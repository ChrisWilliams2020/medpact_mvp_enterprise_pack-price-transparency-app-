// lib/geocoding.ts
interface GeocodingResult {
  lat: number;
  lng: number;
  formatted_address: string;
}

export async function geocodePracticeAddress(
  address: string,
  city: string,
  state: string,
  zip: string
): Promise<GeocodingResult | null> {
  const fullAddress = `${address}, ${city}, ${state} ${zip}`;
  
  try {
    // Using Google Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formatted_address: data.results[0].formatted_address,
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  
  return null;
}

export async function geocodeMultiplePractices(practices: any[]): Promise<any[]> {
  const geocodedPractices = [];
  
  for (const practice of practices) {
    const coords = await geocodePracticeAddress(
      practice.address,
      practice.city,
      practice.state,
      practice.zip
    );
    
    geocodedPractices.push({
      ...practice,
      lat: coords?.lat || 0,
      lng: coords?.lng || 0,
      formatted_address: coords?.formatted_address || `${practice.address}, ${practice.city}, ${practice.state}`,
    });
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return geocodedPractices;
}