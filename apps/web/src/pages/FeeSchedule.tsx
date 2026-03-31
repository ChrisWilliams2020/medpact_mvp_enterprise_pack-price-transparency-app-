import React, { useState, useEffect } from 'react';

interface CPTCode {
  code: string;
  description: string;
  category: string;
  medicareRate: number;
  medicaidRate: number;
  commercialRateLow: number;
  commercialRateHigh: number;
  nationalAverage: number;
  rvu: number;
  facilityRate: number;
  nonFacilityRate: number;
}

// Common eyecare CPT codes with 2024 rates
const CPT_CODES: CPTCode[] = [
  // Eye Exams
  { code: '92002', description: 'Eye exam, new patient, intermediate', category: 'Eye Exams', medicareRate: 72.50, medicaidRate: 58.00, commercialRateLow: 85.00, commercialRateHigh: 150.00, nationalAverage: 115.00, rvu: 1.50, facilityRate: 52.00, nonFacilityRate: 72.50 },
  { code: '92004', description: 'Eye exam, new patient, comprehensive', category: 'Eye Exams', medicareRate: 145.00, medicaidRate: 116.00, commercialRateLow: 175.00, commercialRateHigh: 275.00, nationalAverage: 220.00, rvu: 3.00, facilityRate: 105.00, nonFacilityRate: 145.00 },
  { code: '92012', description: 'Eye exam, established patient, intermediate', category: 'Eye Exams', medicareRate: 62.00, medicaidRate: 49.60, commercialRateLow: 75.00, commercialRateHigh: 125.00, nationalAverage: 95.00, rvu: 1.28, facilityRate: 45.00, nonFacilityRate: 62.00 },
  { code: '92014', description: 'Eye exam, established patient, comprehensive', category: 'Eye Exams', medicareRate: 108.00, medicaidRate: 86.40, commercialRateLow: 130.00, commercialRateHigh: 200.00, nationalAverage: 165.00, rvu: 2.24, facilityRate: 78.00, nonFacilityRate: 108.00 },
  
  // Refraction
  { code: '92015', description: 'Refraction', category: 'Refraction', medicareRate: 0, medicaidRate: 35.00, commercialRateLow: 35.00, commercialRateHigh: 75.00, nationalAverage: 50.00, rvu: 0.52, facilityRate: 0, nonFacilityRate: 46.00 },
  
  // Contact Lens Services
  { code: '92310', description: 'Contact lens fitting, corneal lens', category: 'Contact Lens', medicareRate: 68.00, medicaidRate: 54.40, commercialRateLow: 85.00, commercialRateHigh: 150.00, nationalAverage: 115.00, rvu: 1.41, facilityRate: 49.00, nonFacilityRate: 68.00 },
  { code: '92313', description: 'Contact lens fitting, corneoscleral', category: 'Contact Lens', medicareRate: 95.00, medicaidRate: 76.00, commercialRateLow: 115.00, commercialRateHigh: 200.00, nationalAverage: 155.00, rvu: 1.97, facilityRate: 69.00, nonFacilityRate: 95.00 },
  { code: '92314', description: 'Contact lens fitting, scleral', category: 'Contact Lens', medicareRate: 95.00, medicaidRate: 76.00, commercialRateLow: 115.00, commercialRateHigh: 200.00, nationalAverage: 155.00, rvu: 1.97, facilityRate: 69.00, nonFacilityRate: 95.00 },
  
  // Diagnostic Testing
  { code: '92083', description: 'Visual field exam, extended', category: 'Diagnostic', medicareRate: 55.00, medicaidRate: 44.00, commercialRateLow: 65.00, commercialRateHigh: 110.00, nationalAverage: 85.00, rvu: 1.14, facilityRate: 40.00, nonFacilityRate: 55.00 },
  { code: '92133', description: 'OCT, optic nerve', category: 'Diagnostic', medicareRate: 45.00, medicaidRate: 36.00, commercialRateLow: 55.00, commercialRateHigh: 95.00, nationalAverage: 72.00, rvu: 0.93, facilityRate: 33.00, nonFacilityRate: 45.00 },
  { code: '92134', description: 'OCT, retina', category: 'Diagnostic', medicareRate: 45.00, medicaidRate: 36.00, commercialRateLow: 55.00, commercialRateHigh: 95.00, nationalAverage: 72.00, rvu: 0.93, facilityRate: 33.00, nonFacilityRate: 45.00 },
  { code: '92250', description: 'Fundus photography', category: 'Diagnostic', medicareRate: 35.00, medicaidRate: 28.00, commercialRateLow: 45.00, commercialRateHigh: 75.00, nationalAverage: 58.00, rvu: 0.73, facilityRate: 25.00, nonFacilityRate: 35.00 },
  
  // Procedures
  { code: '65205', description: 'Foreign body removal, external eye', category: 'Procedures', medicareRate: 58.00, medicaidRate: 46.40, commercialRateLow: 70.00, commercialRateHigh: 120.00, nationalAverage: 92.00, rvu: 1.20, facilityRate: 42.00, nonFacilityRate: 58.00 },
  { code: '68761', description: 'Punctal plug insertion', category: 'Procedures', medicareRate: 88.00, medicaidRate: 70.40, commercialRateLow: 105.00, commercialRateHigh: 175.00, nationalAverage: 138.00, rvu: 1.82, facilityRate: 64.00, nonFacilityRate: 88.00 },
  { code: '67028', description: 'Intravitreal injection', category: 'Procedures', medicareRate: 108.00, medicaidRate: 86.40, commercialRateLow: 130.00, commercialRateHigh: 200.00, nationalAverage: 165.00, rvu: 2.24, facilityRate: 78.00, nonFacilityRate: 108.00 },
  
  // E/M Codes (Medical)
  { code: '99213', description: 'Office visit, established, level 3', category: 'E/M', medicareRate: 92.00, medicaidRate: 73.60, commercialRateLow: 110.00, commercialRateHigh: 175.00, nationalAverage: 140.00, rvu: 1.30, facilityRate: 67.00, nonFacilityRate: 92.00 },
  { code: '99214', description: 'Office visit, established, level 4', category: 'E/M', medicareRate: 130.00, medicaidRate: 104.00, commercialRateLow: 155.00, commercialRateHigh: 240.00, nationalAverage: 195.00, rvu: 1.92, facilityRate: 94.00, nonFacilityRate: 130.00 },
  { code: '99215', description: 'Office visit, established, level 5', category: 'E/M', medicareRate: 175.00, medicaidRate: 140.00, commercialRateLow: 210.00, commercialRateHigh: 325.00, nationalAverage: 265.00, rvu: 2.80, facilityRate: 127.00, nonFacilityRate: 175.00 },
];

