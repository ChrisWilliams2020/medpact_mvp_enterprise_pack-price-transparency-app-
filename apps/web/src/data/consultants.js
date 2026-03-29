// MedPact v3.4 - Consultant Marketplace Data

export const CONSULTANT_CATEGORIES = [
  { id: 'rcm', name: 'Revenue Cycle', icon: '💰', description: 'Billing, coding, collections optimization' },
  { id: 'operations', name: 'Operations', icon: '⚙️', description: 'Workflow, efficiency, process improvement' },
  { id: 'compliance', name: 'Compliance', icon: '📋', description: 'HIPAA, OSHA, regulatory compliance' },
  { id: 'hr', name: 'Human Resources', icon: '👥', description: 'Staffing, training, culture' },
  { id: 'marketing', name: 'Marketing', icon: '📢', description: 'Patient acquisition, branding, digital' },
  { id: 'technology', name: 'Technology', icon: '💻', description: 'EHR, IT infrastructure, cybersecurity' },
  { id: 'financial', name: 'Financial', icon: '📊', description: 'Accounting, valuations, M&A' },
  { id: 'legal', name: 'Legal', icon: '⚖️', description: 'Contracts, partnerships, litigation' },
  { id: 'clinical', name: 'Clinical', icon: '🩺', description: 'Quality improvement, protocols, outcomes' },
  { id: 'strategy', name: 'Strategy', icon: '🎯', description: 'Growth planning, market analysis' }
];

export const SERVICE_PACKAGES = [
  { id: 'assessment', name: 'Assessment', duration: '2-4 weeks', priceRange: '$5,000 - $15,000' },
  { id: 'implementation', name: 'Implementation', duration: '3-6 months', priceRange: '$25,000 - $75,000' },
  { id: 'ongoing', name: 'Ongoing Support', duration: 'Monthly', priceRange: '$2,500 - $10,000/mo' },
  { id: 'project', name: 'Project-Based', duration: 'Varies', priceRange: 'Custom quote' },
  { id: 'hourly', name: 'Hourly Consulting', duration: 'As needed', priceRange: '$150 - $500/hr' }
];

