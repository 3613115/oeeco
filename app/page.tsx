import { HomeClient } from "@/components/HomeClient";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  return <HomeClient initialQuery={params.q || ""} />;
}
