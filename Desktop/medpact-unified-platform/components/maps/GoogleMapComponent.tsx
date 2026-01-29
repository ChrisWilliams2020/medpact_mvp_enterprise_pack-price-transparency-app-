'use client';

import { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const placeTypes = [
  { value: 'all', label: 'All Medical Facilities' },
  { value: 'hospital', label: 'Hospitals' },
  { value: 'doctor', label: 'Medical Practices' },
  { value: 'eye_care', label: 'Ophthalmology & Optometry' },
  { value: 'dentist', label: 'Dental Practices' },
  { value: 'pharmacy', label: 'Pharmacies' },
  { value: 'health', label: 'Health Services' },
];

export default function GoogleMapComponent() {
  const [selectedPlaceType, setSelectedPlaceType] = useState('all');
  const [places, setPlaces] = useState<any[]>([]);
  const [centerLocation, setCenterLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [radius, setRadius] = useState(25);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const practiceIcon = isLoaded ? {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#3B82F6',
    fillOpacity: 1,
    strokeColor: '#1E40AF',
    strokeWeight: 2,
    scale: 1.5,
    anchor: new google.maps.Point(12, 22),
  } : undefined;

  const hospitalIcon = isLoaded ? {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#10B981',
    fillOpacity: 1,
    strokeColor: '#059669',
    strokeWeight: 2,
    scale: 1.5,
    anchor: new google.maps.Point(12, 22),
  } : undefined;

  const eyeCareIcon = isLoaded ? {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#8B5CF6',
    fillOpacity: 1,
    strokeColor: '#6D28D9',
    strokeWeight: 2,
    scale: 1.5,
    anchor: new google.maps.Point(12, 22),
  } : undefined;

  const fetchAllPlaces = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    const radiusInMeters = radius * 1609.34;
    const typesToFetch = ['hospital', 'doctor', 'eye_care', 'dentist', 'pharmacy'];
    
    try {
      const fetchPromises = typesToFetch.map(type =>
        fetch(`/api/places/nearby?lat=${centerLocation.lat}&lng=${centerLocation.lng}&radius=${radiusInMeters}&type=${type}`)
          .then(res => res.json())
          .then(data => Array.isArray(data) ? data.map((place: any) => ({ ...place, placeType: type })) : [])
      );

      const results = await Promise.all(fetchPromises);
      const allPlaces = results.flat();
      setPlaces(allPlaces);
    } catch (err) {
      console.error('Error fetching all places:', err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePlaceType = async (type: string) => {
    if (!isLoaded) return;
    
    setLoading(true);
    const radiusInMeters = radius * 1609.34;

    try {
      const response = await fetch(`/api/places/nearby?lat=${centerLocation.lat}&lng=${centerLocation.lng}&radius=${radiusInMeters}&type=${type}`);
      const data = await response.json();
      setPlaces(Array.isArray(data) ? data.map((place: any) => ({ ...place, placeType: type })) : []);
    } catch (err) {
      console.error('Error fetching places:', err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (selectedPlaceType === 'all') {
      fetchAllPlaces();
    } else {
      fetchSinglePlaceType(selectedPlaceType);
    }
  }, [centerLocation, radius, selectedPlaceType, isLoaded]);

  const handleMarkerClick = async (place: any) => {
    setSelectedPlace(place);
    
    try {
      const response = await fetch(`/api/places/details?placeId=${place.placeId}`);
      const details = await response.json();
      setPlaceDetails(details);
    } catch (err) {
      console.error('Error fetching place details:', err);
    }
  };

  const getMarkerIcon = (place: any) => {
    if (place.placeType === 'hospital') return hospitalIcon;
    if (place.placeType === 'eye_care') return eyeCareIcon;
    return practiceIcon;
  };

  const getMarkerColor = (type: string) => {
    if (type === 'hospital') return 'bg-green-500';
    if (type === 'eye_care') return 'bg-purple-500';
    return 'bg-blue-500';
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Search Radius:</label>
          <select
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          >
            <option value={1}>1 mile</option>
            <option value={5}>5 miles</option>
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold">Show:</label>
          <select
            value={selectedPlaceType}
            onChange={(e) => setSelectedPlaceType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {placeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {loading ? <span>Loading...</span> : <span>Showing {places.length} location(s)</span>}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4">Interactive Map Visualization</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="bg-white border rounded p-4 flex-1 shadow-sm">
          <div className="font-semibold mb-2 flex items-center gap-2">
            {selectedPlaceType === 'all' ? (
              <>
                <span className="inline-block w-4 h-4 bg-gradient-to-r from-green-500 via-purple-500 to-blue-500 rounded-full"></span>
                All Medical Facilities
              </>
            ) : (
              <>
                <span className={`inline-block w-4 h-4 rounded-full ${getMarkerColor(selectedPlaceType)}`}></span>
                {placeTypes.find(t => t.value === selectedPlaceType)?.label}
              </>
            )}
          </div>
          <ul className="mt-2 text-sm max-h-60 overflow-y-auto">
            {places.map((place) => (
              <li 
                key={place.id} 
                className="flex flex-col gap-1 py-2 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => handleMarkerClick(place)}
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full flex-shrink-0 ${getMarkerColor(place.placeType)}`}></span>
                  <span className="font-semibold truncate">{place.name}</span>
                </div>
                <span className="text-xs text-gray-600 pl-5">{place.address}</span>
                {place.rating && (
                  <span className="text-xs text-yellow-600 pl-5">
                    ⭐ {place.rating} ({place.userRatingsTotal} reviews)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border border-gray-300 rounded overflow-hidden shadow-lg">
        <LoadScript 
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          onLoad={() => setIsLoaded(true)}
        >
          <GoogleMap
            zoom={11}
            center={centerLocation}
            mapContainerStyle={mapContainerStyle}
            onClick={(e) => {
              if (e.latLng) {
                setCenterLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              }
            }}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {isLoaded && (
              <>
                <Circle
                  center={centerLocation}
                  radius={radius * 1609.34}
                  options={{
                    strokeColor: '#3B82F6',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#3B82F6',
                    fillOpacity: 0.1,
                  }}
                />

                <Marker
                  position={centerLocation}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#EF4444',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 2,
                  }}
                  title="My Practice - Click map to move"
                />

                {places.map((place) => (
                  <Marker
                    key={place.id}
                    position={{ lat: place.lat, lng: place.lng }}
                    icon={getMarkerIcon(place)}
                    title={place.name}
                    animation={google.maps.Animation.DROP}
                    onClick={() => handleMarkerClick(place)}
                  />
                ))}

                {selectedPlace && (
                  <InfoWindow
                    position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                    onCloseClick={() => {
                      setSelectedPlace(null);
                      setPlaceDetails(null);
                    }}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-bold text-lg mb-2">{selectedPlace.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{selectedPlace.address}</p>
                      {selectedPlace.rating && (
                        <p className="text-sm text-yellow-600 mb-2">
                          ⭐ {selectedPlace.rating} ({selectedPlace.userRatingsTotal} reviews)
                        </p>
                      )}
                      {selectedPlace.isOpen !== undefined && (
                        <p className={`text-sm font-semibold mb-2 ${selectedPlace.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedPlace.isOpen ? '🟢 Open now' : '🔴 Closed'}
                        </p>
                      )}
                      {placeDetails && (
                        <>
                          {placeDetails.formatted_phone_number && (
                            <p className="text-sm mb-1">
                              📞 <a href={`tel:${placeDetails.formatted_phone_number}`} className="text-blue-600 hover:underline">
                                {placeDetails.formatted_phone_number}
                              </a>
                            </p>
                          )}
                          {placeDetails.website && (
                            <p className="text-sm mb-1">
                              🌐 <a href={placeDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Visit Website
                              </a>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="mt-4 text-xs text-gray-500 flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
          Your Practice
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          Hospitals
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
          Eye Care
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
          Other Medical
        </span>
      </div>
    </div>
  );
}