export default function FeeSchedule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof CPTCode>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCode, setSelectedCode] = useState<CPTCode | null>(null);

  const categories = ['all', ...new Set(CPT_CODES.map(c => c.category))];

  const filteredCodes = CPT_CODES
    .filter(code => {
      const matchesSearch = 
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || code.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });

  const handleSort = (field: keyof CPTCode) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '—';
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CPT Fee Schedule</h1>
              <p className="text-gray-600">Medicare, Medicaid & Commercial Rates (2024)</p>
            </div>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search CPT code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredCodes.length} of {CPT_CODES.length} codes
            </div>
          </div>
        </div>

        {/* Rate Legend */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Medicare (2024 Fee Schedule)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Medicaid (~80% of Medicare)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span>Commercial (Range)</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('code')}
                  >
                    CPT Code {sortField === 'code' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('description')}
                  >
                    Description
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('medicareRate')}
                  >
                    Medicare {sortField === 'medicareRate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('medicaidRate')}
                  >
                    Medicaid
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Commercial Range
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('nationalAverage')}
                  >
                    Avg {sortField === 'nationalAverage' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCodes.map((code) => (
                  <tr key={code.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-blue-600">{code.code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm text-gray-900">{code.description}</div>
                        <div className="text-xs text-gray-500">{code.category}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${code.medicareRate > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                        {formatCurrency(code.medicareRate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium text-green-600">
                        {formatCurrency(code.medicaidRate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium text-purple-600">
                        {formatCurrency(code.commercialRateLow)} - {formatCurrency(code.commercialRateHigh)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(code.nationalAverage)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedCode(code)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
          <strong>Note:</strong> Rates shown are national averages and may vary by geographic location (GPCI). 
          Medicare rates are based on the 2024 Physician Fee Schedule. Commercial rates vary by payer contract. 
          Refraction (92015) is not covered by Medicare but may be covered by some commercial plans.
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    CPT {selectedCode.code}
                  </h2>
                  <p className="text-gray-600">{selectedCode.description}</p>
                </div>
                <button
                  onClick={() => setSelectedCode(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Medicare Rate</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency(selectedCode.medicareRate)}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    Facility: {formatCurrency(selectedCode.facilityRate)} | 
                    Non-Facility: {formatCurrency(selectedCode.nonFacilityRate)}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Medicaid Rate</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(selectedCode.medicaidRate)}
                  </div>
                  <div className="text-xs text-green-500 mt-1">
                    ~80% of Medicare
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-purple-600 font-medium">Commercial Range</div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-lg font-bold text-purple-700">
                      {formatCurrency(selectedCode.commercialRateLow)} - {formatCurrency(selectedCode.commercialRateHigh)}
                    </div>
                    <div className="text-xs text-purple-500">
                      National Average: {formatCurrency(selectedCode.nationalAverage)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-purple-200 rounded-full relative">
                      <div 
                        className="absolute h-2 bg-purple-500 rounded-full"
                        style={{
                          left: '0%',
                          width: `${((selectedCode.nationalAverage - selectedCode.commercialRateLow) / 
                                    (selectedCode.commercialRateHigh - selectedCode.commercialRateLow)) * 100}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-purple-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500">RVU</div>
                  <div className="text-lg font-semibold">{selectedCode.rvu}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Category</div>
                  <div className="text-lg font-semibold">{selectedCode.category}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Your Rate</div>
                  <div className="text-lg font-semibold text-blue-600">Configure →</div>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://www.cms.gov/medicare/payment/fee-schedules/physician/search?hcpcs=${selectedCode.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  View on CMS.gov
                </a>
                <button
                  onClick={() => setSelectedCode(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}