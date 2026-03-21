'use client';

interface SpecialtyBreakdownProps {
  data: { specialty: string; count: number }[];
}

export function SpecialtyBreakdown({ data }: SpecialtyBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const getSpecialtyIcon = (specialty: string) => {
    const icons: Record<string, string> = {
      ophthalmology: '👁️',
      optometry: '👓',
      all: '🔍',
    };
    return icons[specialty] || '📊';
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: Record<string, string> = {
      ophthalmology: 'bg-red-500',
      optometry: 'bg-blue-500',
      all: 'bg-green-500',
    };
    return colors[specialty] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Specialty Breakdown
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Search distribution by specialty type
      </p>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;

          return (
            <div key={item.specialty}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getSpecialtyIcon(item.specialty)}</span>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.specialty}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.count} ({percentage.toFixed(1)}%)
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getSpecialtyColor(item.specialty)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No specialty data available yet
        </div>
      )}
    </div>
  );
}
