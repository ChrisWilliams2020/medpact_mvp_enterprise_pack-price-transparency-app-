// MedPact v3.4 - Marketing Intelligence Data

export const MARKETING_CHANNELS = [
  { id: 'google_ads', channel: 'Google Ads', icon: '🔍', category: 'Paid Search' },
  { id: 'meta_ads', channel: 'Meta Ads', icon: '📘', category: 'Social' },
  { id: 'seo', channel: 'SEO', icon: '📈', category: 'Organic' },
  { id: 'email', channel: 'Email Marketing', icon: '📧', category: 'Direct' },
  { id: 'direct_mail', channel: 'Direct Mail', icon: '📬', category: 'Traditional' },
  { id: 'tv', channel: 'TV/Cable', icon: '📺', category: 'Traditional' },
  { id: 'radio', channel: 'Radio', icon: '📻', category: 'Traditional' },
  { id: 'referral', channel: 'Physician Referral', icon: '🩺', category: 'Referral' },
  { id: 'community', channel: 'Community Events', icon: '🎉', category: 'Events' },
  { id: 'pr', channel: 'PR/Media', icon: '📰', category: 'Earned' }
];

export const CAMPAIGN_TEMPLATES = [
  {
    id: 'cataract_awareness',
    name: 'Cataract Awareness Campaign',
    objective: 'Generate cataract surgery leads',
    channels: ['google_ads', 'meta_ads', 'email'],
    targetAudience: 'Adults 55+, vision concerns',
    suggestedBudget: { min: 3000, max: 8000 },
    duration: '3 months',
    expectedROI: '4-6x',
    keyMessages: [
      'Clear vision in just 15 minutes',
      'Premium IOL options available',
      'Most insurance accepted',
      'Free consultation'
    ],
    landingPages: ['Cataract Info', 'Premium IOL Options', 'Schedule Consultation'],
    kpis: ['Leads', 'Consultations Scheduled', 'Surgeries Booked', 'Cost Per Lead']
  },
  {
    id: 'premium_iol',
    name: 'Premium IOL Promotion',
    objective: 'Increase premium IOL conversion',
    channels: ['google_ads', 'meta_ads', 'email', 'direct_mail'],
    targetAudience: 'Cataract surgery candidates, affluent demographics',
    suggestedBudget: { min: 5000, max: 12000 },
    duration: '6 months',
    expectedROI: '8-12x',
    keyMessages: [
      'See clearly at all distances',
      'Reduce dependence on glasses',
      'Advanced technology available',
      'Financing options available'
    ],
    landingPages: ['Premium IOL Guide', 'Technology Comparison', 'Patient Testimonials'],
    kpis: ['Premium IOL Inquiries', 'Consultation Requests', 'Conversion Rate', 'Revenue Per Procedure']
  },
  {
    id: 'dry_eye',
    name: 'Dry Eye Treatment Program',
    objective: 'Build dry eye treatment patient base',
    channels: ['google_ads', 'meta_ads', 'seo', 'email'],
    targetAudience: 'Adults with dry eye symptoms, screen users',
    suggestedBudget: { min: 2000, max: 5000 },
    duration: '4 months',
    expectedROI: '3-5x',
    keyMessages: [
      'Advanced dry eye diagnostics',
      'Customized treatment plans',
      'IPL and other cutting-edge treatments',
      'Long-lasting relief'
    ],
    landingPages: ['Dry Eye Quiz', 'Treatment Options', 'Book Assessment'],
    kpis: ['Quiz Completions', 'Appointments Booked', 'Treatment Plans Started', 'Retention Rate']
  },
  {
    id: 'glaucoma_screening',
    name: 'Glaucoma Screening Initiative',
    objective: 'Increase glaucoma patient detection',
    channels: ['meta_ads', 'community', 'pr', 'email'],
    targetAudience: 'Adults 40+, family history, at-risk populations',
    suggestedBudget: { min: 2500, max: 6000 },
    duration: '3 months',
    expectedROI: '2-4x',
    keyMessages: [
      'The "silent thief of sight"',
      'Free glaucoma screenings',
      'Early detection saves vision',
      'Advanced monitoring technology'
    ],
    landingPages: ['Glaucoma Risk Quiz', 'Screening Event', 'Patient Resources'],
    kpis: ['Screenings Completed', 'New Glaucoma Diagnoses', 'Treatment Starts', 'Community Reach']
  },
  {
    id: 'new_practice',
    name: 'New Practice Launch',
    objective: 'Build patient base for new location',
    channels: ['google_ads', 'meta_ads', 'direct_mail', 'community', 'pr'],
    targetAudience: 'Residents within 10-mile radius',
    suggestedBudget: { min: 8000, max: 20000 },
    duration: '6 months',
    expectedROI: '5-8x',
    keyMessages: [
      'Now accepting new patients',
      'Convenient location',
      'State-of-the-art facility',
      'Welcoming new patients special'
    ],
    landingPages: ['About Our Practice', 'Meet the Doctors', 'New Patient Special'],
    kpis: ['New Patient Appointments', 'Brand Awareness', 'Website Traffic', 'Phone Calls']
  },
  {
    id: 'pediatric_eye',
    name: 'Pediatric Eye Care',
    objective: 'Grow pediatric patient segment',
    channels: ['meta_ads', 'community', 'referral', 'seo'],
    targetAudience: 'Parents of children 3-18',
    suggestedBudget: { min: 2000, max: 5000 },
    duration: '4 months',
    expectedROI: '3-5x',
    keyMessages: [
      'Child-friendly environment',
      'Back-to-school eye exams',
      'Myopia management',
      'Accepting most vision plans'
    ],
    landingPages: ['Pediatric Services', 'First Eye Exam Guide', 'Myopia Control'],
    kpis: ['Pediatric Appointments', 'Myopia Consults', 'Parent Satisfaction', 'Referrals']
  }
];

