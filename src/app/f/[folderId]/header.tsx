import { Suspense } from "react";
import { BreadcrumbNavSkeleton } from "./_components/skeletons/breadcrumb-nav-skeleton";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import type { folders_table } from "@/server/db/schema";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type HeaderProps = {
  parents: (typeof folders_table.$inferSelect)[];
};

export function BreadcrumbNav({ parents }: HeaderProps) {
  return (
    <Suspense fallback={<BreadcrumbNavSkeleton />}>
      <nav>
        <ol className="inline-flex items-center space-x-2">
          <li>
            <Link href="/" className="cursor-pointer">
              My Drive
            </Link>
          </li>
          {parents.map((folder) => (
            <li key={folder.id} className="inline-flex items-center">
              <ChevronRight size={16} className="mx-2" />
              <Link href={`/f/${folder.id}`}>{folder.name}</Link>
            </li>
          ))}
        </ol>
      </nav>
    </Suspense>
  );
}

export function AuthButtons() {
  return (
    <div className="h-7 w-7">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
