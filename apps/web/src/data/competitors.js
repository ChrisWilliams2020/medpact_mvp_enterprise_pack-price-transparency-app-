// 8 Competitor Practices with Intel Data

export const COMPETITOR_PRACTICES = [
  {
    id: 'comp1',
    name: 'Vision Excellence Center',
    type: 'ophthalmology',
    address: '123 Market St, San Francisco, CA 94102',
    lat: 37.7849,
    lng: -122.4094,
    ratings: { google: 4.8, yelp: 4.5, healthgrades: 4.9 },
    reviewCount: 342,
    website: 'visionexcellence.com',
    intel: {
      providers: ['Dr. Sarah Chen - Harvard Medical School', 'Dr. Michael Park - Stanford Ophthalmology'],
      equipment: ['Zeiss OPMI Lumera', 'Alcon LenSx Femtosecond', 'Topcon Maestro OCT'],
      services: ['Cataract Surgery', 'LASIK', 'Glaucoma Treatment', 'Retina Care', 'Oculoplastics'],
      staff: 24,
      languages: ['English', 'Spanish', 'Mandarin'],
      telehealth: true,
      avgWaitTime: '12 min'
    }
  },
  {
    id: 'comp2',
    name: 'Bay Area Eye Associates',
    type: 'optometry',
    address: '456 Powell St, San Francisco, CA 94108',
    lat: 37.7879,
    lng: -122.4075,
    ratings: { google: 4.6, yelp: 4.3, healthgrades: 4.7 },
    reviewCount: 218,
    website: 'bayareaeye.com',
    intel: {
      providers: ['Dr. Jennifer Lee - UC Berkeley Optometry', 'Dr. David Wong - Pacific University'],
      equipment: ['Optos Daytona', 'Humphrey Visual Field', 'iCare Tonometer'],
      services: ['Comprehensive Eye Exams', 'Contact Lens Fitting', 'Dry Eye Treatment', 'Myopia Control'],
      staff: 12,
      languages: ['English', 'Cantonese', 'Vietnamese'],
      telehealth: true,
      avgWaitTime: '8 min'
    }
  },
  {
    id: 'comp3',
    name: 'Pacific Vision Institute',
    type: 'ophthalmology',
    address: '789 Geary St, San Francisco, CA 94109',
    lat: 37.7865,
    lng: -122.4145,
    ratings: { google: 4.9, yelp: 4.7, healthgrades: 4.8 },
    reviewCount: 567,
    website: 'pacificvision.com',
    intel: {
      providers: ['Dr. Robert Kim - Johns Hopkins', 'Dr. Lisa Zhang - Mayo Clinic Fellowship', 'Dr. James Miller - Wills Eye'],
      equipment: ['Zeiss VisuMax', 'Alcon Constellation', 'Heidelberg Spectralis', 'Lenstar LS 900'],
      services: ['LASIK', 'PRK', 'ICL', 'Cataract Surgery', 'Cornea Transplant', 'Keratoconus Treatment'],
      staff: 35,
      languages: ['English', 'Spanish', 'Korean', 'Tagalog'],
      telehealth: true,
      avgWaitTime: '15 min'
    }
  },
  {
    id: 'comp4',
    name: 'Golden Gate Ophthalmology',
    type: 'ophthalmology',
    address: '321 Sutter St, San Francisco, CA 94108',
    lat: 37.7895,
    lng: -122.4055,
    ratings: { google: 4.5, yelp: 4.2, healthgrades: 4.6 },
    reviewCount: 189,
    website: 'goldengateophth.com',
    intel: {
      providers: ['Dr. William Brown - UCSF Ophthalmology', 'Dr. Emily Davis - Duke Eye Center'],
      equipment: ['Zeiss IOLMaster 700', 'Alcon Centurion', 'Optovue Avanti'],
      services: ['Cataract Surgery', 'Glaucoma Surgery', 'Macular Degeneration', 'Diabetic Eye Care'],
      staff: 18,
      languages: ['English', 'Spanish', 'Russian'],
      telehealth: false,
      avgWaitTime: '20 min'
    }
  },
  {
    id: 'comp5',
    name: 'Silicon Valley Eye Center',
    type: 'ophthalmology',
    address: '555 Castro St, Mountain View, CA 94041',
    lat: 37.3894,
    lng: -122.0819,
    ratings: { google: 4.7, yelp: 4.4, healthgrades: 4.8 },
    reviewCount: 423,
    website: 'sveye.com',
    intel: {
      providers: ['Dr. Andrew Thompson - Stanford', 'Dr. Michelle Garcia - Bascom Palmer'],
      equipment: ['CATALYS Laser', 'Zeiss Cirrus OCT', 'Nidek Excimer Laser'],
      services: ['Premium Cataract Surgery', 'LASIK', 'Glaucoma', 'Pediatric Ophthalmology'],
      staff: 28,
      languages: ['English', 'Spanish', 'Hindi', 'Mandarin'],
      telehealth: true,
      avgWaitTime: '10 min'
    }
  },
  {
    id: 'comp6',
    name: 'Peninsula Eye Care',
    type: 'optometry',
    address: '888 El Camino Real, Palo Alto, CA 94301',
    lat: 37.4419,
    lng: -122.1430,
    ratings: { google: 4.4, yelp: 4.1, healthgrades: 4.5 },
    reviewCount: 156,
    website: 'peninsulaeyecare.com',
    intel: {
      providers: ['Dr. Nancy White - SCCO', 'Dr. Tom Richards - New England College of Optometry'],
      equipment: ['Topcon CT-1', 'Marco TRS-5100', 'Oculus Keratograph'],
      services: ['Eye Exams', 'Contact Lenses', 'Vision Therapy', 'Sports Vision'],
      staff: 8,
      languages: ['English', 'Spanish'],
      telehealth: true,
      avgWaitTime: '5 min'
    }
  },
  {
    id: 'comp7',
    name: 'South Bay Retina',
    type: 'ophthalmology',
    address: '1200 Scott Blvd, Santa Clara, CA 95050',
    lat: 37.3541,
    lng: -121.9552,
    ratings: { google: 4.8, yelp: 4.6, healthgrades: 4.9 },
    reviewCount: 287,
    website: 'southbayretina.com',
    intel: {
      providers: ['Dr. Richard Nguyen - Wilmer Eye Institute', 'Dr. Karen Patel - UCLA Jules Stein'],
      equipment: ['Zeiss PLEX Elite', 'Alcon Constellation', 'Optos California'],
      services: ['Retinal Detachment', 'Macular Degeneration', 'Diabetic Retinopathy', 'Vitrectomy', 'Injections'],
      staff: 22,
      languages: ['English', 'Spanish', 'Vietnamese', 'Hindi'],
      telehealth: true,
      avgWaitTime: '18 min'
    }
  },
  {
    id: 'comp8',
    name: 'East Bay Vision Center',
    type: 'general',
    address: '2400 Shattuck Ave, Berkeley, CA 94704',
    lat: 37.8660,
    lng: -122.2590,
    ratings: { google: 4.3, yelp: 4.0, healthgrades: 4.4 },
    reviewCount: 134,
    website: 'eastbayvision.com',
    intel: {
      providers: ['Dr. Laura Martinez - UC Berkeley', 'Dr. Chris Anderson - Illinois College of Optometry'],
      equipment: ['Nidek OPD-Scan III', 'Topcon 3D OCT', 'Reichert Tono-Pen'],
      services: ['Family Eye Care', 'Pediatric Exams', 'Geriatric Vision', 'Low Vision Aids'],
      staff: 10,
      languages: ['English', 'Spanish', 'Japanese'],
      telehealth: false,
      avgWaitTime: '15 min'
    }
  }
];

