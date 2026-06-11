import { NextResponse } from "next/server";
import { recordWorkEngagement, type WorkEngagementMetric } from "@/lib/work-service";

const metrics = new Set<WorkEngagementMetric>(["view", "try", "demo_open", "share"]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let metric: unknown;
  try {
    const body = (await request.json()) as { metric?: unknown };
    metric = body.metric;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof metric !== "string" || !metrics.has(metric as WorkEngagementMetric)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await recordWorkEngagement(id, metric as WorkEngagementMetric);
  return NextResponse.json({ ok: true });
}
