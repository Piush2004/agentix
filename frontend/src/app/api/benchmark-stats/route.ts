import { NextResponse } from "next/server";
import axios from "axios";

// Was reading a nonexistent BACKEND_URL env var (always falling back to a
// hardcoded :8000), while every other route in this app uses
// NEXT_PUBLIC_API_URL (:8001 locally) - meant this call could never reach
// the real backend regardless of what port it was actually running on.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

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
