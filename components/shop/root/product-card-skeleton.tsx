const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="flex gap-1">
            <div className="h-6 w-8 bg-gray-200 rounded" />
            <div className="h-6 w-8 bg-gray-200 rounded" />
            <div className="h-6 w-8 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
