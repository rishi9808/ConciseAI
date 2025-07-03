import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  console.log("🧪 Clerk Test:", user);
  return Response.json({ user });
}