export const PATIENT_HEATMAP_DATA = [
  { zip: '94102', name: 'Tenderloin/Civic Center', patients: 245, profitIndex: 72, lat: 37.7815, lng: -122.4117 },
  { zip: '94103', name: 'South of Market', patients: 312, profitIndex: 85, lat: 37.7726, lng: -122.4110 },
  { zip: '94104', name: 'Financial District', patients: 89, profitIndex: 99, lat: 37.7914, lng: -122.4020 },
  { zip: '94105', name: 'Rincon Hill', patients: 156, profitIndex: 94, lat: 37.7898, lng: -122.3925 },
  { zip: '94107', name: 'Potrero Hill', patients: 287, profitIndex: 88, lat: 37.7621, lng: -122.3971 },
  { zip: '94108', name: 'Chinatown', patients: 198, profitIndex: 76, lat: 37.7925, lng: -122.4074 },
  { zip: '94109', name: 'Russian Hill/Nob Hill', patients: 423, profitIndex: 96, lat: 37.7935, lng: -122.4213 },
  { zip: '94110', name: 'Mission District', patients: 534, profitIndex: 79, lat: 37.7485, lng: -122.4156 },
  { zip: '94111', name: 'Embarcadero', patients: 67, profitIndex: 98, lat: 37.7990, lng: -122.3985 },
  { zip: '94112', name: 'Ingleside', patients: 612, profitIndex: 74, lat: 37.7198, lng: -122.4426 },
  { zip: '94114', name: 'Castro', patients: 356, profitIndex: 91, lat: 37.7609, lng: -122.4350 },
  { zip: '94115', name: 'Pacific Heights', patients: 289, profitIndex: 97, lat: 37.7869, lng: -122.4377 },
  { zip: '94116', name: 'Sunset', patients: 478, profitIndex: 82, lat: 37.7439, lng: -122.4855 },
  { zip: '94117', name: 'Haight-Ashbury', patients: 267, profitIndex: 84, lat: 37.7699, lng: -122.4469 },
  { zip: '94118', name: 'Inner Richmond', patients: 345, profitIndex: 89, lat: 37.7825, lng: -122.4619 },
  { zip: '94121', name: 'Outer Richmond', patients: 398, profitIndex: 81, lat: 37.7785, lng: -122.4930 },
  { zip: '94122', name: 'Outer Sunset', patients: 567, profitIndex: 78, lat: 37.7588, lng: -122.4845 },
  { zip: '94123', name: 'Marina', patients: 234, profitIndex: 95, lat: 37.8005, lng: -122.4360 },
  { zip: '94124', name: 'Bayview', patients: 389, profitIndex: 68, lat: 37.7308, lng: -122.3883 },
  { zip: '94127', name: 'St. Francis Wood', patients: 178, profitIndex: 93, lat: 37.7352, lng: -122.4575 }
];