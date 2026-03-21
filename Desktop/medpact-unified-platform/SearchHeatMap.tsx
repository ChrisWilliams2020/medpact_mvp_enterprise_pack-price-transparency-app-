'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface SearchHeatMapProps {
  locations: { lat: number; lng: number; searchCount: number }[];
}

export function SearchHeatMap({ locations }: SearchHeatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !locations.length) return;

    // Center on average of all locations
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    const newMap = new google.maps.Map(mapRef.current, {
      center: { lat: avgLat, lng: avgLng },
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
    });

    // Add markers sized by search count
    locations.forEach((location) => {
      const size = Math.min(50, 10 + location.searchCount * 5);
      
      const circle = new google.maps.Circle({
        map: newMap,
        center: { lat: location.lat, lng: location.lng },
        radius: size * 100,
        fillColor: '#3B82F6',
        fillOpacity: 0.3,
        strokeColor: '#1D4ED8',
        strokeWeight: 2,
      });

      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: newMap,
        title: `${location.searchCount} searches`,
        label: {
          text: `${location.searchCount}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      });
    });

    setMap(newMap);
    setMapLoaded(true);
  };

  useEffect(() => {
    if (mapLoaded && locations.length > 0) {
      initializeMap();
    }
  }, [locations, mapLoaded]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🗺️ Search Heat Map
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Top locations where market searches were performed
      </p>

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={initializeMap}
      />

      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-gray-200"
      />
    </div>
  );
}