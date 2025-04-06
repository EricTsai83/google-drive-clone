import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Unauthorized</CardTitle>
          <CardDescription className="sr-only">
            Your identity does not have access to this folder.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Your identity does not have access to this folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/">Return to your homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
