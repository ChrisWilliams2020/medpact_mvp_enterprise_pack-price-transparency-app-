// All 102 Metrics across 6 packages

export const PRACTICE_9_METRICS = [
  { key: 'collection_rate', title: 'Net Collection Rate', benchmark: 98, unit: '%', icon: '💰', description: 'Percentage of expected reimbursement collected' },
  { key: 'days_in_ar', title: 'Days in A/R', benchmark: 32, unit: 'days', icon: '📅', description: 'Average days to collect payment' },
  { key: 'denial_rate', title: 'Denial Rate', benchmark: 5, unit: '%', icon: '❌', description: 'Percentage of claims denied' },
  { key: 'first_pass_rate', title: 'First Pass Resolution', benchmark: 95, unit: '%', icon: '✅', description: 'Claims paid on first submission' },
  { key: 'charge_lag', title: 'Charge Lag', benchmark: 2, unit: 'days', icon: '⏱️', description: 'Days between service and charge entry' },
  { key: 'ar_over_90', title: 'A/R Over 90 Days', benchmark: 15, unit: '%', icon: '⚠️', description: 'Percentage of A/R over 90 days' },
  { key: 'patient_volume', title: 'Patient Volume', benchmark: 1200, unit: 'visits/mo', icon: '👥', description: 'Monthly patient visits' },
  { key: 'revenue_per_visit', title: 'Revenue per Visit', benchmark: 185, unit: 'USD', icon: '💵', description: 'Average revenue per patient encounter' },
  { key: 'bad_debt_rate', title: 'Bad Debt Rate', benchmark: 3, unit: '%', icon: '📉', description: 'Uncollectable patient balances' }
];

export const PE_10_METRICS = [
  { key: 'pe_revenue', title: 'Total Revenue', benchmark: 2500000, unit: 'USD', icon: '💰', description: 'Annual practice revenue' },
  { key: 'pe_ebitda_margin', title: 'EBITDA Margin', benchmark: 25, unit: '%', icon: '📊', description: 'Earnings before interest, taxes, depreciation' },
  { key: 'pe_revenue_per_provider', title: 'Revenue per Provider', benchmark: 625000, unit: 'USD', icon: '👨‍⚕️', description: 'Annual revenue per FTE provider' },
  { key: 'pe_patients_per_clinic_day', title: 'Patients per Clinic Day', benchmark: 28, unit: 'patients', icon: '📅', description: 'Average daily patient volume' },
  { key: 'pe_procedure_conversion', title: 'Procedure Conversion Rate', benchmark: 35, unit: '%', icon: '🔬', description: 'Exams converting to procedures' },
  { key: 'pe_net_collection_rate', title: 'Net Collection Rate', benchmark: 98, unit: '%', icon: '💵', description: 'Collected vs expected revenue' },
  { key: 'pe_days_in_ar', title: 'Days in A/R', benchmark: 32, unit: 'days', icon: '⏰', description: 'Average collection time' },
  { key: 'pe_staffing_ratio', title: 'Staffing Ratio', benchmark: 4.5, unit: 'staff:provider', icon: '👥', description: 'Support staff per provider' },
  { key: 'pe_cost_per_encounter', title: 'Cost per Encounter', benchmark: 85, unit: 'USD', icon: '📋', description: 'Direct cost per patient visit' },
  { key: 'pe_asc_utilization', title: 'ASC Utilization', benchmark: 78, unit: '%', icon: '🏥', description: 'Surgery center capacity used' }
];

