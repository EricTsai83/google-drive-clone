import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(request: Request) {
  try {
    const evt = await verifyWebhook(request);

    // Handle specific event types
    if (evt.type === "user.created") {
      console.log("New user created:", evt.data.id);
      // Handle user creation
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
