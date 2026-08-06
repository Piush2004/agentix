import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/platform/benchmark-stats`, {
      timeout: 10000
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[benchmark-stats] Backend error:", error?.message);
    return NextResponse.json({
      status: "error",
      data: {
        total_benchmark_datasets: 0,
        total_experiments: 0,
        total_strategy_reasonings: 0,
        top_experiments: []
      }
    });
  }
}