export const MARKETING_METRICS = {
  cpl: { name: 'Cost Per Lead', benchmark: 85, unit: 'currency', lowerIsBetter: true },
  cpa: { name: 'Cost Per Acquisition', benchmark: 250, unit: 'currency', lowerIsBetter: true },
  roas: { name: 'Return on Ad Spend', benchmark: 4.5, unit: 'ratio' },
  conversion_rate: { name: 'Conversion Rate', benchmark: 8, unit: 'percent' },
  ctr: { name: 'Click-Through Rate', benchmark: 3.5, unit: 'percent' },
  website_traffic: { name: 'Monthly Website Traffic', benchmark: 5000, unit: 'number' },
  organic_traffic: { name: 'Organic Traffic %', benchmark: 45, unit: 'percent' },
  bounce_rate: { name: 'Bounce Rate', benchmark: 45, unit: 'percent', lowerIsBetter: true },
  phone_calls: { name: 'Monthly Phone Calls', benchmark: 450, unit: 'number' },
  form_submissions: { name: 'Monthly Form Submissions', benchmark: 85, unit: 'number' },
  review_rating: { name: 'Avg Review Rating', benchmark: 4.7, unit: 'number' },
  review_count: { name: 'Total Reviews', benchmark: 250, unit: 'number' },
  social_followers: { name: 'Social Followers', benchmark: 2500, unit: 'number' },
  email_open_rate: { name: 'Email Open Rate', benchmark: 22, unit: 'percent' },
  email_click_rate: { name: 'Email Click Rate', benchmark: 3.5, unit: 'percent' }
};

