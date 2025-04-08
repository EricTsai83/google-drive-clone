import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function BreadcrumbNavSkeleton() {
  return (
    <div className="flex items-center">
      {/* My Drive skeleton */}
      <Link href="/" className="mr-2 cursor-pointer">
        My Drive
      </Link>

      <div className="flex items-center">
        <ChevronRight className="text-muted-foreground mx-2" size={16} />
        <div className="bg-muted h-4 w-9 animate-pulse rounded" />
      </div>
    </div>
  );
}
