"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createFolder } from "@/server/actions";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/trpc/react";

export function CreateFolderDialog({
  currentFolderId,
}: {
  currentFolderId: number;
}) {
  const [folderName, setFolderName] = useState("New Folder");
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();

  async function onCreate(name: string, currentFolderId: number | null) {
    if (!name || name.trim().length === 0) {
      toast.error("Folder name is required");
      return;
    }
    setIsOpen(false);
    try {
      const response = await createFolder(name, currentFolderId);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Folder created successfully");
      await utils.folder.getFolderContents.invalidate();
    } catch (error) {
      toast.error(
        `Failed to create folder: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Create a Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Folder</DialogTitle>
          <DialogDescription className="sr-only">
            Name your folder
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              className="col-span-3"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex w-full justify-between">
          <Button
            variant="secondary"
            type="submit"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            onClick={() => onCreate(folderName, currentFolderId)}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
