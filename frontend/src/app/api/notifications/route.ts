import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Real notifications only — an empty list means no notifications yet,
  // not an invitation to fabricate some.
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ status: "success", notifications });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { action, id } = await req.json();
    if (action === "read_all") {
      await prisma.notification.updateMany({
        where: { userId },
        data: { read: true },
      });
      return NextResponse.json({ status: "success" });
    } else if (action === "read" && id) {
      await prisma.notification.update({
        where: { id, userId },
        data: { read: true },
      });
      return NextResponse.json({ status: "success" });
    }
    return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
