// 8-Step Registration Wizard

export const REGISTRATION_STEPS = [
  { id: 'name', question: "What is your practice name?", type: 'text', placeholder: 'Enter practice name', icon: '🏥' },
  { id: 'type', question: "What type of practice?", type: 'select', options: ['Solo Practice', 'Small Group (2-5 providers)', 'Large Group (6+ providers)', 'PE-Backed Practice', 'Hospital-Based', 'Academic'], icon: '📋' },
  { id: 'specialty', question: "Primary specialty focus?", type: 'multiselect', options: ['Comprehensive Ophthalmology', 'Cataract/Anterior Segment', 'Retina', 'Glaucoma', 'Cornea/Refractive', 'Oculoplastics', 'Pediatrics', 'Neuro-Ophthalmology'], icon: '👁️' },
  { id: 'providers', question: "How many providers?", type: 'number', placeholder: 'Number of providers', icon: '👨‍⚕️' },
  { id: 'locations', question: "How many locations?", type: 'number', placeholder: 'Number of locations', icon: '📍' },
  { id: 'hasASC', question: "Do you have an ASC?", type: 'select', options: ['Yes - Owned', 'Yes - Shared/Partnership', 'No - Hospital Outpatient', 'No - External ASC'], icon: '🏥' },
  { id: 'ehr', question: "What EHR system?", type: 'select', options: ['NextGen', 'Modernizing Medicine (EMA)', 'Epic', 'Compulink', 'DrChrono', 'athenahealth', 'Other'], icon: '💻' },
  { id: 'package', question: "Which metric package?", type: 'select', options: ['Private Practice 9', 'PE Practice 10', 'KPI 25', 'Private ASC 25', 'PE ASC 21', 'Retina 12'], icon: '📊' }
];

export const KCN_KNOWLEDGE = {
  metrics: {
    'net collection rate': 'Net Collection Rate should be 98%+ for healthy practices. Below 95% indicates billing issues, coding problems, or payer contract issues. Calculate: (Payments Received / Allowed Amount) × 100.',
    'days in ar': 'Days in A/R benchmark is 32 days or less. Over 40 days indicates collection issues. Calculate: (Total A/R / Average Daily Charges).',
    'denial rate': 'Denial rate should be under 5%. High denials indicate pre-authorization issues, coding errors, or eligibility verification problems.',
    'first pass rate': 'First Pass Resolution should be 95%+. This measures claims paid on first submission without rework.',
    'ebitda': 'EBITDA Margin benchmark is 25% for private practices, 32% for PE-backed ASCs. Calculate: (Revenue - Operating Expenses) / Revenue.',
    'premium iol': 'Premium IOL adoption rate should be 30-45%. Higher rates indicate effective patient education and consultation processes.'
  },
  cpt: {
    'cataract': 'Cataract CPT: 66984 (Standard) = $535.42, 66982 (Complex) = $652.18. Complex coding requires documentation of zonular/capsular instability, small pupil, etc.',
    'injection': 'Intravitreal Injection CPT 67028: $95.67 Medicare rate. Average 8-12 injections per AMD patient per year.',
    'glaucoma': 'Glaucoma procedures: SLT (65855) = $245.67, Trabeculectomy (66170) = $985.45, iStent (66711) = $425.80 with cataract.'
  },
  innovations: {
    'light adjustable': 'Light Adjustable Lens (RxSight): 15% adoption rate. Allows post-op UV adjustment for precise refractive outcomes.',
    'faricimab': 'Faricimab (Vabysmo): Bispecific antibody targeting VEGF-A and Ang-2. Potential for extended dosing intervals in AMD/DME.',
    'istent': 'iStent Infinite: 3-stent standalone MIGS for glaucoma. 25% adoption rate. Can be performed without cataract surgery.'
  },
  competitors: {
    'competitor': 'Use the Competitors tab to analyze local practices. Compare ratings, services, and provider credentials.',
    'rating': 'Google ratings 4.5+ are competitive. Focus on review velocity (new reviews per month) and response to negative reviews.',
    'market share': 'Calculate market share: (Your Patient Volume / Total Market Volume) × 100. PE targets 35%+ market share.'
  },
  heatmap: {
    'profit index': 'Profit Index combines payer mix, reimbursement rates, and procedure conversion rates by ZIP code. 90+ = High profit potential.',
    'zip code': 'Target marketing to high-profit ZIP codes. Focus on 94104 (99), 94111 (98), 94115 (97) for best ROI.'
  }
};