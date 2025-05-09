import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      console.log("userId:", evt.data.id);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
