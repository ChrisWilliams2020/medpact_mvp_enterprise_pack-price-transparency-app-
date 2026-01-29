'use client';

interface ResultsListProps {
  results: any[];
  loading: boolean;
}

export function ResultsList({ results, loading }: ResultsListProps) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-500">Searching for competitors...</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <div className="text-gray-500 mb-2">No results yet</div>
        <div className="text-sm text-gray-400">
          Enter a location to find nearby competitors
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] overflow-y-auto">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-900">
          Found {results.length} competitors
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {results.map((place, index) => (
          <div key={place.place_id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{place.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{place.vicinity}</p>
                {place.rating && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-yellow-600">⭐ {place.rating}</span>
                    {place.user_ratings_total && (
                      <span className="text-xs text-gray-500">
                        ({place.user_ratings_total} reviews)
                      </span>
                    )}
                  </div>
                )}
                {place.opening_hours && (
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        place.opening_hours.open_now
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">#{index + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
