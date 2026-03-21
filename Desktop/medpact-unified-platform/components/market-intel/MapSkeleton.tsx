export function MapSkeleton() {
  return (
    <div className="h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading map...</p>
      </div>
    </div>
  );
}
