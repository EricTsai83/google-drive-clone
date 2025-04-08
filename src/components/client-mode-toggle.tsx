"use client";

import dynamic from "next/dynamic";

export const ModeToggleSvgAnimation = dynamic(
  () =>
    import("@/components/mode-toggle").then(
      (mod) => mod.ModeToggleSvgAnimation,
    ),
  { ssr: false },
);

export const ModeToggleButton = dynamic(
  () => import("@/components/mode-toggle").then((mod) => mod.ModeToggleButton),
  { ssr: false },
);
