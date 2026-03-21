'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const PracticeSearchMap = dynamic(() => import('@/components/PracticeSearchMap'), { ssr: false });

const SPECIALTIES = [
  'Ophthalmology',
  'Optometry',
  'Cardiology',
  'Dermatology',
  'Family Medicine',
  'Internal Medicine',
  'Pediatrics',
  'Psychiatry',
  'Orthopedic Surgery',
  'General Surgery'
];

const CPT_CODES = {
  ophthalmology: [
    { code: '92004', description: 'Comprehensive Eye Exam - New Patient' },
    { code: '92014', description: 'Comprehensive Eye Exam - Established Patient' },
    { code: '92012', description: 'Intermediate Eye Exam - Established Patient' },
    { code: '66984', description: 'Cataract Surgery with IOL' },
    { code: '67028', description: 'Intravitreal Injection' },
    { code: '92250', description: 'Fundus Photography' },
    { code: '92134', description: 'OCT Scan' },
    { code: '65855', description: 'Laser Trabeculoplasty' }
  ],
  optometry: [
    { code: '92004', description: 'Comprehensive Eye Exam - New Patient' },
    { code: '92014', description: 'Comprehensive Eye Exam - Established Patient' },
    { code: '92015', description: 'Refraction' },
    { code: '92310', description: 'Contact Lens Fitting' },
    { code: '92340', description: 'Spectacle Fitting' }
  ],
  all: [
    { code: 'ALL', description: 'Average Across All CPT Codes' }
  ]
};

