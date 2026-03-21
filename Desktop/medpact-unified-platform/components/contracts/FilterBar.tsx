'use client';

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by payor name..."
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          onChange={(e) => onFilterChange({ type: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Commercial">Commercial</option>
          <option value="Medicare">Medicare</option>
          <option value="Medicaid">Medicaid</option>
        </select>
        <select
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
        </select>
      </div>
    </div>
  );
}
