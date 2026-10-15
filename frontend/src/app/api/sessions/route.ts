import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Real sessions only. This app uses NextAuth's JWT session strategy, so the
  // Prisma Session table is not authoritative for "who's logged in right
  // now" — it may legitimately be empty. No fabricated device/IP data.
  const activeSessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { lastActive: "desc" },
  });

  return NextResponse.json({ status: "success", sessions: activeSessions });
}

export async function DELETE(req: Request) {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { sessionId } = await req.json();
    await prisma.session.delete({
      where: { id: sessionId, userId }
    });
    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
