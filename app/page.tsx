import { HomeClient } from "@/components/HomeClient";
import { getHomeWorks } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const homeWorks = await getHomeWorks();
  return <HomeClient initialQuery={params.q || ""} initialWorks={homeWorks} />;
}
