export function ItemRowSkeleton() {
  return (
    <li className="border-t border-border px-6 py-4">
      <div className="grid grid-cols-12 items-center gap-4">
        {/* Folder/File name skeleton */}
        <div className="col-span-6 flex items-center">
          <div className="mr-3 h-5 w-5 animate-pulse rounded bg-muted" />
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        </div>

        {/* Last modified date skeleton */}
        <div className="col-span-2">
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        </div>

        {/* File size skeleton */}
        <div className="col-span-3">
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
        </div>

        {/* Actions skeleton */}
        <div className="col-span-1">
          <div className="h-5 w-8 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </li>
  );
}

// 如果需要多行 skeleton，可以使用這個組件
export function ItemRowSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ItemRowSkeleton key={index} />
      ))}
    </>
  );
}
