'use client';

import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="w-3/4 mx-auto h-10 mb-8">
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="mb-8">
        <Skeleton className="h-16 w-full mb-4" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
