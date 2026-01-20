import { Skeleton } from "@/components/ui/skeleton";

export default function WeeklyMenuLoading() {
  return (
    <div className="py-28 max-w-7xl mx-auto">
      {/* Menu Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-16">
          <div>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b">
            <div className="grid grid-cols-9 gap-4 p-3">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* Table Rows */}
          {[...Array(5)].map((_, dayIndex) => (
            <div key={dayIndex} className=" last:border-b-0">
              {/* Main Row */}
              <div className="grid grid-cols-9 gap-4 p-3 items-center">
                <div>
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>

              {/* Evening Snacks Row */}
              <div className="grid grid-cols-9 gap-4 p-3 bg-gray-50">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-24" />
                <div className="col-span-7" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}