export default function PracticeSearchPage() {
  const [specialty, setSpecialty] = useState('Ophthalmology');
  const [selectedCPT, setSelectedCPT] = useState('ALL');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showRatings, setShowRatings] = useState<{[key: number]: boolean}>({});

  const handleSearch = async () => {
    setSearching(true);
    
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: 'Philadelphia Eye Institute',
          specialty: 'Ophthalmology',
          address: '123 Market St, Philadelphia, PA 19104',
          npi: '1234567890',
          medicarePatients: 1250,
          medicaidPatients: 450,
          commercialPatients: 800,
          avgReimbursement: {
            medicare: '$185',
            medicaid: '$142',
            commercial: '$245'
          },
          cptData: selectedCPT === 'ALL' ? '$191 avg' : '$185',
          priceTransparency: 'Available',
          location: { lat: 39.9526, lng: -75.1652 },
          website: 'https://philadelphiaeye.com',
          ratings: {
            average: 4.6,
            google: 4.7,
            healthgrades: 4.5,
            vitals: 4.6,
            zocdoc: 4.8,
            yelp: 4.4
          },
          doctors: 12,
          services: ['Cataract Surgery', 'LASIK', 'Glaucoma Treatment', 'Retina Care']
        },
        {
          id: 2,
          name: 'Bay Area Vision Center',
          specialty: 'Ophthalmology',
          address: '456 Mission St, San Francisco, CA 94105',
          npi: '9876543210',
          medicarePatients: 980,
          medicaidPatients: 320,
          commercialPatients: 1200,
          avgReimbursement: {
            medicare: '$195',
            medicaid: '$155',
            commercial: '$280'
          },
          cptData: selectedCPT === 'ALL' ? '$210 avg' : '$195',
          priceTransparency: 'Available',
          location: { lat: 37.7749, lng: -122.4194 },
          website: 'https://bayareavision.com',
          ratings: {
            average: 4.8,
            google: 4.9,
            healthgrades: 4.7,
            vitals: 4.8,
            zocdoc: 4.9,
            yelp: 4.6
          },
          doctors: 15,
          services: ['Cataract Surgery', 'Corneal Transplant', 'Macular Degeneration', 'Diabetic Eye Care']
        },
        {
          id: 3,
          name: 'Metro Optometry Associates',
          specialty: 'Optometry',
          address: '789 Chestnut St, Philadelphia, PA 19106',
          npi: '5555555555',
          medicarePatients: 650,
          medicaidPatients: 280,
          commercialPatients: 450,
          avgReimbursement: {
            medicare: '$125',
            medicaid: '$98',
            commercial: '$165'
          },
          cptData: selectedCPT === 'ALL' ? '$129 avg' : '$125',
          priceTransparency: 'Available',
          location: { lat: 39.9500, lng: -75.1480 },
          website: 'https://metrooptometry.com',
          ratings: {
            average: 4.5,
            google: 4.6,
            healthgrades: 4.4,
            vitals: 4.5,
            zocdoc: 4.6,
            yelp: 4.3
          },
          doctors: 6,
          services: ['Comprehensive Eye Exams', 'Contact Lens Fitting', 'Vision Therapy', 'Pediatric Eye Care']
        },
        {
          id: 4,
          name: 'Golden Gate Optometry',
          specialty: 'Optometry',
          address: '321 Powell St, San Francisco, CA 94102',
          npi: '4444444444',
          medicarePatients: 550,
          medicaidPatients: 210,
          commercialPatients: 620,
          avgReimbursement: {
            medicare: '$135',
            medicaid: '$105',
            commercial: '$180'
          },
          cptData: selectedCPT === 'ALL' ? '$140 avg' : '$135',
          priceTransparency: 'Available',
          location: { lat: 37.7875, lng: -122.4083 },
          website: 'https://goldengateoptometry.com',
          ratings: {
            average: 4.7,
            google: 4.8,
            healthgrades: 4.6,
            vitals: 4.7,
            zocdoc: 4.8,
            yelp: 4.5
          },
          doctors: 8,
          services: ['Eye Exams', 'Dry Eye Treatment', 'Emergency Eye Care', 'Sports Vision']
        }
      ];

      let filtered = mockResults.filter(r => 
        specialty === '' || r.specialty === specialty
      );

      setSearchResults(filtered);
      setSearching(false);
    }, 1500);
  };

  const cptOptions = specialty === 'Ophthalmology' 
    ? CPT_CODES.ophthalmology 
    : specialty === 'Optometry' 
    ? CPT_CODES.optometry 
    : CPT_CODES.all;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔍 Practice Search & Analytics
            </h1>
            <p className="text-gray-600">
              Search nationwide practices with Medicare/Medicaid data, ratings & price transparency
            </p>
          </div>
          <Link href="/dashboard/advanced">
            <Button variant="outline">← Dashboard</Button>
          </Link>
        </div>

        {/* Search Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Criteria</CardTitle>
            <CardDescription>Filter practices by specialty, location, and CPT codes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Specialty *</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={specialty}
                  onChange={(e) => {
                    setSpecialty(e.target.value);
                    setSelectedCPT('ALL');
                  }}
                >
                  <option value="">All Specialties</option>
                  {SPECIALTIES.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CPT Code</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={selectedCPT}
                  onChange={(e) => setSelectedCPT(e.target.value)}
                >
                  <option value="ALL">Average Across All</option>
                  {cptOptions.map(cpt => (
                    <option key={cpt.code} value={cpt.code}>
                      {cpt.code} - {cpt.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., PA, CA"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., Philadelphia"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSearch}
                disabled={searching}
                className="flex-1 md:flex-none"
              >
                {searching ? 'Searching Medicare/Medicaid Data...' : '🔍 Search Practices'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setSpecialty('');
                  setSelectedCPT('ALL');
                  setState('');
                  setCity('');
                  setSearchResults([]);
                }}
              >
                Clear Filters
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap pt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                📊 Medicare PECOS Database
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                📊 Medicaid Provider Database
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                💰 Mathematica Price Transparency (PHI/SF)
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                ⭐ Multi-Platform Ratings
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Search Results ({searchResults.length} practices found)</CardTitle>
                <CardDescription>
                  {specialty} practices {selectedCPT !== 'ALL' && `- CPT ${selectedCPT}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((practice) => (
                    <div key={practice.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{practice.name}</h3>
                          <p className="text-sm text-gray-600">{practice.address}</p>
                          <p className="text-xs text-gray-500 mt-1">NPI: {practice.npi}</p>
                          <p className="text-sm mt-1">
                            <span className="font-semibold">{practice.doctors}</span> Doctors • 
                            <span className="ml-2">{practice.services.length} Services</span>
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {practice.specialty}
                            </span>
                            {practice.priceTransparency === 'Available' && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                💰 Price Data
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">⭐</span>
                            <div>
                              <p className="font-bold text-lg">{practice.ratings.average}</p>
                              <button 
                                onClick={() => setShowRatings({...showRatings, [practice.id]: !showRatings[practice.id]})}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                {showRatings[practice.id] ? 'Hide' : 'Show'} All Ratings
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {showRatings[practice.id] && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Ratings from Top Doctor Sites:</p>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Google:</span>
                              <span>{practice.ratings.google}/5 ⭐</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Healthgrades:</span>
                              <span>{practice.ratings.healthgrades}/5 ⭐</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Vitals:</span>
                              <span>{practice.ratings.vitals}/5 ⭐</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Zocdoc:</span>
                              <span>{practice.ratings.zocdoc}/5 ⭐</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Yelp:</span>
                              <span>{practice.ratings.yelp}/5 ⭐</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="border-l-4 border-blue-500 pl-3">
                          <p className="text-xs text-gray-600">Medicare Patients</p>
                          <p className="font-bold text-lg">{practice.medicarePatients}</p>
                          <p className="text-xs text-gray-500">Avg: {practice.avgReimbursement.medicare}</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-3">
                          <p className="text-xs text-gray-600">Medicaid Patients</p>
                          <p className="font-bold text-lg">{practice.medicaidPatients}</p>
                          <p className="text-xs text-gray-500">Avg: {practice.avgReimbursement.medicaid}</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-3">
                          <p className="text-xs text-gray-600">Commercial Patients</p>
                          <p className="font-bold text-lg">{practice.commercialPatients}</p>
                          <p className="text-xs text-gray-500">Avg: {practice.avgReimbursement.commercial}</p>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-3">
                          <p className="text-xs text-gray-600">
                            {selectedCPT === 'ALL' ? 'Avg All CPT' : `CPT ${selectedCPT}`}
                          </p>
                          <p className="font-bold text-lg">{practice.cptData}</p>
                          <p className="text-xs text-gray-500">Per procedure</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {practice.website && (
                          <a href={practice.website} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">🌐 Visit Website</Button>
                          </a>
                        )}
                        <Button size="sm" variant="outline">💰 Price Transparency</Button>
                        <Link href={`/search/practices/profile/${practice.id}`}>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            📋 Create Practice Profile
                          </Button>
                        </Link>
                        <Button size="sm">Add to Contract</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map View */}
            <Card>
              <CardHeader>
                <CardTitle>📍 Practice Locations Map</CardTitle>
                <CardDescription>Visual representation of search results with ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <PracticeSearchMap practices={searchResults} />
              </CardContent>
            </Card>
          </>
        )}

        {searchResults.length === 0 && !searching && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Ready to Search</h3>
              <p className="text-gray-600">
                Select specialty and filters above to search nationwide practices
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
