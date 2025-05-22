import { Modal } from "./modal";
import { FullPageImageView } from "@/common/full-page-image-view";
import { QUERIES } from "@/server/db/queries";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { tryCatch } from "@/lib/try-catch";
import { DatabaseError } from "@/lib/exceptions";

export default async function PhotoModal(props: {
  params: Promise<{ imageId: string }>;
}) {
  const params = await props.params;
  const { data, success } = z
    .object({
      imageId: z.coerce.number(),
    })
    .safeParse(params);

  if (!success) return <div>Invalid file ID</div>;

  const parsedImageId = data.imageId;

  const { data: currentFileOwnerId, error: getFileOwnerError } = await tryCatch(
    QUERIES.getFileOwner(parsedImageId),
  );

  if (getFileOwnerError) {
    throw new DatabaseError();
  }

  const session = await auth();

  if (currentFileOwnerId !== session.userId) {
    unauthorized();
  }

  const { data: file, error: getFileError } = await tryCatch(
    QUERIES.getFile(parsedImageId),
  );

  if (getFileError) {
    throw new DatabaseError();
  }

  return (
    <Modal>
      <FullPageImageView image={file ?? null} />
    </Modal>
  );
}
