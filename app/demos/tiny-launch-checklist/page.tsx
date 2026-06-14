import type { Metadata } from "next";

import { TinyLaunchChecklist } from "@/components/TinyLaunchChecklist";

export const metadata: Metadata = {
  title: "Tiny Launch Checklist",
  description: "Score a small launch with a compact checklist for demo quality, page polish, trust, and sharing.",
  alternates: {
    canonical: "/demos/tiny-launch-checklist",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TinyLaunchChecklistDemoPage() {
  return <TinyLaunchChecklist />;
}
