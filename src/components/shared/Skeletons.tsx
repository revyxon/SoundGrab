import { Skeleton } from '@/components/ui/skeleton'

export function SongRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Skeleton className="h-10 w-10 rounded-md" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="hidden md:block h-3 w-24" />
      <Skeleton className="hidden sm:block h-3 w-10" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  )
}

export function SongListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <SongRowSkeleton key={i} />
      ))}
    </div>
  )
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3 space-y-2">
          <Skeleton className="aspect-square w-full rounded-md" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <Skeleton className="h-48 w-48 rounded-lg shrink-0" />
      <div className="space-y-3 flex-1">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}
