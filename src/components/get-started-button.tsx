"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

export function GetStartedButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" size="lg" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader className="h-4 w-4 animate-spin" size={16} />
          <span>Verifying...</span>
        </>
      ) : (
        "Get Started"
      )}
    </Button>
  );
}
