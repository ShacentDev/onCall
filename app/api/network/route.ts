import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { SWITCHES } from "@/lib/switches";

export async function GET() {
  try {
    const switches = SWITCHES.map((sw) => ({
      ...sw,
      status: "unknown" as const,
      latency: null,
      lastChecked: null,
    }));

    return NextResponse.json(switches);
  } catch (error) {
    return handleApiError(error);
  }
}