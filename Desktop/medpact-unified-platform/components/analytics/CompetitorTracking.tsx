'use client';

interface CompetitorTrackingProps {
  searches: any[];
}

export function CompetitorTracking({ searches }: CompetitorTrackingProps) {
  // Extract all practices from search results
  const allPractices: Record<string, { name: string; count: number; avgRating: number }> = {};

  searches.forEach((search) => {
    if (search.results && Array.isArray(search.results)) {
      search.results.forEach((practice: any) => {
        if (allPractices[practice.id]) {
          allPractices[practice.id].count++;
        } else {
          allPractices[practice.id] = {
            name: practice.name,
            count: 1,
            avgRating: practice.rating || 0,
          };
        }
      });
    }
  });

  const topPractices = Object.values(allPractices)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🏆 Top Competitors Identified
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Most frequently appearing practices in your search results
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Practice Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appearances
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topPractices.map((practice, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {practice.name}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {practice.count} times
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {practice.avgRating > 0 ? (
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1 text-sm text-gray-900">
                        {practice.avgRating.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No rating</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {topPractices.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No competitor data available yet
        </div>
      )}
    </div>
  );
}
