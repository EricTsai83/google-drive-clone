"use client";

import { ItemRow, type Item } from "./item-row";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import React from "react";

export type TableBodyProps = {
  folderId: number;
  currentFolderOwnerId: string;
};

export default function TableBody({
  folderId,
  currentFolderOwnerId,
}: TableBodyProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: "100px 0px",
    triggerOnce: false,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.folder.getFolderContents.useInfiniteQuery(
      { folderId, limit: 5 },
      {
        getNextPageParam: (lastPage) => {
          if (!lastPage.nextCursor) return undefined;
          return {
            lastModified: lastPage.nextCursor.lastModified,
            id: lastPage.nextCursor.id,
            phase: lastPage.nextCursor.phase as "folders" | "files",
          };
        },
      },
    );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items: Item[] = data
    ? data.pages.flatMap((pg) => pg.items as Item[])
    : [];

  return (
    <ul className="bg-popover flex h-full flex-col overflow-y-auto">
      {items.map((item) => (
        <ItemRow key={`${item.type}-${item.id}`} item={item} />
      ))}

      {/* 這個 li 在捲動到它時，就會觸發 inView */}
      <li ref={ref} className="py-4 text-center">
        {isFetchingNextPage
          ? "Loading more…"
          : hasNextPage
            ? "Scroll down to load more"
            : "No more items"}
      </li>
    </ul>
  );
}
