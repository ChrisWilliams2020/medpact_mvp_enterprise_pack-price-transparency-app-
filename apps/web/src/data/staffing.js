// MedPact v3.4 - Staffing Intelligence Data

export const STAFF_ROLES = [
  { id: 'physician', name: 'Physician (MD/DO)', icon: '👨‍⚕️', category: 'Provider', clinical: true },
  { id: 'optometrist', name: 'Optometrist (OD)', icon: '👩‍⚕️', category: 'Provider', clinical: true },
  { id: 'pa', name: 'Physician Assistant', icon: '🩺', category: 'Provider', clinical: true },
  { id: 'np', name: 'Nurse Practitioner', icon: '🩺', category: 'Provider', clinical: true },
  { id: 'rn', name: 'Registered Nurse', icon: '👩‍⚕️', category: 'Clinical', clinical: true },
  { id: 'coa', name: 'Certified Ophthalmic Assistant', icon: '👁️', category: 'Clinical', clinical: true },
  { id: 'cot', name: 'Certified Ophthalmic Technician', icon: '👁️', category: 'Clinical', clinical: true },
  { id: 'comt', name: 'Certified Ophthalmic Medical Tech', icon: '👁️', category: 'Clinical', clinical: true },
  { id: 'ost', name: 'Ophthalmic Scribe', icon: '📝', category: 'Clinical', clinical: true },
  { id: 'optician', name: 'Licensed Optician', icon: '👓', category: 'Optical', clinical: false },
  { id: 'optical_tech', name: 'Optical Technician', icon: '👓', category: 'Optical', clinical: false },
  { id: 'front_desk', name: 'Front Desk/Reception', icon: '💼', category: 'Administrative', clinical: false },
  { id: 'scheduler', name: 'Scheduling Coordinator', icon: '📅', category: 'Administrative', clinical: false },
  { id: 'biller', name: 'Medical Biller', icon: '💰', category: 'Billing', clinical: false },
  { id: 'coder', name: 'Medical Coder', icon: '📋', category: 'Billing', clinical: false },
  { id: 'auth_spec', name: 'Authorization Specialist', icon: '✅', category: 'Billing', clinical: false },
  { id: 'office_mgr', name: 'Office Manager', icon: '👔', category: 'Management', clinical: false },
  { id: 'practice_admin', name: 'Practice Administrator', icon: '👔', category: 'Management', clinical: false },
  { id: 'clinical_mgr', name: 'Clinical Manager', icon: '👩‍💼', category: 'Management', clinical: true },
  { id: 'hr_mgr', name: 'HR Manager', icon: '👥', category: 'Management', clinical: false },
  { id: 'it_support', name: 'IT Support', icon: '💻', category: 'Support', clinical: false },
  { id: 'ma', name: 'Medical Assistant', icon: '🩺', category: 'Clinical', clinical: true }
];

export const SALARY_BENCHMARKS = {
  // Providers
  physician: { p25: 320000, p50: 425000, p75: 550000, p90: 720000 },
  optometrist: { p25: 115000, p50: 135000, p75: 165000, p90: 195000 },
  pa: { p25: 95000, p50: 115000, p75: 135000, p90: 155000 },
  np: { p25: 100000, p50: 120000, p75: 142000, p90: 165000 },
  
  // Clinical Staff
  rn: { p25: 62000, p50: 78000, p75: 92000, p90: 105000 },
  coa: { p25: 32000, p50: 38000, p75: 45000, p90: 52000 },
  cot: { p25: 38000, p50: 46000, p75: 55000, p90: 64000 },
  comt: { p25: 48000, p50: 58000, p75: 68000, p90: 78000 },
  ost: { p25: 28000, p50: 34000, p75: 40000, p90: 48000 },
  ma: { p25: 30000, p50: 36000, p75: 43000, p90: 50000 },
  
  // Optical
  optician: { p25: 38000, p50: 48000, p75: 58000, p90: 72000 },
  optical_tech: { p25: 28000, p50: 34000, p75: 42000, p90: 50000 },
  
  // Administrative
  front_desk: { p25: 28000, p50: 34000, p75: 40000, p90: 46000 },
  scheduler: { p25: 32000, p50: 38000, p75: 45000, p90: 52000 },
  
  // Billing
  biller: { p25: 36000, p50: 44000, p75: 54000, p90: 64000 },
  coder: { p25: 42000, p50: 52000, p75: 65000, p90: 78000 },
  auth_spec: { p25: 34000, p50: 42000, p75: 50000, p90: 58000 },
  
  // Management
  office_mgr: { p25: 48000, p50: 62000, p75: 78000, p90: 95000 },
  practice_admin: { p25: 85000, p50: 110000, p75: 140000, p90: 175000 },
  clinical_mgr: { p25: 58000, p50: 72000, p75: 88000, p90: 105000 },
  hr_mgr: { p25: 55000, p50: 68000, p75: 85000, p90: 102000 },
  
  // Support
  it_support: { p25: 45000, p50: 58000, p75: 72000, p90: 88000 }
};

