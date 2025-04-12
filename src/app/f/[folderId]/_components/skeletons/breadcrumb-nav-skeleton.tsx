import { ChevronRight } from "lucide-react";
import React from "react";

export function BreadcrumbNavSkeleton() {
  return (
    <nav className="flex items-center">
      <div>My Drive</div>
      <div className="flex items-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="text-muted-foreground mx-2" size={16} />
            <div className="bg-muted h-4 w-9 animate-pulse rounded" />
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
