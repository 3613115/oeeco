import type { Metadata } from "next";

import { NeonPosterMaker } from "@/components/NeonPosterMaker";

export const metadata: Metadata = {
  title: "Neon Poster Maker",
  description: "Create a downloadable neon launch poster from a headline, palette, layout, and glow setting.",
  alternates: {
    canonical: "/demos/neon-poster-maker",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function NeonPosterMakerDemoPage() {
  return <NeonPosterMaker />;
}
