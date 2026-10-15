import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }
  // @ts-expect-error role is added to the session in auth.config.ts
  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
  }
  return { userId: session.user.id as string };
}

export async function GET() {
  const check = await requireAdmin();
  if (check.error) return check.error;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });

    const datasets = await prisma.dataset.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const activityLogs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });

    const userCount = await prisma.user.count();
    const datasetCount = await prisma.dataset.count();
    const reportCount = await prisma.report.count();
    const sessionCount = await prisma.session.count();

    return NextResponse.json({
      status: "success",
      data: {
        users,
        datasets,
        activityLogs,
        stats: {
          userCount,
          datasetCount,
          reportCount,
          sessionCount
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const check = await requireAdmin();
  if (check.error) return check.error;

  try {
    const { action, userId: targetUserId, role } = await req.json();
    if (action === "update_role") {
      const user = await prisma.user.update({
        where: { id: targetUserId },
        data: { role }
      });
      return NextResponse.json({ status: "success", user });
    }
    
    if (action === "delete_user") {
      await prisma.user.delete({
        where: { id: targetUserId }
      });
      return NextResponse.json({ status: "success" });
    }
    
    return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
