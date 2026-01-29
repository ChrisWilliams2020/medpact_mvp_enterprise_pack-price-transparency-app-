'use client';

export function ContractStats({ contracts }: { contracts: any[] }) {
  const activeContracts = contracts.filter((c) => c.status === 'active').length;
  const expiringContracts = contracts.filter((c) => {
    if (!c.renewal_date) return false;
    const daysUntilRenewal = Math.floor(
      (new Date(c.renewal_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilRenewal <= 90 && daysUntilRenewal >= 0;
  }).length;

  const totalReimbursement = contracts.reduce(
    (sum, c) => sum + (parseFloat(c.reimbursement_rate) || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Total Contracts
        </div>
        <div className="text-3xl font-bold text-gray-900">{contracts.length}</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Active Contracts
        </div>
        <div className="text-3xl font-bold text-green-600">{activeContracts}</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Expiring Soon
        </div>
        <div className="text-3xl font-bold text-orange-600">
          {expiringContracts}
        </div>
        <div className="text-xs text-gray-500 mt-1">Within 90 days</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Avg Reimbursement
        </div>
        <div className="text-3xl font-bold text-blue-600">
          ${(totalReimbursement / (contracts.length || 1)).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
