'use client';

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px'
};

const center = {
  lat: 39.8283,
  lng: -98.5795
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["visualization"];

const mockPractices = [
  { 
    id: 1, 
    name: "Central Medical Center", 
    lat: 40.7128, 
    lng: -74.0060, 
    revenue: "$450K", 
    patients: 1200,
    contracts: 5,
    avgReimbursement: "$245",
    payorMix: { medicare: 45, medicaid: 30, commercial: 25 }
  },
  { 
    id: 2, 
    name: "Westside Clinic", 
    lat: 34.0522, 
    lng: -118.2437, 
    revenue: "$320K", 
    patients: 850,
    contracts: 3,
    avgReimbursement: "$210",
    payorMix: { medicare: 40, medicaid: 35, commercial: 25 }
  },
  { 
    id: 3, 
    name: "East Valley Health", 
    lat: 41.8781, 
    lng: -87.6298, 
    revenue: "$580K", 
    patients: 1500,
    contracts: 7,
    avgReimbursement: "$280",
    payorMix: { medicare: 50, medicaid: 25, commercial: 25 }
  },
  { 
    id: 4, 
    name: "North Care Practice", 
    lat: 29.7604, 
    lng: -95.3698, 
    revenue: "$290K", 
    patients: 720,
    contracts: 4,
    avgReimbursement: "$195",
    payorMix: { medicare: 38, medicaid: 42, commercial: 20 }
  },
  { 
    id: 5, 
    name: "South Metro Health", 
    lat: 33.4484, 
    lng: -112.0740, 
    revenue: "$410K", 
    patients: 980,
    contracts: 6,
    avgReimbursement: "$225",
    payorMix: { medicare: 42, medicaid: 33, commercial: 25 }
  },
];

export default function PracticeMap() {
  const [selected, setSelected] = useState<typeof mockPractices[0] | null>(null);

  return (
    <LoadScript 
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={4}
      >
        {mockPractices.map((practice) => (
          <Marker
            key={practice.id}
            position={{ lat: practice.lat, lng: practice.lng }}
            onClick={() => setSelected(practice)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-3 min-w-[280px]">
              <h3 className="font-bold text-lg mb-3 text-gray-900">{selected.name}</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Annual Revenue:</span>
                  <span className="font-semibold text-green-600">{selected.revenue}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Patients:</span>
                  <span className="font-semibold">{selected.patients.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Active Contracts:</span>
                  <span className="font-semibold text-blue-600">{selected.contracts}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Avg Reimbursement:</span>
                  <span className="font-semibold">{selected.avgReimbursement}</span>
                </div>
                
                <div className="mt-3 pt-2 border-t">
                  <p className="text-gray-600 text-xs mb-2">Payor Mix:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs">Medicare: {selected.payorMix.medicare}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Medicaid: {selected.payorMix.medicaid}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs">Commercial: {selected.payorMix.commercial}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
  }