export const KPI_25_METRICS = [
  { key: 'kpi_total_revenue', title: 'Total Revenue', benchmark: 15000000, unit: 'USD', icon: '💵', description: 'Annual gross revenue' },
  { key: 'kpi_ebitda', title: 'EBITDA', benchmark: 3750000, unit: 'USD', icon: '📈', description: 'Earnings before interest, taxes, depreciation, amortization' },
  { key: 'kpi_ebitda_margin', title: 'EBITDA Margin', benchmark: 25, unit: '%', icon: '📊', description: 'EBITDA as percentage of revenue' },
  { key: 'kpi_revenue_per_provider', title: 'Revenue per Provider', benchmark: 750000, unit: 'USD', icon: '👨‍⚕️', description: 'Revenue per FTE physician' },
  { key: 'kpi_ncr', title: 'Net Collection Rate', benchmark: 98, unit: '%', icon: '💵', description: 'Collected vs allowed amount' },
  { key: 'kpi_dar', title: 'Days in A/R', benchmark: 32, unit: 'days', icon: '📆', description: 'Average days to payment' },
  { key: 'kpi_denial_rate', title: 'Denial Rate', benchmark: 5, unit: '%', icon: '❌', description: 'Initial claim denial rate' },
  { key: 'kpi_first_pass', title: 'First Pass Rate', benchmark: 95, unit: '%', icon: '✅', description: 'Claims paid first submission' },
  { key: 'kpi_charge_lag', title: 'Charge Lag Days', benchmark: 2, unit: 'days', icon: '⏱️', description: 'Service to charge entry time' },
  { key: 'kpi_ar_over_90', title: 'A/R Over 90 Days', benchmark: 15, unit: '%', icon: '⚠️', description: 'Aged receivables percentage' },
  { key: 'kpi_ar_over_120', title: 'A/R Over 120 Days', benchmark: 8, unit: '%', icon: '🚨', description: 'Severely aged receivables' },
  { key: 'kpi_patient_volume', title: 'Monthly Patient Volume', benchmark: 4500, unit: 'visits', icon: '👥', description: 'Total monthly encounters' },
  { key: 'kpi_new_patient_rate', title: 'New Patient Rate', benchmark: 25, unit: '%', icon: '🆕', description: 'New vs established patients' },
  { key: 'kpi_no_show_rate', title: 'No-Show Rate', benchmark: 5, unit: '%', icon: '🚫', description: 'Missed appointments' },
  { key: 'kpi_cancellation_rate', title: 'Cancellation Rate', benchmark: 8, unit: '%', icon: '❎', description: 'Same-day cancellations' },
  { key: 'kpi_wait_time', title: 'Average Wait Time', benchmark: 15, unit: 'min', icon: '⏳', description: 'Patient wait in clinic' },
  { key: 'kpi_cycle_time', title: 'Cycle Time', benchmark: 45, unit: 'min', icon: '🔄', description: 'Check-in to check-out' },
  { key: 'kpi_referral_conversion', title: 'Referral Conversion', benchmark: 75, unit: '%', icon: '📞', description: 'Referrals becoming patients' },
  { key: 'kpi_procedure_conversion', title: 'Procedure Conversion', benchmark: 35, unit: '%', icon: '🔬', description: 'Exams to procedures' },
  { key: 'kpi_premium_iol_rate', title: 'Premium IOL Rate', benchmark: 30, unit: '%', icon: '💎', description: 'Premium lens selection' },
  { key: 'kpi_optical_capture', title: 'Optical Capture Rate', benchmark: 45, unit: '%', icon: '👓', description: 'Patients buying glasses' },
  { key: 'kpi_staff_turnover', title: 'Staff Turnover Rate', benchmark: 15, unit: '%', icon: '🔁', description: 'Annual staff turnover' },
  { key: 'kpi_provider_productivity', title: 'Provider Productivity', benchmark: 28, unit: 'patients/day', icon: '📈', description: 'Daily patient volume per provider' },
  { key: 'kpi_cost_per_encounter', title: 'Cost per Encounter', benchmark: 95, unit: 'USD', icon: '💰', description: 'Total cost per visit' },
  { key: 'kpi_patient_satisfaction', title: 'Patient Satisfaction', benchmark: 92, unit: '%', icon: '😊', description: 'Patient satisfaction score' }
];