export const COMPETITOR_MARKETING = [
  {
    competitor: 'Regional Eye Center',
    name: 'Premium Vision Campaign',
    channel: 'Google Ads',
    date: 'Mar 2026',
    budget: 8500,
    impressions: 125000,
    clicks: 4200,
    status: 'Active',
    objectives: ['Generate premium IOL leads', 'Brand awareness'],
    creatives: [
      { image: '/images/ad1.jpg', text: 'See Clearly at All Distances' },
      { image: '/images/ad2.jpg', text: 'Premium Lens Technology' }
    ],
    estimatedCPL: 78,
    keywords: ['premium cataract surgery', 'multifocal lens', 'lifestyle lenses']
  },
  {
    competitor: 'Regional Eye Center',
    name: 'LASIK Spring Special',
    channel: 'Meta Ads',
    date: 'Mar 2026',
    budget: 5200,
    impressions: 89000,
    clicks: 2100,
    status: 'Active',
    objectives: ['LASIK consultations', 'Young professional targeting'],
    creatives: [
      { image: '/images/ad3.jpg', text: 'Ditch the Glasses This Spring' },
      { image: '/images/ad4.jpg', text: '$500 Off LASIK - Limited Time' }
    ],
    estimatedCPL: 65,
    keywords: ['LASIK surgery', 'vision correction', 'no glasses']
  },
  {
    competitor: 'Vision Care Associates',
    name: 'Dry Eye Solutions',
    channel: 'Google Ads',
    date: 'Mar 2026',
    budget: 3200,
    impressions: 45000,
    clicks: 1350,
    status: 'Active',
    objectives: ['Dry eye treatment leads', 'Build specialty reputation'],
    creatives: [
      { image: '/images/ad5.jpg', text: 'Tired of Dry, Irritated Eyes?' },
      { image: '/images/ad6.jpg', text: 'Advanced Dry Eye Treatment' }
    ],
    estimatedCPL: 92,
    keywords: ['dry eye treatment', 'eye irritation', 'IPL dry eye']
  },
  {
    competitor: 'Eye Surgery Specialists',
    name: 'Retina Excellence',
    channel: 'Google Ads',
    date: 'Mar 2026',
    budget: 6800,
    impressions: 78000,
    clicks: 2800,
    status: 'Active',
    objectives: ['Retina referrals', 'Physician outreach'],
    creatives: [
      { image: '/images/ad7.jpg', text: 'Expert Retina Care' },
      { image: '/images/ad8.jpg', text: 'Same-Day Urgent Appointments' }
    ],
    estimatedCPL: 125,
    keywords: ['retina specialist', 'macular degeneration', 'diabetic eye']
  },
  {
    competitor: 'Eye Surgery Specialists',
    name: 'Glaucoma Awareness',
    channel: 'Meta Ads',
    date: 'Mar 2026',
    budget: 4500,
    impressions: 112000,
    clicks: 2900,
    status: 'Active',
    objectives: ['Glaucoma screenings', 'Community outreach'],
    creatives: [
      { image: '/images/ad9.jpg', text: 'Protect Your Vision' },
      { image: '/images/ad10.jpg', text: 'Free Glaucoma Screening Event' }
    ],
    estimatedCPL: 55,
    keywords: ['glaucoma screening', 'eye pressure', 'vision loss prevention']
  },
  {
    competitor: 'Community Eye Clinic',
    name: 'Affordable Eye Care',
    channel: 'Google Ads',
    date: 'Mar 2026',
    budget: 1800,
    impressions: 32000,
    clicks: 850,
    status: 'Active',
    objectives: ['Price-conscious patients', 'Insurance acceptance'],
    creatives: [
      { image: '/images/ad11.jpg', text: 'Quality Eye Care, Affordable Prices' },
      { image: '/images/ad12.jpg', text: 'We Accept All Insurance' }
    ],
    estimatedCPL: 45,
    keywords: ['affordable eye exam', 'cheap eye doctor', 'accepts medicaid']
  }
];

