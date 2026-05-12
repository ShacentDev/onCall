import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { pingRequestSchema } from "@/lib/zod";
import { pingHost, pingAll } from "@/lib/ping";
import { SWITCHES } from "@/lib/switches";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = pingRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    if ("all" in result.data) {
      const ips = SWITCHES.map((sw) => sw.ip);
      const pingResults = await pingAll(ips);

      return NextResponse.json(pingResults);
    }

    const pingResult = await pingHost(result.data.ip);
    return NextResponse.json(pingResult);
  } catch (error) {
    return handleApiError(error);
  }
}