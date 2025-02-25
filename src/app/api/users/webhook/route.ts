import { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { db } from "@/db";
import { users } from "@/db/schema";

export const POST = async (req: Request) => {
  const CLERK_SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!CLERK_SIGNING_SECRET) {
    throw new Error(
      "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const wh = new Webhook(CLERK_SIGNING_SECRET);

  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);

    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    await db.insert(users).values({
      clerkId: evt.data.id,
      name: `${evt.data.first_name} ${evt.data.last_name}`,
      imageUrl: evt.data.image_url,
    });
  }

  if (evt.type === "user.deleted") {
    if (!evt.data.id) {
      return new Response("Error: Missing user ID", { status: 400 });
    }

    await db.delete(users).where(eq(users.clerkId, evt.data.id));
  }

  if (evt.type === "user.updated") {
    await db
      .update(users)
      .set({
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        imageUrl: evt.data.image_url,
      })
      .where(eq(users.clerkId, evt.data.id));
  }

  return new Response("Webhook received", { status: 200 });
};