export const COMPETITOR_INTEL = [
  {
    id: 'comp1',
    name: 'Regional Eye Center',
    type: 'ophthalmology',
    distance: '2.3 miles',
    address: '1234 Medical Plaza Dr, Philadelphia, PA 19103',
    phone: '(215) 555-1234',
    website: 'www.regionaleyecenter.com',
    providers: 8,
    googleRating: 4.6,
    googleReviews: 312,
    yelpRating: 4.4,
    yelpReviews: 89,
    healthgradesRating: 4.5,
    services: ['Cataract', 'LASIK', 'Glaucoma', 'Retina', 'Comprehensive'],
    strengths: ['High volume cataract', 'Strong marketing', 'Multiple locations', 'Own ASC'],
    weaknesses: ['Long wait times', 'Limited specialty care', 'Staff turnover'],
    marketShare: 28,
    monthlyAdSpend: 15500,
    websiteIntel: {
      providerCredentials: ['Board Certified', 'Fellowship Trained', 'Multiple Specialties'],
      equipment: ['Femto Laser', 'OCT', 'Visual Fields', 'Fundus Camera'],
      services: ['Cataract Surgery', 'LASIK', 'Glaucoma Treatment', 'Retina Care'],
      practiceDetails: {
        yearEstablished: 2008,
        locations: 3,
        languages: ['English', 'Spanish', 'Vietnamese'],
        telehealth: true,
        avgWaitTime: '25 min',
        acceptingNew: true
      }
    },
    heatMapData: [
      { zip: '19103', patients: 245, profitIndex: 92 },
      { zip: '19104', patients: 189, profitIndex: 88 },
      { zip: '19102', patients: 156, profitIndex: 95 }
    ]
  },
  {
    id: 'comp2',
    name: 'Vision Care Associates',
    type: 'ophthalmology',
    distance: '4.1 miles',
    address: '567 Healthcare Way, Philadelphia, PA 19107',
    phone: '(215) 555-5678',
    website: 'www.visioncareassoc.com',
    providers: 5,
    googleRating: 4.4,
    googleReviews: 187,
    yelpRating: 4.2,
    yelpReviews: 56,
    healthgradesRating: 4.3,
    services: ['Comprehensive', 'Glaucoma', 'Dry Eye', 'Optical'],
    strengths: ['Personalized care', 'Good reputation', 'Experienced staff'],
    weaknesses: ['Limited surgical', 'Older facility', 'Small optical'],
    marketShare: 18,
    monthlyAdSpend: 6200,
    websiteIntel: {
      providerCredentials: ['Board Certified', '20+ Years Experience'],
      equipment: ['OCT', 'Visual Fields', 'Topographer'],
      services: ['Comprehensive Exams', 'Glaucoma Management', 'Dry Eye Treatment'],
      practiceDetails: {
        yearEstablished: 1995,
        locations: 1,
        languages: ['English'],
        telehealth: false,
        avgWaitTime: '15 min',
        acceptingNew: true
      }
    },
    heatMapData: [
      { zip: '19107', patients: 178, profitIndex: 85 },
      { zip: '19106', patients: 134, profitIndex: 82 }
    ]
  },
  {
    id: 'comp3',
    name: 'Eye Surgery Specialists',
    type: 'ophthalmology',
    distance: '5.8 miles',
    address: '890 Surgical Center Blvd, Philadelphia, PA 19111',
    phone: '(215) 555-9012',
    website: 'www.eyesurgeryspec.com',
    providers: 12,
    googleRating: 4.8,
    googleReviews: 456,
    yelpRating: 4.7,
    yelpReviews: 123,
    healthgradesRating: 4.8,
    services: ['Cataract', 'Retina', 'Oculoplastics', 'Cornea', 'Glaucoma', 'Premium IOL'],
    strengths: ['Full subspecialty', 'Premium IOL focus', 'Own ASC', 'Strong referral network'],
    weaknesses: ['Higher prices', 'Longer scheduling', 'Less convenient location'],
    marketShare: 35,
    monthlyAdSpend: 18500,
    websiteIntel: {
      providerCredentials: ['Fellowship Trained', 'Published Research', 'Teaching Faculty'],
      equipment: ['ORA System', 'Femto', 'OCT-A', 'MIGS devices', 'LenSx'],
      services: ['All Subspecialties', 'Premium IOLs', 'Clinical Trials'],
      practiceDetails: {
        yearEstablished: 2002,
        locations: 4,
        languages: ['English', 'Spanish', 'Mandarin', 'Korean'],
        telehealth: true,
        avgWaitTime: '30 min',
        acceptingNew: true
      }
    },
    heatMapData: [
      { zip: '19111', patients: 312, profitIndex: 98 },
      { zip: '19114', patients: 267, profitIndex: 94 },
      { zip: '19115', patients: 234, profitIndex: 91 }
    ]
  },
  {
    id: 'comp4',
    name: 'Community Eye Clinic',
    type: 'ophthalmology',
    distance: '3.2 miles',
    address: '321 Community Dr, Philadelphia, PA 19120',
    phone: '(215) 555-3456',
    website: 'www.communityeyeclinic.org',
    providers: 3,
    googleRating: 4.2,
    googleReviews: 89,
    yelpRating: 4.0,
    yelpReviews: 34,
    healthgradesRating: 4.1,
    services: ['Comprehensive', 'Basic Cataract', 'Optical'],
    strengths: ['Affordable', 'Accepts all insurance', 'Community focused', 'Bilingual staff'],
    weaknesses: ['Limited services', 'Older equipment', 'Long wait for surgery'],
    marketShare: 12,
    monthlyAdSpend: 2500,
    websiteIntel: {
      providerCredentials: ['Board Certified'],
      equipment: ['Basic OCT', 'Visual Fields'],
      services: ['Comprehensive Exams', 'Cataract Surgery', 'Glasses'],
      practiceDetails: {
        yearEstablished: 2012,
        locations: 1,
        languages: ['English', 'Spanish', 'Vietnamese'],
        telehealth: false,
        avgWaitTime: '20 min',
        acceptingNew: true
      }
    },
    heatMapData: [
      { zip: '19120', patients: 156, profitIndex: 68 },
      { zip: '19121', patients: 123, profitIndex: 65 }
    ]
  },
  {
    id: 'comp5',
    name: 'Clear Vision Optometry',
    type: 'optometry',
    distance: '1.5 miles',
    address: '456 Main St, Philadelphia, PA 19102',
    phone: '(215) 555-7890',
    website: 'www.clearvisionod.com',
    providers: 4,
    googleRating: 4.7,
    googleReviews: 234,
    yelpRating: 4.6,
    yelpReviews: 78,
    healthgradesRating: 4.5,
    services: ['Comprehensive Eye Exams', 'Contact Lenses', 'Optical', 'Dry Eye', 'Myopia Control'],
    strengths: ['Convenient location', 'Great reviews', 'Modern optical', 'Strong CL fitting'],
    weaknesses: ['No surgical', 'Limited medical', 'Smaller practice'],
    marketShare: 15,
    monthlyAdSpend: 4200,
    websiteIntel: {
      providerCredentials: ['OD', 'Residency Trained', 'Specialty Certified'],
      equipment: ['OCT', 'Topographer', 'Optomap', 'iLux'],
      services: ['Comprehensive Exams', 'Contact Lenses', 'Dry Eye', 'Myopia Management'],
      practiceDetails: {
        yearEstablished: 2018,
        locations: 1,
        languages: ['English', 'Spanish'],
        telehealth: true,
        avgWaitTime: '10 min',
        acceptingNew: true
      }
    },
    heatMapData: [
      { zip: '19102', patients: 198, profitIndex: 89 },
      { zip: '19103', patients: 167, profitIndex: 86 }
    ]
  },
  {
    id: 'comp6',
    name: 'Metro Eye Associates',
    type: 'ophthalmology',
    distance: '6.2 miles',
    address: '789 Metro Medical Center, Philadelphia, PA 19123',
    phone: '(215) 555-2345',
    website: 'www.metroeyeassoc.com',
    providers: 6,
    googleRating: 4.3,
    googleReviews: 167,
    yelpRating: 4.1,
    yelpReviews: 45,
    healthgradesRating: 4.2,
    services: ['Cataract', 'Comprehensive', 'Glaucoma', 'Neuro-Ophthalmology'],
    strengths: ['Neuro-ophthalmology', 'Hospital affiliation', 'Research programs'],
    weaknesses: ['Academic pace', 'Complex scheduling', 'Teaching delays'],
    marketShare: 14,
    monthlyAdSpend: 5800,
    websiteIntel: {
      providerCredentials: ['Academic Faculty', 'Published', 'Fellowship Trained'],
      equipment: ['Full diagnostic suite', 'Research equipment'],
      services: ['Neuro-Ophthalmology', 'Complex Cases', 'Second Opinions'],
      practiceDetails: {
        yearEstablished: 1985,
        locations: 2,
        languages: ['English'],
        telehealth: true,
        avgWaitTime: '35 min',
        acceptingNew: false
      }
    },
    heatMapData: [
      { zip: '19123', patients: 145, profitIndex: 78 },
      { zip: '19122', patients: 112, profitIndex: 75 }
    ]
  },
  {
    id: 'comp7',
    name: 'Family Eye Care Center',
    type: 'general',
    distance: '2.8 miles',
    address: '234 Family Plaza, Philadelphia, PA 19131',
    phone: '(215) 555-6789',
    website: 'www.familyeyecarecenter.com',
    providers: 3,
    googleRating: 4.5,
    googleReviews: 198,
    yelpRating: 4.4,
    yelpReviews: 67,
    healthgradesRating: 4.4,
    services: ['Pediatric', 'Comprehensive', 'Contact Lenses', 'Vision Therapy', 'Optical'],
    strengths: ['Pediatric focus', 'Family friendly', 'Vision therapy', 'Flexible hours'],
    weaknesses: ['Limited adult medical', 'No surgical', 'Smaller optical'],
    marketShare: 8,
    monthlyAdSpend: 3200,
    websiteIntel: {
      providerCredentials: ['OD', 'Pediatric Certified', 'Vision Therapy Certified'],
      equipment: ['Pediatric-friendly equipment', 'Vision therapy tools'],
      services: ['Pediatric Exams', 'Vision Therapy', 'Contact Lenses'],
      practiceDetails: {
        yearEstablished: 2015,
        locations: 1,
        languages: ['English', 'Spanish'],
        telehealth: false,
        avgWaitTime: '12 min',
        acceptingNew: true
      }
    },
    heatMapData: [
      { zip: '19131', patients: 167, profitIndex: 82 },
      { zip: '19132', patients: 134, profitIndex: 79 }
    ]
  },
  {
    id: 'comp8',
    name: 'Advanced Retina Institute',
    type: 'ophthalmology',
    distance: '7.5 miles',
    address: '901 Specialty Medical Park, Philadelphia, PA 19140',
    phone: '(215) 555-4321',
    website: 'www.advancedretina.com',
    providers: 10,
    googleRating: 4.9,
    googleReviews: 512,
    yelpRating: 4.8,
    yelpReviews: 134,
    healthgradesRating: 4.9,
    services: ['Retina', 'Macular Degeneration', 'Diabetic Eye Care', 'Retinal Surgery'],
    strengths: ['Highly specialized', 'Expert surgeons', 'Cutting-edge technology'],
    weaknesses: ['Niche service', 'Higher cost', 'Limited to retinal conditions'],
    marketShare: 10,
    monthlyAdSpend: 7200,
    websiteIntel: {
      providerCredentials: ['Fellowship Trained', 'Board Certified'],
      equipment: ['Spectral Domain OCT', 'Fundus Autofluorescence', 'Wide-field Imaging'],
      services: ['Retina Exams', 'Diabetic Eye Management', 'Macular Degeneration Treatment'],
      practiceDetails: {
        yearEstablished: 2010,
        locations: 1,
        languages: ['English', 'Spanish'],
        telehealth: true,
        avgWaitTime: '15 min',
        acceptingNew: true
      }
    },
    heatMapData: [
      { zip: '19140', patients: 98, profitIndex: 90 },
      { zip: '19141', patients: 76, profitIndex: 88 }
    ]
  }
];