export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-md mt-8 p-6 rounded-3xl border border-gray-100 shadow-xl bg-white animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>

      {/* Text Lines Skeleton */}
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Grid Nutrisi Skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
      </div>

      {/* Warning Box Skeleton */}
      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
    </div>
  );
}