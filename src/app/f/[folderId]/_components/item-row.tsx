"use client";

import type { files_table, folders_table } from "@/server/db/schema";
import { Folder as FolderIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { ActionDropdownMenu } from "./action-dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { cn, formatFileSize } from "@/lib/utils";
import { Eye } from "lucide-react";
import { validImageExtensions } from "@/common/full-page-image-view";

export function ItemRow({
  item,
  type,
}: {
  item: typeof files_table.$inferSelect | typeof folders_table.$inferSelect;
  type: "file" | "folder";
}) {
  const Icon = type === "folder" ? FolderIcon : FileIcon;
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <li
      className={cn("border-t border-gray-700 px-6 py-4", {
        "animate-pulse bg-gray-200 dark:bg-gray-800": isDeleting,
      })}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        {/* Folder name */}
        <div className="col-span-6 flex items-center">
          {type === "folder" ? (
            <Link
              className={cn("flex items-center", {
                "cursor-not-allowed": isDeleting,
              })}
              href={`/f/${item.id}`}
              onClick={(e) => isDeleting && e.preventDefault()}
            >
              <Icon className="mr-3" size={20} />
              <span className={cn({ "line-through": isDeleting })}>
                {item.name}
              </span>
            </Link>
          ) : (
            <div
              className={cn("flex items-center gap-2", {
                "cursor-not-allowed": isDeleting,
              })}
            >
              <div className="flex items-center">
                <Icon className="mr-3" size={20} />
                <span className={cn({ "line-through": isDeleting })}>
                  {item.name}
                </span>
              </div>
              {validImageExtensions.some((ext) =>
                item.name.toLowerCase().endsWith(ext),
              ) && (
                <Link
                  className="hover:text-primary"
                  href={`/img/${item.id}`}
                  onClick={(e) => isDeleting && e.preventDefault()}
                >
                  <Eye />
                </Link>
              )}
            </div>
          )}
        </div>
        {/* Last modified date */}
        <div className="col-span-2">
          {format(new Date(item.lastModified), "yyyy-MM-dd")}
        </div>
        {/* File size */}
        <div className="col-span-3">
          {type === "file"
            ? formatFileSize((item as typeof files_table.$inferSelect).size)
            : "—"}
        </div>
        {/* Actions */}
        <div className="col-span-1">
          <ActionDropdownMenu
            id={item.id}
            name={item.name}
            type={type}
            setIsDeleting={setIsDeleting}
          />
        </div>
      </div>
    </li>
  );
}
