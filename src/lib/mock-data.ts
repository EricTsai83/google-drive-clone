export interface File {
  id: string;
  name: string;
  type: "file";
  url: string;
  parent: string;
  size?: string;
}

export type Folder = {
  id: string;
  name: string;
  type: "folder";
  parent: string | null;
};

export const mockFolders: Folder[] = [
  { id: "1", name: "Documents", type: "folder", parent: "root" },
  { id: "2", name: "Images", type: "folder", parent: "root" },
  { id: "3", name: "Work", type: "folder", parent: "root" },
  { id: "4", name: "Presentations", type: "folder", parent: "3" },
];
