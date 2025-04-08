"use client";

import dynamic from "next/dynamic";

const ModeToggle = dynamic(
  () =>
    import("@/components/mode-toggle").then(
      (mod) => mod.ModeToggleSvgAnimation,
    ),
  { ssr: false },
);

export default ModeToggle;
