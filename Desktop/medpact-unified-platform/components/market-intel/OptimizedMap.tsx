'use client';

import { useEffect, useRef, useState } from 'react';

interface OptimizedMapProps {
  results: any[];
  center: { lat: number; lng: number };
}

export function OptimizedMap({ results, center }: OptimizedMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    );

    if (existingScript) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkLoaded);
          setIsLoaded(true);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkLoaded);
        if (!window.google?.maps) {
          setLoadError(true);
        }
      }, 10000); // 10 second timeout

      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Double check that google.maps is available
      if (window.google?.maps) {
        setIsLoaded(true);
      } else {
        setLoadError(true);
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps');
      setLoadError(true);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts while loading
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;

    try {
      // Initialize map only once
      if (!googleMapRef.current) {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
      } else {
        googleMapRef.current.setCenter(center);
      }

      // Clear old markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      if (results.length === 0) return;

      // Add new markers
      const bounds = new window.google.maps.LatLngBounds();
      
      results.forEach((place) => {
        if (!place.geometry?.location) return;

        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: googleMapRef.current,
          title: place.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; color: #1F2937;">${place.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #6B7280;">${place.vicinity || place.formatted_address || ''}</p>
              ${place.rating ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #F59E0B;">⭐ ${place.rating}</p>` : ''}
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
        });

        bounds.extend(place.geometry.location);
        markersRef.current.push(marker);
      });

      if (results.length > 0 && googleMapRef.current) {
        googleMapRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError(true);
    }
  }, [isLoaded, results, center]);

  if (loadError) {
    return (
      <div className="h-[600px] bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl flex items-center justify-center border-2 border-red-200">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            Map Loading Error
          </p>
          <p className="text-gray-600">
            Please refresh the page to try again
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading map...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="h-[600px] w-full rounded-2xl shadow-lg border-2 border-gray-200"
    />
  );
}
