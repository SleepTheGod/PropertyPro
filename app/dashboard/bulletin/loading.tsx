export default function BulletinLoading() {
  return (
    <div className="p-6">
      <div className="h-8 w-48 bg-gray-200 rounded-md mb-4"></div>
      <div className="h-4 w-96 bg-gray-200 rounded-md mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
            <div className="h-5 w-24 bg-gray-200 rounded-md mb-2"></div>
            <div className="space-y-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="h-5 w-32 bg-gray-200 rounded-md mb-2"></div>
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
            <div className="flex gap-2">
              <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
            </div>
          </div>

          <div className="h-10 w-48 bg-gray-200 rounded-md mb-6"></div>

          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg border shadow-sm mb-4">
              <div className="h-6 w-48 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-16 bg-gray-200 rounded-md mb-2"></div>
              <div className="flex justify-between">
                <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