export const TURNOVER_BENCHMARKS = {
  provider: { benchmark: 8, low: 5, high: 12 },
  clinical: { benchmark: 18, low: 12, high: 25 },
  administrative: { benchmark: 22, low: 15, high: 30 },
  billing: { benchmark: 20, low: 14, high: 28 },
  optical: { benchmark: 16, low: 10, high: 22 },
  management: { benchmark: 10, low: 6, high: 15 }
};

export const SURVEY_TEMPLATES = {
  engagement: {
    id: 'engagement',
    name: '📊 Employee Engagement',
    description: 'Measure overall employee satisfaction and engagement levels',
    frequency: 'Quarterly',
    anonymous: true,
    estimatedTime: '10 minutes',
    questions: [
      { id: 'e1', text: 'I feel valued as an employee at this practice', type: 'scale', scale: 10 },
      { id: 'e2', text: 'I have the tools and resources I need to do my job well', type: 'scale', scale: 10 },
      { id: 'e3', text: 'I receive regular feedback on my performance', type: 'scale', scale: 10 },
      { id: 'e4', text: 'I see opportunities for growth and advancement here', type: 'scale', scale: 10 },
      { id: 'e5', text: 'My workload is manageable', type: 'scale', scale: 10 },
      { id: 'e6', text: 'I feel comfortable sharing ideas with leadership', type: 'scale', scale: 10 },
      { id: 'e7', text: 'The practice lives up to its stated values', type: 'scale', scale: 10 },
      { id: 'e8', text: 'I would recommend this workplace to a friend', type: 'scale', scale: 10 },
      { id: 'e9', text: 'What do you enjoy most about working here?', type: 'text' },
      { id: 'e10', text: 'What one change would most improve your experience?', type: 'text' }
    ]
  },
  satisfaction: {
    id: 'satisfaction',
    name: '😊 Job Satisfaction',
    description: 'Assess satisfaction with specific job aspects',
    frequency: 'Semi-annual',
    anonymous: true,
    estimatedTime: '8 minutes',
    questions: [
      { id: 's1', text: 'How satisfied are you with your compensation?', type: 'scale', scale: 10 },
      { id: 's2', text: 'How satisfied are you with your benefits package?', type: 'scale', scale: 10 },
      { id: 's3', text: 'How satisfied are you with your work schedule?', type: 'scale', scale: 10 },
      { id: 's4', text: 'How satisfied are you with your work environment?', type: 'scale', scale: 10 },
      { id: 's5', text: 'How satisfied are you with your relationship with your manager?', type: 'scale', scale: 10 },
      { id: 's6', text: 'How satisfied are you with team collaboration?', type: 'scale', scale: 10 },
      { id: 's7', text: 'How satisfied are you with training opportunities?', type: 'scale', scale: 10 },
      { id: 's8', text: 'What benefits would you like to see added or improved?', type: 'text' }
    ]
  },
  pulse: {
    id: 'pulse',
    name: '⚡ Quick Pulse Check',
    description: 'Brief weekly check-in on team morale',
    frequency: 'Weekly',
    anonymous: true,
    estimatedTime: '2 minutes',
    questions: [
      { id: 'p1', text: 'How are you feeling about work this week?', type: 'emoji', options: ['😫', '😕', '😐', '🙂', '😄'] },
      { id: 'p2', text: 'Do you have any blockers or concerns?', type: 'select', options: [
        { value: 'none', label: 'No blockers' },
        { value: 'workload', label: 'Workload issues' },
        { value: 'resources', label: 'Need resources/tools' },
        { value: 'communication', label: 'Communication issues' },
        { value: 'other', label: 'Other concerns' }
      ]},
      { id: 'p3', text: 'Anything else you\'d like to share?', type: 'text' }
    ]
  },
  onboarding: {
    id: 'onboarding',
    name: '🎯 Onboarding Feedback',
    description: 'New hire experience assessment (30/60/90 days)',
    frequency: 'Milestone-based',
    anonymous: false,
    estimatedTime: '12 minutes',
    questions: [
      { id: 'o1', text: 'How would you rate your onboarding experience overall?', type: 'scale', scale: 10 },
      { id: 'o2', text: 'Did you receive adequate training for your role?', type: 'scale', scale: 10 },
      { id: 'o3', text: 'Was your equipment/workspace ready on day one?', type: 'scale', scale: 10 },
      { id: 'o4', text: 'Do you have a clear understanding of your responsibilities?', type: 'scale', scale: 10 },
      { id: 'o5', text: 'Have you felt welcomed by your team?', type: 'scale', scale: 10 },
      { id: 'o6', text: 'Is this role what you expected based on the interview?', type: 'scale', scale: 10 },
      { id: 'o7', text: 'What could we improve about the onboarding process?', type: 'text' },
      { id: 'o8', text: 'What additional training would be helpful?', type: 'text' }
    ]
  },
  exit: {
    id: 'exit',
    name: '👋 Exit Interview',
    description: 'Gather insights from departing employees',
    frequency: 'At departure',
    anonymous: false,
    estimatedTime: '15 minutes',
    questions: [
      { id: 'x1', text: 'What is your primary reason for leaving?', type: 'select', options: [
        { value: 'compensation', label: 'Better compensation elsewhere' },
        { value: 'growth', label: 'Career growth opportunity' },
        { value: 'management', label: 'Management/leadership issues' },
        { value: 'culture', label: 'Culture fit' },
        { value: 'workload', label: 'Workload/stress' },
        { value: 'relocation', label: 'Relocation' },
        { value: 'personal', label: 'Personal reasons' },
        { value: 'other', label: 'Other' }
      ]},
      { id: 'x2', text: 'How would you rate your overall experience here?', type: 'scale', scale: 10 },
      { id: 'x3', text: 'Would you consider returning to this practice in the future?', type: 'select', options: [
        { value: 'yes', label: 'Yes, definitely' },
        { value: 'maybe', label: 'Maybe, under right circumstances' },
        { value: 'no', label: 'No' }
      ]},
      { id: 'x4', text: 'Did you feel valued during your time here?', type: 'scale', scale: 10 },
      { id: 'x5', text: 'Was management receptive to feedback?', type: 'scale', scale: 10 },
      { id: 'x6', text: 'What could we have done to keep you?', type: 'text' },
      { id: 'x7', text: 'What advice would you give to improve the workplace?', type: 'text' }
    ]
  },
  manager360: {
    id: 'manager360',
    name: '🔄 Manager 360 Review',
    description: 'Multi-rater feedback for managers and supervisors',
    frequency: 'Annual',
    anonymous: true,
    estimatedTime: '15 minutes',
    questions: [
      { id: 'm1', text: 'This manager communicates expectations clearly', type: 'scale', scale: 10 },
      { id: 'm2', text: 'This manager provides constructive feedback', type: 'scale', scale: 10 },
      { id: 'm3', text: 'This manager treats team members fairly', type: 'scale', scale: 10 },
      { id: 'm4', text: 'This manager supports professional development', type: 'scale', scale: 10 },
      { id: 'm5', text: 'This manager handles conflicts effectively', type: 'scale', scale: 10 },
      { id: 'm6', text: 'This manager leads by example', type: 'scale', scale: 10 },
      { id: 'm7', text: 'This manager is approachable and accessible', type: 'scale', scale: 10 },
      { id: 'm8', text: 'What does this manager do well?', type: 'text' },
      { id: 'm9', text: 'What could this manager improve?', type: 'text' }
    ]
  }
};