export const ASC_25_METRICS = [
  { key: 'asc_cases_per_or', title: 'Cases per OR per Day', benchmark: 8, unit: 'cases', icon: '🔪', description: 'Surgical volume per room' },
  { key: 'asc_turnover_time', title: 'Room Turnover Time', benchmark: 12, unit: 'min', icon: '⏱️', description: 'Between-case preparation' },
  { key: 'asc_first_case_ontime', title: 'First Case On-Time Start', benchmark: 92, unit: '%', icon: '🎯', description: 'First surgery starting on time' },
  { key: 'asc_block_utilization', title: 'Block Utilization', benchmark: 85, unit: '%', icon: '📊', description: 'Scheduled block time used' },
  { key: 'asc_cancellation_rate', title: 'Day-of Cancellation Rate', benchmark: 3, unit: '%', icon: '❌', description: 'Same-day surgery cancellations' },
  { key: 'asc_cost_per_case', title: 'Total Cost per Case', benchmark: 850, unit: 'USD', icon: '💰', description: 'All-in cost per surgery' },
  { key: 'asc_supply_cost', title: 'Supply Cost per Case', benchmark: 285, unit: 'USD', icon: '📦', description: 'Consumables per surgery' },
  { key: 'asc_implant_cost', title: 'Implant Cost per Case', benchmark: 425, unit: 'USD', icon: '🔩', description: 'IOL/implant costs' },
  { key: 'asc_labor_cost', title: 'Labor Cost per Case', benchmark: 195, unit: 'USD', icon: '👥', description: 'Staff cost per surgery' },
  { key: 'asc_revenue_per_case', title: 'Revenue per Case', benchmark: 1650, unit: 'USD', icon: '💵', description: 'Average case revenue' },
  { key: 'asc_contribution_margin', title: 'Contribution Margin', benchmark: 48, unit: '%', icon: '📈', description: 'Revenue minus variable costs' },
  { key: 'asc_premium_iol_rate', title: 'Premium IOL Rate', benchmark: 35, unit: '%', icon: '💎', description: 'Premium lens adoption' },
  { key: 'asc_toric_rate', title: 'Toric IOL Rate', benchmark: 25, unit: '%', icon: '🎯', description: 'Astigmatism-correcting IOL use' },
  { key: 'asc_multifocal_rate', title: 'Multifocal IOL Rate', benchmark: 15, unit: '%', icon: '👁️', description: 'Presbyopia-correcting IOL use' },
  { key: 'asc_femto_rate', title: 'Femto Laser Rate', benchmark: 40, unit: '%', icon: '🔬', description: 'Femtosecond laser-assisted cataract' },
  { key: 'asc_infection_rate', title: 'Infection Rate', benchmark: 0.04, unit: '%', icon: '🦠', description: 'Endophthalmitis rate' },
  { key: 'asc_complication_rate', title: 'Complication Rate', benchmark: 1.5, unit: '%', icon: '⚠️', description: 'Surgical complications' },
  { key: 'asc_or_utilization', title: 'OR Utilization Rate', benchmark: 78, unit: '%', icon: '🏥', description: 'Operating room capacity used' },
  { key: 'asc_staff_ratio', title: 'Staff to OR Ratio', benchmark: 4.5, unit: 'staff:OR', icon: '👥', description: 'Staffing per operating room' },
  { key: 'asc_monthly_volume', title: 'Monthly Case Volume', benchmark: 350, unit: 'cases', icon: '📊', description: 'Total monthly surgeries' },
  { key: 'asc_pacu_time', title: 'PACU Time', benchmark: 35, unit: 'min', icon: '🛏️', description: 'Post-anesthesia recovery time' },
  { key: 'asc_total_encounter_time', title: 'Total Encounter Time', benchmark: 90, unit: 'min', icon: '⏰', description: 'Arrival to discharge' },
  { key: 'asc_patient_satisfaction', title: 'Patient Satisfaction', benchmark: 95, unit: '%', icon: '😊', description: 'Post-surgery satisfaction' },
  { key: 'asc_net_revenue', title: 'Net Revenue per Month', benchmark: 575000, unit: 'USD', icon: '💰', description: 'Monthly collected revenue' },
  { key: 'asc_ebitda_margin', title: 'EBITDA Margin', benchmark: 28, unit: '%', icon: '📈', description: 'ASC profitability' }
];

export const PE_ASC_21_METRICS = [
  { key: 'pe_asc_ebitda_margin', title: 'EBITDA Margin', benchmark: 32, unit: '%', icon: '📊', description: 'PE target profitability' },
  { key: 'pe_asc_ebitda_per_or', title: 'EBITDA per OR', benchmark: 850000, unit: 'USD', icon: '💰', description: 'Annual EBITDA per operating room' },
  { key: 'pe_asc_revenue_per_case', title: 'Revenue per Case', benchmark: 1850, unit: 'USD', icon: '💵', description: 'Average surgical revenue' },
  { key: 'pe_asc_cases_per_or', title: 'Cases per OR per Day', benchmark: 10, unit: 'cases', icon: '🔪', description: 'PE efficiency target' },
  { key: 'pe_asc_or_utilization', title: 'OR Utilization Rate', benchmark: 82, unit: '%', icon: '🏥', description: 'Capacity utilization target' },
  { key: 'pe_asc_turnover_time', title: 'Turnover Time', benchmark: 10, unit: 'min', icon: '⏱️', description: 'PE efficiency benchmark' },
  { key: 'pe_asc_first_case', title: 'First Case On-Time', benchmark: 95, unit: '%', icon: '🎯', description: 'Punctuality target' },
  { key: 'pe_asc_block_util', title: 'Block Utilization', benchmark: 88, unit: '%', icon: '📊', description: 'Scheduled time used' },
  { key: 'pe_asc_cost_per_case', title: 'Cost per Case', benchmark: 750, unit: 'USD', icon: '💰', description: 'PE cost target' },
  { key: 'pe_asc_supply_cost', title: 'Supply Cost %', benchmark: 18, unit: '%', icon: '📦', description: 'Supplies as % of revenue' },
  { key: 'pe_asc_labor_cost', title: 'Labor Cost %', benchmark: 22, unit: '%', icon: '👥', description: 'Labor as % of revenue' },
  { key: 'pe_asc_premium_rate', title: 'Premium IOL Rate', benchmark: 45, unit: '%', icon: '💎', description: 'PE premium adoption target' },
  { key: 'pe_asc_femto_rate', title: 'Femto Laser Rate', benchmark: 55, unit: '%', icon: '🔬', description: 'PE technology adoption' },
  { key: 'pe_asc_volume_growth', title: 'Volume Growth YoY', benchmark: 15, unit: '%', icon: '📈', description: 'Year-over-year case growth' },
  { key: 'pe_asc_revenue_growth', title: 'Revenue Growth YoY', benchmark: 20, unit: '%', icon: '💵', description: 'Year-over-year revenue growth' },
  { key: 'pe_asc_market_share', title: 'Market Share', benchmark: 35, unit: '%', icon: '🥧', description: 'Local market penetration' },
  { key: 'pe_asc_nps', title: 'Net Promoter Score', benchmark: 75, unit: 'score', icon: '📊', description: 'Patient loyalty metric' },
  { key: 'pe_asc_staff_retention', title: 'Staff Retention', benchmark: 90, unit: '%', icon: '👥', description: 'Annual staff retention' },
  { key: 'pe_asc_surgeon_satisfaction', title: 'Surgeon Satisfaction', benchmark: 92, unit: '%', icon: '👨‍⚕️', description: 'Surgeon experience score' },
  { key: 'pe_asc_quality_score', title: 'Quality Score', benchmark: 95, unit: '%', icon: '⭐', description: 'Composite quality metric' },
  { key: 'pe_asc_compliance', title: 'Compliance Score', benchmark: 98, unit: '%', icon: '✅', description: 'Regulatory compliance' }
];