export const CONSULTANTS = [
  // RCM Consultants
  {
    id: 'c001',
    name: 'Sarah Mitchell, CPC, CPMA',
    avatar: '👩‍💼',
    title: 'Revenue Cycle Director',
    company: 'OptiRevenue Consulting',
    category: 'rcm',
    rating: 4.9,
    reviews: 47,
    location: 'Philadelphia, PA',
    remote: true,
    experience: 18,
    projectsCompleted: 124,
    successRate: 94,
    hourlyRate: 275,
    bio: 'Former VP of Revenue Cycle at a 50-physician ophthalmology group. Specializes in denial management, coding optimization, and payer contract negotiations.',
    specialties: ['Denial Management', 'Coding Optimization', 'Payer Negotiations', 'A/R Recovery', 'Staff Training'],
    certifications: ['CPC', 'CPMA', 'COPC', 'COE', 'Lean Six Sigma'],
    availability: 'available',
    responseTime: '< 2 hours',
    languages: ['English', 'Spanish'],
    caseStudies: [
      { title: 'Reduced denial rate from 12% to 4%', result: '+$380K annual revenue', client: '8-provider practice' },
      { title: 'Renegotiated 5 payer contracts', result: '+18% avg reimbursement', client: 'Regional eye center' }
    ],
    packages: [
      { type: 'assessment', name: 'RCM Health Check', price: 8500, description: 'Complete revenue cycle audit with actionable recommendations' },
      { type: 'implementation', name: 'Denial Reduction Program', price: 35000, description: '6-month program to reduce denials by 50%+' },
      { type: 'ongoing', name: 'RCM Oversight', price: 4500, description: 'Monthly KPI monitoring and optimization' }
    ]
  },
  {
    id: 'c002',
    name: 'Michael Chen, MBA, FACHE',
    avatar: '👨‍💼',
    title: 'Healthcare Operations Expert',
    company: 'PracticeFlow Solutions',
    category: 'operations',
    rating: 4.8,
    reviews: 63,
    location: 'San Francisco, CA',
    remote: true,
    experience: 22,
    projectsCompleted: 187,
    successRate: 91,
    hourlyRate: 325,
    bio: 'Former COO of Kaiser Permanente ophthalmology division. Expert in workflow optimization, patient flow, and surgical scheduling efficiency.',
    specialties: ['Workflow Optimization', 'Patient Flow', 'Surgical Scheduling', 'Lean Operations', 'Change Management'],
    certifications: ['FACHE', 'MBA Healthcare', 'Lean Six Sigma Black Belt', 'PMP'],
    availability: 'available',
    responseTime: '< 4 hours',
    languages: ['English', 'Mandarin'],
    caseStudies: [
      { title: 'Increased surgical volume 35%', result: '+$1.2M annual revenue', client: 'ASC partnership' },
      { title: 'Reduced patient wait times 60%', result: '+22 NPS points', client: 'Multi-location practice' }
    ],
    packages: [
      { type: 'assessment', name: 'Operations Audit', price: 12000, description: 'Comprehensive workflow and efficiency analysis' },
      { type: 'implementation', name: 'Lean Transformation', price: 55000, description: '4-month operational excellence program' },
      { type: 'hourly', name: 'Executive Coaching', price: 325, description: 'One-on-one leadership development' }
    ]
  },
  {
    id: 'c003',
    name: 'Dr. Jennifer Walsh, OD, MBA',
    avatar: '👩‍⚕️',
    title: 'Clinical Operations Consultant',
    company: 'EyeCare Excellence',
    category: 'clinical',
    rating: 4.9,
    reviews: 38,
    location: 'Chicago, IL',
    remote: true,
    experience: 15,
    projectsCompleted: 89,
    successRate: 96,
    hourlyRate: 250,
    bio: 'Practicing OD with MBA who helps practices optimize clinical workflows, improve outcomes, and enhance the patient experience.',
    specialties: ['Clinical Protocols', 'Quality Metrics', 'Patient Experience', 'OD-MD Integration', 'Staff Training'],
    certifications: ['OD', 'MBA', 'COPE Administrator', 'Patient Experience Certified'],
    availability: 'limited',
    responseTime: '< 24 hours',
    languages: ['English'],
    caseStudies: [
      { title: 'Implemented outcomes tracking', result: '98% BCVA target achievement', client: 'Cataract surgery center' },
      { title: 'OD-MD co-management program', result: '+$240K annual referral revenue', client: '4-location practice' }
    ],
    packages: [
      { type: 'assessment', name: 'Clinical Quality Review', price: 7500, description: 'Protocol and outcomes analysis' },
      { type: 'implementation', name: 'Quality Improvement Program', price: 28000, description: 'Complete clinical excellence initiative' }
    ]
  },
  {
    id: 'c004',
    name: 'David Rodriguez, SHRM-SCP',
    avatar: '👨‍💼',
    title: 'Healthcare HR Specialist',
    company: 'MedStaff Advisors',
    category: 'hr',
    rating: 4.7,
    reviews: 52,
    location: 'Dallas, TX',
    remote: true,
    experience: 16,
    projectsCompleted: 143,
    successRate: 88,
    hourlyRate: 195,
    bio: 'Specializes in healthcare staffing challenges including recruitment, retention, compensation benchmarking, and culture development.',
    specialties: ['Recruitment', 'Retention Strategies', 'Compensation Design', 'Culture Development', 'Performance Management'],
    certifications: ['SHRM-SCP', 'Healthcare HR Certification', 'DISC Certified'],
    availability: 'available',
    responseTime: '< 4 hours',
    languages: ['English', 'Spanish'],
    caseStudies: [
      { title: 'Reduced turnover from 32% to 14%', result: '$180K saved in hiring costs', client: '6-provider practice' },
      { title: 'Compensation restructure', result: 'Improved satisfaction 40%', client: 'Surgical eye center' }
    ],
    packages: [
      { type: 'assessment', name: 'HR & Culture Audit', price: 6500, description: 'Staffing analysis and recommendations' },
      { type: 'implementation', name: 'Retention Program', price: 22000, description: 'Comprehensive retention strategy implementation' },
      { type: 'project', name: 'Compensation Study', price: 8500, description: 'Market-based compensation analysis' }
    ]
  },
  {
    id: 'c005',
    name: 'Amanda Foster, CHC, CHPC',
    avatar: '👩‍💼',
    title: 'Compliance Director',
    company: 'MedCompliance Group',
    category: 'compliance',
    rating: 4.9,
    reviews: 41,
    location: 'Boston, MA',
    remote: true,
    experience: 14,
    projectsCompleted: 112,
    successRate: 99,
    hourlyRate: 285,
    bio: 'Former OCR investigator with deep expertise in HIPAA, Stark Law, Anti-Kickback, and OSHA compliance for medical practices.',
    specialties: ['HIPAA Compliance', 'Stark Law', 'Anti-Kickback', 'OSHA', 'Risk Management'],
    certifications: ['CHC', 'CHPC', 'CHPS', 'Former OCR Investigator'],
    availability: 'available',
    responseTime: '< 2 hours',
    languages: ['English'],
    caseStudies: [
      { title: 'HIPAA remediation after breach', result: 'Zero penalties, full recovery', client: 'Regional eye group' },
      { title: 'Compliance program development', result: 'Passed 3 audits consecutively', client: 'PE-backed practice' }
    ],
    packages: [
      { type: 'assessment', name: 'Compliance Risk Assessment', price: 9500, description: 'Full regulatory compliance review' },
      { type: 'implementation', name: 'Compliance Program Build', price: 32000, description: 'Complete compliance infrastructure' },
      { type: 'ongoing', name: 'Compliance Officer Services', price: 3500, description: 'Virtual compliance officer support' }
    ]
  },
  {
    id: 'c006',
    name: 'Robert Kim, MS, CPHIMS',
    avatar: '👨‍💻',
    title: 'Healthcare IT Consultant',
    company: 'MedTech Solutions',
    category: 'technology',
    rating: 4.8,
    reviews: 67,
    location: 'Seattle, WA',
    remote: true,
    experience: 19,
    projectsCompleted: 156,
    successRate: 92,
    hourlyRate: 245,
    bio: 'Expert in EHR optimization, practice management systems, cybersecurity, and digital transformation for ophthalmology practices.',
    specialties: ['EHR Optimization', 'Cybersecurity', 'System Integration', 'Digital Transformation', 'Telemedicine'],
    certifications: ['CPHIMS', 'CISSP', 'Epic Certified', 'AWS Solutions Architect'],
    availability: 'available',
    responseTime: '< 4 hours',
    languages: ['English', 'Korean'],
    caseStudies: [
      { title: 'EHR migration (Nextech to ModMed)', result: 'Zero downtime, 100% data integrity', client: '12-provider group' },
      { title: 'Cybersecurity overhaul', result: 'SOC 2 compliant in 6 months', client: 'ASC network' }
    ],
    packages: [
      { type: 'assessment', name: 'Technology Assessment', price: 8000, description: 'IT infrastructure and security review' },
      { type: 'project', name: 'EHR Optimization', price: 25000, description: 'Complete EHR workflow optimization' },
      { type: 'ongoing', name: 'Virtual CTO', price: 5500, description: 'Monthly technology leadership support' }
    ]
  },
  {
    id: 'c007',
    name: 'Lisa Thompson, MBA',
    avatar: '👩‍💼',
    title: 'Healthcare Marketing Strategist',
    company: 'PatientGrowth Marketing',
    category: 'marketing',
    rating: 4.7,
    reviews: 89,
    location: 'Los Angeles, CA',
    remote: true,
    experience: 12,
    projectsCompleted: 203,
    successRate: 87,
    hourlyRate: 185,
    bio: 'Digital marketing expert specializing in patient acquisition, reputation management, and brand development for eye care practices.',
    specialties: ['Digital Marketing', 'SEO/SEM', 'Reputation Management', 'Brand Strategy', 'Patient Acquisition'],
    certifications: ['Google Ads Certified', 'HubSpot Certified', 'Meta Blueprint', 'Healthcare Marketing Certified'],
    availability: 'available',
    responseTime: '< 2 hours',
    languages: ['English'],
    caseStudies: [
      { title: 'Premium IOL marketing campaign', result: '+45% premium IOL conversion', client: 'Cataract surgery practice' },
      { title: 'Reputation recovery program', result: '3.2 → 4.7 Google rating', client: 'Multi-specialty eye center' }
    ],
    packages: [
      { type: 'assessment', name: 'Marketing Audit', price: 5500, description: 'Digital presence and competitor analysis' },
      { type: 'implementation', name: 'Patient Acquisition Program', price: 18000, description: '6-month growth marketing initiative' },
      { type: 'ongoing', name: 'Marketing Management', price: 4500, description: 'Full-service marketing support' }
    ]
  },
  {
    id: 'c008',
    name: 'James Harrison, CPA, CVA',
    avatar: '👨‍💼',
    title: 'Healthcare Financial Advisor',
    company: 'MedFinance Partners',
    category: 'financial',
    rating: 4.9,
    reviews: 34,
    location: 'New York, NY',
    remote: true,
    experience: 21,
    projectsCompleted: 98,
    successRate: 95,
    hourlyRate: 375,
    bio: 'Former Big 4 healthcare practice leader specializing in practice valuations, M&A advisory, and financial planning for physicians.',
    specialties: ['Practice Valuation', 'M&A Advisory', 'Tax Planning', 'Financial Modeling', 'Partnership Structures'],
    certifications: ['CPA', 'CVA', 'ABV', 'MAFF'],
    availability: 'limited',
    responseTime: '< 24 hours',
    languages: ['English'],
    caseStudies: [
      { title: 'Practice sale to PE', result: '8.2x EBITDA multiple achieved', client: '15-provider ophthalmology group' },
      { title: 'Partner buy-in structuring', result: 'Tax-efficient transition plan', client: '6-partner practice' }
    ],
    packages: [
      { type: 'project', name: 'Practice Valuation', price: 15000, description: 'Comprehensive business valuation' },
      { type: 'project', name: 'M&A Advisory', price: 45000, description: 'Full transaction support (plus success fee)' },
      { type: 'hourly', name: 'Financial Consulting', price: 375, description: 'Strategic financial advisory' }
    ]
  },
  {
    id: 'c009',
    name: 'Patricia Nguyen, JD',
    avatar: '👩‍⚖️',
    title: 'Healthcare Attorney',
    company: 'MedLaw Associates',
    category: 'legal',
    rating: 4.8,
    reviews: 29,
    location: 'Houston, TX',
    remote: true,
    experience: 17,
    projectsCompleted: 234,
    successRate: 93,
    hourlyRate: 425,
    bio: 'Healthcare attorney specializing in employment law, partnership agreements, payer disputes, and regulatory matters for medical practices.',
    specialties: ['Employment Law', 'Partnership Agreements', 'Payer Disputes', 'Contract Review', 'Regulatory Defense'],
    certifications: ['JD', 'Healthcare Law Certification', 'Mediation Certified'],
    availability: 'available',
    responseTime: '< 4 hours',
    languages: ['English', 'Vietnamese'],
    caseStudies: [
      { title: 'Payer audit defense', result: '$1.2M recoupment avoided', client: 'Retina practice' },
      { title: 'Partnership dispute resolution', result: 'Amicable dissolution achieved', client: '4-partner group' }
    ],
    packages: [
      { type: 'hourly', name: 'Legal Consultation', price: 425, description: 'General healthcare legal advisory' },
      { type: 'project', name: 'Contract Package', price: 8500, description: 'Employment and vendor contract templates' },
      { type: 'project', name: 'Partnership Agreement', price: 12000, description: 'Custom partnership documentation' }
    ]
  },
  {
    id: 'c010',
    name: 'Dr. Mark Stevens, MD, MBA',
    avatar: '👨‍⚕️',
    title: 'Strategic Growth Advisor',
    company: 'EyeGrowth Strategies',
    category: 'strategy',
    rating: 5.0,
    reviews: 23,
    location: 'Phoenix, AZ',
    remote: true,
    experience: 25,
    projectsCompleted: 67,
    successRate: 97,
    hourlyRate: 450,
    bio: 'Retired ophthalmologist and former practice owner who built and sold a 22-provider group. Now advises practices on growth, expansion, and exit strategies.',
    specialties: ['Growth Strategy', 'Market Expansion', 'Exit Planning', 'Service Line Development', 'ASC Development'],
    certifications: ['MD', 'MBA', 'Board Certified Ophthalmology (Retired)'],
    availability: 'limited',
    responseTime: '< 48 hours',
    languages: ['English'],
    caseStudies: [
      { title: 'De novo ASC development', result: '$3.2M annual EBITDA by year 3', client: 'New ASC partnership' },
      { title: '5-year growth plan', result: '4 providers → 14 providers', client: 'Growing ophthalmology practice' }
    ],
    packages: [
      { type: 'assessment', name: 'Strategic Assessment', price: 18000, description: 'Comprehensive growth opportunity analysis' },
      { type: 'implementation', name: 'Growth Roadmap', price: 65000, description: '12-month strategic implementation' },
      { type: 'ongoing', name: 'Board Advisory', price: 8500, description: 'Quarterly strategic advisory sessions' }
    ]
  }
];

export default CONSULTANTS;