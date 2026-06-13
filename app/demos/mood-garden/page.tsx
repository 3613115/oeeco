import type { Metadata } from "next";
import { MoodGarden } from "@/components/MoodGarden";

export const metadata: Metadata = {
  title: "Mood Garden",
  description:
    "An interactive mood generator that grows animated canvas gardens from a feeling, density setting, and bloom light.",
  alternates: {
    canonical: "/demos/mood-garden",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MoodGardenDemoPage() {
  return <MoodGarden />;
}