export const DEMO_STAFF = [
  { id: 1, name: 'Dr. Sarah Chen', email: 'schen@premiereyepa.com', role: 'physician', department: 'Retina', salary: 485000, hireDate: '2019-03-15', status: 'active' },
  { id: 2, name: 'Dr. Michael Roberts', email: 'mroberts@premiereyepa.com', role: 'physician', department: 'Comprehensive', salary: 395000, hireDate: '2020-08-01', status: 'active' },
  { id: 3, name: 'Dr. Emily Walsh', email: 'ewalsh@premiereyepa.com', role: 'physician', department: 'Glaucoma', salary: 420000, hireDate: '2018-01-10', status: 'active' },
  { id: 4, name: 'Dr. Jennifer Liu', email: 'jliu@premiereyepa.com', role: 'optometrist', department: 'Primary Care', salary: 145000, hireDate: '2021-06-15', status: 'active' },
  { id: 5, name: 'Dr. David Park', email: 'dpark@premiereyepa.com', role: 'optometrist', department: 'Contact Lens', salary: 138000, hireDate: '2022-02-01', status: 'active' },
  { id: 6, name: 'Amanda Foster', email: 'afoster@premiereyepa.com', role: 'practice_admin', department: 'Administration', salary: 125000, hireDate: '2017-05-20', status: 'active' },
  { id: 7, name: 'Marcus Johnson', email: 'mjohnson@premiereyepa.com', role: 'office_mgr', department: 'Front Office', salary: 68000, hireDate: '2020-03-10', status: 'active' },
  { id: 8, name: 'Lisa Nguyen', email: 'lnguyen@premiereyepa.com', role: 'clinical_mgr', department: 'Clinical', salary: 78000, hireDate: '2019-11-01', status: 'active' },
  { id: 9, name: 'Robert Williams', email: 'rwilliams@premiereyepa.com', role: 'comt', department: 'Clinical', salary: 62000, hireDate: '2018-09-15', status: 'active' },
  { id: 10, name: 'Jessica Martinez', email: 'jmartinez@premiereyepa.com', role: 'cot', department: 'Clinical', salary: 48000, hireDate: '2021-04-01', status: 'active' },
  { id: 11, name: 'Kevin Thompson', email: 'kthompson@premiereyepa.com', role: 'coa', department: 'Clinical', salary: 42000, hireDate: '2022-08-15', status: 'active' },
  { id: 12, name: 'Michelle Brown', email: 'mbrown@premiereyepa.com', role: 'coa', department: 'Clinical', salary: 40000, hireDate: '2023-01-10', status: 'active' },
  { id: 13, name: 'Stephanie Davis', email: 'sdavis@premiereyepa.com', role: 'optician', department: 'Optical', salary: 52000, hireDate: '2019-06-01', status: 'active' },
  { id: 14, name: 'Brian Wilson', email: 'bwilson@premiereyepa.com', role: 'optician', department: 'Optical', salary: 48000, hireDate: '2021-02-15', status: 'active' },
  { id: 15, name: 'Nicole Garcia', email: 'ngarcia@premiereyepa.com', role: 'biller', department: 'Billing', salary: 48000, hireDate: '2020-10-01', status: 'active' },
  { id: 16, name: 'Christopher Lee', email: 'clee@premiereyepa.com', role: 'coder', department: 'Billing', salary: 58000, hireDate: '2019-04-15', status: 'active' },
  { id: 17, name: 'Ashley Taylor', email: 'ataylor@premiereyepa.com', role: 'front_desk', department: 'Front Office', salary: 36000, hireDate: '2022-05-01', status: 'active' },
  { id: 18, name: 'Ryan Anderson', email: 'randerson@premiereyepa.com', role: 'scheduler', department: 'Front Office', salary: 40000, hireDate: '2021-09-01', status: 'active' },
  { id: 19, name: 'Samantha Moore', email: 'smoore@premiereyepa.com', role: 'auth_spec', department: 'Billing', salary: 44000, hireDate: '2020-07-15', status: 'active' },
  { id: 20, name: 'Daniel White', email: 'dwhite@premiereyepa.com', role: 'it_support', department: 'IT', salary: 62000, hireDate: '2021-11-01', status: 'active' }
];

export const SURVEY_DELIVERY_METHODS = [
  { id: 'email', name: '📧 Email', description: 'Send survey link via email' },
  { id: 'sms', name: '📱 SMS/Text', description: 'Send survey link via text message' },
  { id: 'both', name: '📧📱 Email + SMS', description: 'Send via both channels' },
  { id: 'slack', name: '💬 Slack', description: 'Send via Slack integration' },
  { id: 'teams', name: '👥 MS Teams', description: 'Send via Microsoft Teams' }
];

export default { STAFF_ROLES, SALARY_BENCHMARKS, TURNOVER_BENCHMARKS, SURVEY_TEMPLATES, DEMO_STAFF, SURVEY_DELIVERY_METHODS };