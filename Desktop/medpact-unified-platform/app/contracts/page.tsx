'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { AddContractModal } from '@/components/contracts/AddContractModal';
import toast from 'react-hot-toast';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/contracts');
      const data = await response.json();
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContract = async (contractData: any) => {
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      });

      if (response.ok) {
        toast.success('Contract added successfully');
        setShowAddModal(false);
        fetchContracts();
      } else {
        toast.error('Failed to add contract');
      }
    } catch (error) {
      console.error('Error adding contract:', error);
      toast.error('Failed to add contract');
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Payor Contracts
          </h1>
          <p className="text-lg text-gray-600">
            Manage your payor contracts and reimbursement rates
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          + Add Contract
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Payor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Rate
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {contract.payor_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {contract.contract_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {contract.plan_name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {contract.reimbursement_rate
                      ? `$${contract.reimbursement_rate}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contract.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : contract.status === 'expiring'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddContractModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddContract}
        />
      )}
    </main>
  );
}