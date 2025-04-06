import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function BreadcrumbNavSkeleton() {
  return (
    <div className="flex items-center">
      {/* My Drive skeleton */}
      <Link href="/" className="mr-2 cursor-pointer">
        My Drive
      </Link>

      {/* Generate 2-3 folder skeletons */}

      <div className="flex items-center">
        <ChevronRight className="mx-2 text-muted-foreground" size={16} />
        <div className="h-4 w-9 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
