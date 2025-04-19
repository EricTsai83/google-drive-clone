"use client";

// import { unauthorized } from "next/navigation";
// import { QUERIES } from "@/server/db/queries";
import { ItemRow } from "./item-row";
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
  const { ref, inView } = useInView({ threshold: 0 });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    api.folder.getFolderContents.useInfiniteQuery(
      {
        folderId,
        limit: 5,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "error") {
    return <div>Error loading contents</div>;
  }

  const allContents =
    data?.pages.flatMap((page) => [...page.folders, ...page.files]) ?? [];

  // Verify ownership
  const hasInvalidContents = allContents.some(
    (content) => content.ownerId !== currentFolderOwnerId,
  );

  if (hasInvalidContents) {
    throw new Error("Unauthorized");
  }

  // const contents =  await QUERIES.getFolderContents(folderId);

  // 驗證 folders 與 files 中所有項目的 ownerId 是否與 currentFolderOwnerId 相同
  // const hasInvalidContents = contents.some(
  //   (content) => content.ownerId !== currentFolderOwnerId,
  // );

  // if (hasInvalidContents) {
  //   unauthorized();
  // }

  return (
    <ul className="bg-popover flex h-full flex-col overflow-y-auto">
      {allContents.map((content) => (
        <ItemRow
          key={`${content.type}-${content.id}`}
          item={content}
          type={content.type}
        />
      ))}

      {/* Loading indicator */}
      <div ref={ref} className="h-8 w-full">
        {isFetchingNextPage && (
          <div className="flex justify-center py-2">Loading more...</div>
        )}
      </div>
    </ul>
  );
}
