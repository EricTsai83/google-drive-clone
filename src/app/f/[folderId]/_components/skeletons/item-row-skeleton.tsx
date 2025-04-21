export function ItemRowSkeleton() {
  return (
    <li className="border-border border-t px-6 py-4">
      <div className="grid grid-cols-12 items-center gap-4">
        {/* Folder/File name skeleton */}
        <div className="col-span-6 flex items-center">
          <div className="bg-muted mr-3 h-5 w-5 animate-pulse rounded" />
          <div className="bg-muted h-6 w-48 animate-pulse rounded" />
        </div>

        {/* Last modified date skeleton */}
        <div className="col-span-2">
          <div className="bg-muted h-6 w-24 animate-pulse rounded" />
        </div>

        {/* File size skeleton */}
        <div className="col-span-3">
          <div className="bg-muted h-6 w-16 animate-pulse rounded" />
        </div>

        {/* Actions skeleton */}
        <div className="col-span-1">
          <div className="bg-muted h-5 w-8 animate-pulse rounded" />
        </div>
      </div>
    </li>
  );
}

// 如果需要多行 skeleton，可以使用這個組件
export function TableBodySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="relative h-full w-full">
      <ul className="bg-popover flex h-full flex-col overflow-y-auto">
        {Array.from({ length: count }).map((_, index) => (
          <ItemRowSkeleton key={index} />
        ))}
      </ul>
    </div>
  );
}
