// Attribute-Based Access Control
// 基於屬性的存取控制
// 根據使用者的屬性（例如角色、群組、權限等）來決定是否允許存取特定的資源

type Role = "admin" | "user";
type User = { roles: Role[]; id: string };

type Resource = "files" | "folders" | "rateLimit";

type FileAction = "view" | "upload" | "download" | "rename" | "delete";
type FolderAction = "view" | "create" | "delete" | "rename";
type RateLimitAction = "ignore";
type Action = FileAction | FolderAction | RateLimitAction;

type PermissionCheck = boolean | ((user: User) => boolean);

type ResourcePermissions = Partial<Record<Action, PermissionCheck>>;
type RolePermissions = Record<
  Role,
  Partial<Record<Resource, ResourcePermissions>>
>;

const ROLES: RolePermissions = {
  admin: {
    files: {
      view: true,
      upload: true,
      download: true,
      rename: true,
      delete: true,
    },
    folders: {
      view: true,
      create: true,
      delete: true,
      rename: true,
    },
    rateLimit: {
      ignore: true,
    },
  },
  user: {
    files: {
      view: (_user) => true,
      upload: (_user) => true,
      download: (_user) => true,
      rename: (_user) => true,
      delete: (_user) => true,
    },
    folders: {
      view: (_user) => true,
      create: (_user) => true,
      delete: (_user) => true,
      rename: (_user) => true,
    },
    rateLimit: {
      ignore: false,
    },
  },
};

export function hasPermission(
  user: User,
  resource: Resource,
  action: Action,
): boolean {
  return user.roles.some((role) => {
    const permission = ROLES[role][resource]?.[action];

    if (permission === undefined) return false;
    if (typeof permission === "boolean") return permission;
    if (typeof permission === "function") return permission(user);

    return false;
  });
}

// Usage examples:
// hasPermission({ roles: ["admin"], id: "1" }, "rateLimit", "ignore") // returns true
// hasPermission({ roles: ["user"], id: "1" }, "rateLimit", "ignore") // returns false
