// All 24 CPT Codes with 2025 Medicare Rates

export const CPT_CODES = [
  // Cataract
  { code: '66984', description: 'Cataract Surgery (Standard)', medicareRate: 535.42, category: 'Cataract', wRVU: 10.36, globalPeriod: 90 },
  { code: '66982', description: 'Cataract Surgery (Complex)', medicareRate: 652.18, category: 'Cataract', wRVU: 12.62, globalPeriod: 90 },
  { code: '66991', description: 'Complex Cataract Device Insertion', medicareRate: 125.45, category: 'Cataract', wRVU: 2.43, globalPeriod: 0 },
  
  // Retina
  { code: '67028', description: 'Intravitreal Injection', medicareRate: 95.67, category: 'Retina', wRVU: 1.80, globalPeriod: 0 },
  { code: '67210', description: 'Retinal Laser (PRP)', medicareRate: 285.45, category: 'Retina', wRVU: 5.52, globalPeriod: 10 },
  { code: '67228', description: 'Extensive Retinal Laser', medicareRate: 425.80, category: 'Retina', wRVU: 8.24, globalPeriod: 10 },
  { code: '67040', description: 'Vitrectomy (Posterior)', medicareRate: 1245.80, category: 'Retina', wRVU: 24.10, globalPeriod: 90 },
  { code: '67041', description: 'Vitrectomy for Retinal Detachment', medicareRate: 1385.25, category: 'Retina', wRVU: 26.80, globalPeriod: 90 },
  { code: '67108', description: 'Scleral Buckle', medicareRate: 1125.60, category: 'Retina', wRVU: 21.78, globalPeriod: 90 },
  { code: '67145', description: 'Prophylactic Retinal Laser', medicareRate: 245.90, category: 'Retina', wRVU: 4.76, globalPeriod: 10 },
  
  // Glaucoma
  { code: '65855', description: 'Trabeculoplasty (SLT/ALT)', medicareRate: 245.67, category: 'Glaucoma', wRVU: 4.75, globalPeriod: 10 },
  { code: '66170', description: 'Trabeculectomy', medicareRate: 985.45, category: 'Glaucoma', wRVU: 19.07, globalPeriod: 90 },
  { code: '66711', description: 'iStent Insert (with cataract)', medicareRate: 425.80, category: 'Glaucoma', wRVU: 8.24, globalPeriod: 0 },
  { code: '66183', description: 'Aqueous Shunt (Tube)', medicareRate: 1085.25, category: 'Glaucoma', wRVU: 21.00, globalPeriod: 90 },
  { code: '0671T', description: 'Endocyclophotocoagulation (ECP)', medicareRate: 385.45, category: 'Glaucoma', wRVU: 7.46, globalPeriod: 10 },
  { code: '0253T', description: 'XEN Gel Stent', medicareRate: 545.80, category: 'Glaucoma', wRVU: 10.56, globalPeriod: 90 },
  
  // Cornea/Refractive
  { code: '65756', description: 'DSAEK/DMEK', medicareRate: 1425.80, category: 'Cornea', wRVU: 27.60, globalPeriod: 90 },
  { code: '65710', description: 'PKP (Corneal Transplant)', medicareRate: 1285.45, category: 'Cornea', wRVU: 24.88, globalPeriod: 90 },
  { code: '65760', description: 'PTK (Phototherapeutic)', medicareRate: 485.25, category: 'Cornea', wRVU: 9.39, globalPeriod: 90 },
  
  // E&M / Diagnostic
  { code: '92014', description: 'Comprehensive Exam (Est)', medicareRate: 125.45, category: 'E&M', wRVU: 2.43, globalPeriod: 0 },
  { code: '92004', description: 'Comprehensive Exam (New)', medicareRate: 185.80, category: 'E&M', wRVU: 3.60, globalPeriod: 0 },
  { code: '92134', description: 'OCT Retina', medicareRate: 35.80, category: 'Diagnostic', wRVU: 0.69, globalPeriod: 0 },
  { code: '92133', description: 'OCT Optic Nerve', medicareRate: 35.80, category: 'Diagnostic', wRVU: 0.69, globalPeriod: 0 },
  { code: '92250', description: 'Fundus Photography', medicareRate: 28.45, category: 'Diagnostic', wRVU: 0.55, globalPeriod: 0 }
];