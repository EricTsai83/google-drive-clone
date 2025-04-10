import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  // If showing bytes (i === 0), don't show decimal points
  if (i === 0) {
    return `${Math.floor(bytes)} ${sizes[i]}`;
  }

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
