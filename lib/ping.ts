import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface PingResult {
  ip: string;
  status: "online" | "offline";
  latency: number | null;
  checkedAt: string;
}

export async function pingHost(ip: string): Promise<PingResult> {
  const isWindows = process.platform === "win32";
  const command = isWindows
    ? `ping -n 1 -w 2000 ${ip}`
    : `ping -c 1 -W 2 ${ip}`;

  const checkedAt = new Date().toISOString();

  try {
    const { stdout } = await execAsync(command, { timeout: 5000 });
    const latency = parseLatency(stdout, isWindows);

    return { ip, status: "online", latency, checkedAt };
  } catch {
    return { ip, status: "offline", latency: null, checkedAt };
  }
}

function parseLatency(stdout: string, isWindows: boolean): number | null {
  if (isWindows) {
    const match = stdout.match(/Average = (\d+)ms/);
    return match ? parseInt(match[1], 10) : null;
  }

  const match = stdout.match(/time[=<]([\d.]+)\s*ms/);
  return match ? parseFloat(match[1]) : null;
}

export async function pingAll(
  ips: string[],
  concurrency = 10,
): Promise<PingResult[]> {
  const results: PingResult[] = [];

  for (let i = 0; i < ips.length; i += concurrency) {
    const batch = ips.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(pingHost));
    results.push(...batchResults);
  }

  return results;
}