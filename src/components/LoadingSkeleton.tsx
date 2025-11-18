export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-32 bg-gray-700 rounded mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
  )
}

export function TokenListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-gray-700/30 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-600 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-600 rounded w-16 mb-2 ml-auto"></div>
              <div className="h-3 bg-gray-600 rounded w-12 ml-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
