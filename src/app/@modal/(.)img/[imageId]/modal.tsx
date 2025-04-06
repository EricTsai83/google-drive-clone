"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="relative h-screen w-screen bg-black/90 text-white focus:outline-none"
      onClose={onDismiss}
    >
      <Button className="absolute left-4 top-4 z-10" onClick={onDismiss}>
        Go Back
      </Button>
      {children}
    </dialog>,
    document.getElementById("modal-root")!,
  );
}
