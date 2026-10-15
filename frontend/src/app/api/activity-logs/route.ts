import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Real activity only — an empty list is an honest "nothing happened yet",
  // not an invitation to fabricate a demo timeline.
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ status: "success", logs });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { action, metadata } = await req.json();
    const log = await prisma.activityLog.create({
      data: {
        userId,
        action,
        metadata: metadata || {},
      },
    });
    return NextResponse.json({ status: "success", log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
