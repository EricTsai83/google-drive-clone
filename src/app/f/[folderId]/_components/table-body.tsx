"use client";

import { ItemRow, type Item } from "./item-row";
import { api } from "@/trpc/react";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { TableBodySkeleton } from "./skeletons/item-row-skeleton";

export type TableBodyProps = {
  folderId: number;
};

export default function TableBody({ folderId }: TableBodyProps) {
  // 1. 先取得 ul 的 ref
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  // 2. 再把它當 root 傳給用來偵測 sentinel 的 hook
  const { ref: sentinelRef, inView } = useInView({
    root: scrollContainerRef.current,
    rootMargin: "400px 0px", // 在 ul 的上下各擴 400px 觸發
    threshold: 0.1,
    triggerOnce: false,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.folder.getFolderContents.useInfiniteQuery(
      { folderId, limit: 8 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <TableBodySkeleton />;
  }

  const items: Item[] = data
    ? data.pages.flatMap((pg) => pg.items as Item[])
    : [];

  return (
    // 3. 把這個 ref 掛在 ul 上
    <ul
      ref={scrollContainerRef}
      className="bg-popover flex h-full flex-col overflow-y-auto"
    >
      {items.map((item) => (
        <ItemRow key={`${item.type}-${item.id}`} item={item} />
      ))}

      {hasNextPage && (
        <li
          ref={sentinelRef}
          className={`py-4 text-center transition-colors duration-300 ${
            inView ? "bg-primary/10" : "bg-transparent"
          }`}
        >
          {isFetchingNextPage ? "Loading more..." : "Scroll down to load more"}
        </li>
      )}
    </ul>
  );
}
