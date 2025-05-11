import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;
    const clerk = await clerkClient();

    switch (eventType) {
      case "user.created":
        const user = await clerk.users.updateUser(evt.data.id, {
          publicMetadata: {
            roles: ["user"],
          },
        });
        console.log("User created:", user);
        break;
      default:
        console.log("Unknown event type:", evt.type);
        break;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
