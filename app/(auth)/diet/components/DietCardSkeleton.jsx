const DietCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm w-full max-w-sm animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div className="flex flex-col gap-1">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-20 h-7 bg-gray-200 rounded-full"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-200 mt-2"></div>
                <div className="flex flex-col gap-1">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-2 mt-1">
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="h-5 w-2 bg-gray-200 rounded"></div>
            <div className="h-5 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default DietCardSkeleton; 