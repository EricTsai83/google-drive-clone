"use client";

import Image from "next/image";
import { useState } from "react";
import cn from "clsx";

export function BlurImage(props: React.ComponentProps<typeof Image>) {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setError] = useState(false);

  if (hasError) return <div>{"The image cannot be previewed."}</div>;

  return (
    <Image
      {...props}
      alt={props.alt}
      className={cn(
        props.className,
        "duration-700 ease-in-out",
        isLoading
          ? "scale-100 blur-2xl grayscale"
          : "scale-100 blur-0 grayscale-0",
      )}
      onLoadingComplete={() => setLoading(false)}
      onError={() => setError(true)}
    />
  );
}