export const RETINA_12_METRICS = [
  { key: 'retina_injection_volume', title: 'Monthly Injection Volume', benchmark: 450, unit: 'injections', icon: '💉', description: 'Monthly intravitreal injections' },
  { key: 'retina_drug_cost', title: 'Avg Drug Cost per Injection', benchmark: 1850, unit: 'USD', icon: '💊', description: 'Average anti-VEGF drug cost' },
  { key: 'retina_revenue_per_injection', title: 'Revenue per Injection', benchmark: 285, unit: 'USD', icon: '💵', description: 'Professional fee per injection' },
  { key: 'retina_retention_rate', title: 'Patient Retention Rate', benchmark: 85, unit: '%', icon: '🔄', description: 'Patients continuing treatment' },
  { key: 'retina_avg_injections', title: 'Avg Injections per Patient/Year', benchmark: 8.5, unit: 'injections', icon: '📊', description: 'Annual treatment frequency' },
  { key: 'retina_amd_volume', title: 'AMD Patient Volume', benchmark: 180, unit: 'patients', icon: '👁️', description: 'Wet AMD patients in treatment' },
  { key: 'retina_dme_volume', title: 'DME Patient Volume', benchmark: 120, unit: 'patients', icon: '🩺', description: 'Diabetic macular edema patients' },
  { key: 'retina_rvo_volume', title: 'RVO Patient Volume', benchmark: 65, unit: 'patients', icon: '🔴', description: 'Retinal vein occlusion patients' },
  { key: 'retina_switch_rate', title: 'Drug Switch Rate', benchmark: 12, unit: '%', icon: '🔀', description: 'Patients switching anti-VEGF' },
  { key: 'retina_surgery_volume', title: 'Monthly Surgery Volume', benchmark: 35, unit: 'surgeries', icon: '🔪', description: 'Vitreoretinal surgeries' },
  { key: 'retina_oct_volume', title: 'Monthly OCT Volume', benchmark: 650, unit: 'scans', icon: '📷', description: 'OCT imaging volume' },
  { key: 'retina_fa_volume', title: 'Monthly FA/ICG Volume', benchmark: 45, unit: 'studies', icon: '📸', description: 'Fluorescein angiography volume' }
];

export const METRIC_PACKAGES = {
  practice_9: { name: 'Private Practice 9', metrics: PRACTICE_9_METRICS, color: '#3B82F6', description: 'Essential metrics for private ophthalmology practices' },
  pe_10: { name: 'PE Practice 10', metrics: PE_10_METRICS, color: '#8B5CF6', description: 'Private equity performance metrics' },
  kpi_25: { name: 'KPI 25', metrics: KPI_25_METRICS, color: '#10B981', description: 'Comprehensive practice KPIs' },
  asc_25: { name: 'Private ASC 25', metrics: ASC_25_METRICS, color: '#F59E0B', description: 'Ambulatory surgery center metrics' },
  pe_asc_21: { name: 'PE ASC 21', metrics: PE_ASC_21_METRICS, color: '#EF4444', description: 'PE-backed ASC performance targets' },
  retina_12: { name: 'Retina 12', metrics: RETINA_12_METRICS, color: '#EC4899', description: 'Retina subspecialty metrics' }
};