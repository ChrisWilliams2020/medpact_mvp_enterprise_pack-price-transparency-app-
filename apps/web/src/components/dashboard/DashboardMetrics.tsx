interface DashboardMetricsProps {
  view: string;
}

export default function DashboardMetrics({ view }: DashboardMetricsProps) {
  const metricsData: Record<string, { title: string; source: string; metrics: Array<{ id: number; name: string; value: string; benchmark: string; status: string; description: string }> }> = {
    'private-practice': {
      title: "Private Practice 9 Key Metrics",
      source: "OSN Lecture - Richard Linstrom, MD & John Pinto",
      metrics: [
        { id: 1, name: "Revenue per Physician FTE", value: "$847,500", benchmark: "$750K-$1M", status: "good", description: "Total collections divided by physician FTEs" },
        { id: 2, name: "Operating Cost Ratio", value: "58%", benchmark: "Under 60%", status: "good", description: "Total operating costs as % of collections" },
        { id: 3, name: "Staff Cost per Physician", value: "$185,000", benchmark: "Under $200K", status: "good", description: "Total staff compensation per physician FTE" },
        { id: 4, name: "Patients per Day per MD", value: "28", benchmark: "25-35", status: "good", description: "Average patient encounters per physician per day" },
        { id: 5, name: "New Patient Ratio", value: "32%", benchmark: "25-40%", status: "good", description: "New patients as percentage of total visits" },
        { id: 6, name: "A/R Days Outstanding", value: "34", benchmark: "Under 45 days", status: "good", description: "Average days to collect payment" },
        { id: 7, name: "Collection Rate", value: "97.2%", benchmark: "Over 95%", status: "good", description: "Percentage of charges collected" },
        { id: 8, name: "Surgical Conversion Rate", value: "68%", benchmark: "Over 60%", status: "good", description: "Surgical consults resulting in surgery" },
        { id: 9, name: "Net Income per Physician", value: "$425,000", benchmark: "$350K-$600K", status: "good", description: "Net income after all expenses per physician" },
      ]
    },
    'pe-practice': {
      title: "PE Practice 10 Core Metrics + 25 KPIs",
      source: "Private Equity Ophthalmology Standards",
      metrics: [
        { id: 1, name: "EBITDA", value: "$1.2M", benchmark: "Over 15% margin", status: "good", description: "Earnings before interest, taxes, depreciation, amortization" },
        { id: 2, name: "EBITDA Margin", value: "18.5%", benchmark: "15-25%", status: "good", description: "EBITDA as percentage of revenue" },
        { id: 3, name: "Revenue Growth YoY", value: "12%", benchmark: "Over 8%", status: "good", description: "Year-over-year revenue growth" },
        { id: 4, name: "Patient Volume Growth", value: "8%", benchmark: "Over 5%", status: "good", description: "Year-over-year patient volume increase" },
        { id: 5, name: "Provider Productivity", value: "$892K", benchmark: "Over $800K", status: "good", description: "Revenue per provider FTE" },
        { id: 6, name: "Ancillary Capture Rate", value: "72%", benchmark: "Over 65%", status: "good", description: "In-house ancillary service utilization" },
        { id: 7, name: "Optical Capture Rate", value: "58%", benchmark: "Over 50%", status: "good", description: "Patients purchasing optical in-house" },
        { id: 8, name: "Payor Mix - Commercial", value: "42%", benchmark: "35-50%", status: "good", description: "Commercial insurance percentage" },
        { id: 9, name: "Staff Turnover Rate", value: "15%", benchmark: "Under 20%", status: "good", description: "Annual staff turnover percentage" },
        { id: 10, name: "Patient Satisfaction (NPS)", value: "72", benchmark: "Over 50", status: "good", description: "Net Promoter Score" },
        { id: 11, name: "Days in A/R", value: "32", benchmark: "Under 40", status: "good", description: "Average collection days" },
        { id: 12, name: "Clean Claim Rate", value: "96%", benchmark: "Over 95%", status: "good", description: "Claims submitted without errors" },
        { id: 13, name: "Denial Rate", value: "4.2%", benchmark: "Under 5%", status: "good", description: "Percentage of claims denied" },
        { id: 14, name: "Cost per Patient Visit", value: "$142", benchmark: "Under $160", status: "good", description: "Operating cost per encounter" },
        { id: 15, name: "Revenue per Patient Visit", value: "$285", benchmark: "Over $250", status: "good", description: "Average revenue per encounter" },
      ]
    },
    'private-asc': {
      title: "Private ASC Metrics",
      source: "OOSS - Outpatient Ophthalmic Surgery Society",
      metrics: [
        { id: 1, name: "Cases per OR per Day", value: "12.5", benchmark: "10-15", status: "good", description: "Surgical volume efficiency" },
        { id: 2, name: "Revenue per Case", value: "$2,850", benchmark: "$2.5K-$3.5K", status: "good", description: "Average facility fee per case" },
        { id: 3, name: "Cost per Case", value: "$1,425", benchmark: "Under $1,600", status: "good", description: "Total cost including supplies, staff" },
        { id: 4, name: "Contribution Margin", value: "50%", benchmark: "Over 45%", status: "good", description: "Revenue minus variable costs" },
        { id: 5, name: "Turnover Time (mins)", value: "8", benchmark: "Under 12", status: "good", description: "Room turnover between cases" },
        { id: 6, name: "Case Cancellation Rate", value: "3.2%", benchmark: "Under 5%", status: "good", description: "Same-day cancellations" },
        { id: 7, name: "On-Time Start Rate", value: "94%", benchmark: "Over 90%", status: "good", description: "Cases starting on schedule" },
        { id: 8, name: "Supply Cost per Case", value: "$485", benchmark: "Under $550", status: "good", description: "Average supplies per procedure" },
      ]
    },
    'pe-asc': {
      title: "PE ASC Metrics",
      source: "OOSS - Private Equity ASC Standards",
      metrics: [
        { id: 1, name: "EBITDA per OR", value: "$1.8M", benchmark: "Over $1.5M", status: "good", description: "Profitability per operating room" },
        { id: 2, name: "Case Volume Growth", value: "15%", benchmark: "Over 10%", status: "good", description: "Year-over-year case growth" },
        { id: 3, name: "Physician Utilization", value: "82%", benchmark: "Over 75%", status: "good", description: "Block time utilization" },
        { id: 4, name: "Revenue per FTE", value: "$425K", benchmark: "Over $350K", status: "good", description: "Revenue per full-time employee" },
        { id: 5, name: "IOL Upgrade Rate", value: "42%", benchmark: "Over 35%", status: "good", description: "Premium IOL selection rate" },
        { id: 6, name: "Net Revenue per Case", value: "$1,850", benchmark: "Over $1,500", status: "good", description: "After payer adjustments" },
        { id: 7, name: "Staff Cost Ratio", value: "28%", benchmark: "Under 32%", status: "good", description: "Staff cost as % of revenue" },
        { id: 8, name: "Physician Recruitment", value: "3", benchmark: "2+ per year", status: "good", description: "New surgeons added annually" },
      ]
    },
    'retina': {
      title: "Retina Practice 12 Key Metrics",
      source: "ASRS Practice Management Guidelines",
      metrics: [
        { id: 1, name: "Injection Volume/Month", value: "1,250", benchmark: "Over 1,000", status: "good", description: "Monthly intravitreal injection count" },
        { id: 2, name: "Revenue per Injection", value: "$485", benchmark: "$400-$550", status: "good", description: "Professional + drug margin" },
        { id: 3, name: "Drug Cost % of Revenue", value: "42%", benchmark: "Under 50%", status: "good", description: "Anti-VEGF cost as % of injection revenue" },
        { id: 4, name: "Patient Retention Rate", value: "94%", benchmark: "Over 90%", status: "good", description: "Patients continuing treatment" },
        { id: 5, name: "New Consults/Month", value: "85", benchmark: "60-120", status: "good", description: "New retina referrals" },
        { id: 6, name: "Surgical Case Mix", value: "18%", benchmark: "15-25%", status: "good", description: "Surgical vs injection ratio" },
        { id: 7, name: "Avg Injections per Patient/Year", value: "7.2", benchmark: "6-8", status: "good", description: "Treatment frequency" },
        { id: 8, name: "Imaging Revenue/Patient", value: "$245", benchmark: "Over $200", status: "good", description: "OCT, photos, angiography" },
        { id: 9, name: "Referral Conversion Rate", value: "78%", benchmark: "Over 70%", status: "good", description: "Referrals becoming patients" },
        { id: 10, name: "No-Show Rate", value: "8%", benchmark: "Under 10%", status: "good", description: "Missed appointments" },
        { id: 11, name: "Provider Efficiency", value: "22", benchmark: "18-25", status: "good", description: "Patients seen per provider/day" },
        { id: 12, name: "Revenue per Provider", value: "$1.1M", benchmark: "Over $900K", status: "good", description: "Annual revenue per retina specialist" },
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const data = metricsData[view];
  if (!data) return <div className="p-6 text-gray-500">Select a metrics view</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold text-gray-900">{data.title}</h3>
        <p className="text-xs text-gray-500 mt-1">Source: {data.source}</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.metrics.map((metric) => (
            <div key={metric.id} className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}>
              <div className="flex items-start justify-between">
                <div className="text-xs font-medium text-gray-500">#{metric.id}</div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-white border">{metric.benchmark}</div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm font-medium mt-1">{metric.name}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}