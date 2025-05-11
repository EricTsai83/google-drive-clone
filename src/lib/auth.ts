// Attribute-Based Access Control
// 基於屬性的存取控制
// 根據使用者的屬性（例如角色、群組、權限等）來決定是否允許存取特定的資源
import type { folders_table, files_table } from "@/server/db/schema";

type File = typeof files_table.$inferSelect;
type Folder = typeof folders_table.$inferSelect;

type Role = "admin" | "user";
type User = { blockedBy: string[]; roles: Role[]; id: string };

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = Record<
  Role,
  Partial<{
    [Key in keyof Permissions]: Partial<
      Record<Permissions[Key]["action"], PermissionCheck<Key>>
    >;
  }>
>;

type Permissions = {
  files: {
    // Can do something like Pick<files, "id"> to get just the rows you use
    dataType: Pick<File, "id" | "ownerId">;
    action:
      | "view"
      | "uploadFile"
      | "downloadFile"
      | "renameFile"
      | "deleteFile";
  };
  folders: {
    dataType: Pick<Folder, "id" | "ownerId">;
    action: "view" | "createFolder" | "deleteFolder";
  };
};

const ROLES = {
  admin: {
    files: {
      view: true,
      uploadFile: true,
      downloadFile: true,
      renameFile: true,
      deleteFile: true,
    },
    folders: {
      view: true,
      createFolder: true,
      deleteFolder: true,
    },
  },
  user: {
    files: {
      view: true,
      uploadFile: (user, file) => file.ownerId === user.id,
      deleteFile: (user, file) => file.ownerId === user.id,
    },
    folders: {
      view: true,
      createFolder: true,
      deleteFolder: (user, folder) => folder.ownerId === user.id,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}

// // USAGE:
// const user: User = { blockedBy: ["2"], id: "1", roles: ["user"] };
// const folder: Folder = {
//   id: 1,
//   ownerId: "1",
//   name: "Test Folder",
//   type: "folder",
//   parent: null,
//   createdAt: new Date(),
//   lastModified: new Date(),
// };

// // Can upload a file
// hasPermission(user, "files", "uploadFile");

// // Can view the folder
// hasPermission(user, "folders", "view", folder);
