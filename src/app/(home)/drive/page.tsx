import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MUTATIONS, QUERIES } from "@/server/db/queries";
import { tryCatch } from "@/lib/try-catch";
import { DatabaseError } from "@/lib/exceptions";

export default async function DrivePage() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const { data: rootFolder, error } = await tryCatch(
    QUERIES.getRootFolderForUser(session.userId),
  );

  if (error) {
    throw new DatabaseError();
  }

  // first time onboarding
  if (!rootFolder) {
    return (
      <form
        action={async () => {
          "use server";
          const session = await auth();

          if (!session.userId) {
            return redirect("/sign-in");
          }

          const { data: rootFolderId, error } = await tryCatch(
            MUTATIONS.onboardUser(session.userId),
          );

          if (error) {
            throw new DatabaseError();
          }

          return redirect(`/f/${rootFolderId}`);
        }}
      >
        <Button>Create New Drive</Button>
      </form>
    );
  }

  return redirect(`/f/${rootFolder.id}`);
}
