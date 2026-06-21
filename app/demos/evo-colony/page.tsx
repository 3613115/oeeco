import type { Metadata } from "next";

import { EvoColony } from "@/components/EvoColony";

export const metadata: Metadata = {
  title: "EVO//COLONY",
  description: "A deterministic artificial-life laboratory where neural creatures evolve under your interventions.",
  alternates: { canonical: "/demos/evo-colony" },
  robots: { index: false, follow: true },
};

export default function EvoColonyPage() {
  return <EvoColony />;
}
