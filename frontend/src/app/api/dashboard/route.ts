import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";

// Maps a real PipelineStage.status value to the labels the dashboard's
// workflow bar already knows how to render (dashboard/page.tsx).
function mapStageStatus(status: string): string {
  if (status === "completed") return "Completed";
  if (status === "running") return "In Progress";
  if (status === "failed") return "Failed";
  return "Pending";
}

export async function GET() {
  const session = await auth();
  const uid = session?.user?.id as string | undefined;
  if (!uid) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    let recentDatasets: any[] = [];
    let recentReports: any[] = [];
    let activityLogs: any[] = [];

    try {
      recentDatasets = await prisma.dataset.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 5
      });

      recentReports = await prisma.report.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 5
      });

      activityLogs = await prisma.activityLog.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 10
      });
    } catch (dbError) {
      // Database unreachable: report an honest empty state rather than
      // fabricating datasets/reports/activity that were never real.
      console.error("Dashboard DB query failed:", dbError);
      recentDatasets = [];
      recentReports = [];
      activityLogs = [];
    }

    // Real workflow progress for whatever the most recent pipeline run is.
    // No fabricated fallback here: if the backend call fails or no run
    // exists yet, we report an honest "no run yet" state (empty node list)
    // rather than a hardcoded "all 7 stages Completed" array, which used to
    // render permanently regardless of whether anything had actually run.
    let workflow: { state: string; nodes: any[] } = { state: "IDLE", nodes: [] };

    try {
      const resMetrics = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/platform/dashboard-metrics`, { timeout: 1500 });
      const metrics = resMetrics.data?.data;
      if (metrics) {
        const stateMap: Record<string, string> = {
          Idle: "IDLE",
          Processing: "PROCESSING",
          Completed: "COMPLETED",
          Failed: "FAILED",
        };
        workflow = {
          state: stateMap[metrics.workflow_state] || "IDLE",
          nodes: (metrics.stages || []).map((s: any) => ({
            id: s.agent_name,
            label: s.agent_name,
            status: mapStageStatus(s.status),
            duration: s.duration,
          })),
        };

        // Also surface real activity from the backend (dataset uploads /
        // pipeline runs), merged ahead of the frontend's own DB-backed log.
        try {
          const resActivity = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/platform/recent-activity`, { timeout: 1500 });
          if (Array.isArray(resActivity.data?.data)) {
            const backendLogs = resActivity.data.data.map((log: any) => ({
              id: log.id,
              userId: uid,
              action: log.action,
              metadata: {},
              createdAt: log.createdAt,
            }));
            activityLogs = [...backendLogs, ...activityLogs].slice(0, 15);
          }
        } catch {
          // Backend activity feed unavailable - keep the DB-backed logs only.
        }
      }
    } catch {
      // Backend unreachable - keep the honest IDLE/no-runs default above.
    }

    return NextResponse.json({
      status: "success",
      data: {
        recentDatasets,
        recentReports,
        activityLogs,
        workflow,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
