import { FullPageImageView } from "@/common/full-page-image-view";
import { QUERIES } from "@/server/db/queries";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";

export default async function ImageModal(props: {
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

  // check file authorisation
  const currentFileOwnerId = await QUERIES.getFileOwner(parsedImageId);
  const session = await auth();

  if (currentFileOwnerId !== session.userId) {
    unauthorized();
  }

  const image = await QUERIES.getFile(parsedImageId);

  if (!image) return <FullPageImageView image={null} />;

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 overflow-y-hidden">
      <FullPageImageView image={image} />
    </div>
  );
}
