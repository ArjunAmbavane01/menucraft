import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function WeeklyMenuSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-24 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-10 w-60" />
      </div>

      {/* This Week's Menu Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>

        {/* Menu Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    {[...Array(9)].map((_, i) => (
                      <th key={i} className="text-left p-3 font-medium">
                        <Skeleton className="h-4 w-16" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <tr className="border-b">
                        <td className="p-3">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        {[...Array(8)].map((_, colIndex) => (
                          <td key={colIndex} className="p-3">
                            <Skeleton className="h-4 w-24" />
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="p-3 pl-6 text-sm" colSpan={9}>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming And Past Section */}
      {[...Array(2)].map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>

          <Card className='py-0 overflow-hidden'>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="text-left p-3 font-medium">
                      <Skeleton className="h-4 w-16" />
                    </th>
                    <th className="text-left p-3 font-medium">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(2)].map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">
                        <Skeleton className="h-4 w-36" />
                      </td>
                      <td className="p-3">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ))}

    </div>
  );
}