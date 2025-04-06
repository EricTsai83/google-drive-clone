"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ModeToggleSkeleton() {
  const { setTheme, theme } = useTheme();

  // 基本路徑
  const sunPath =
    "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C60 29 69.5 38 70 49.5Z";
  const moonPath =
    "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C39 45 49.5 59.5 70 49.5Z";

  return (
    <div className="flex items-center justify-center">
      <Button
        className="flex h-7 w-7 items-center justify-center p-0"
        variant="outline"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <svg
          width={100}
          height={100}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={theme === "dark" ? moonPath : sunPath} fill="currentColor" />
        </svg>
      </Button>
    </div>
  );
}
