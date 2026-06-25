import type { Metadata } from "next";

import { LandingPageCopyDoctor } from "@/components/LandingPageCopyDoctor";

export const metadata: Metadata = {
  title: "Landing Page Copy Doctor",
  description:
    "Diagnose a landing page hero, score the copy, find weak spots, and generate a sharper rewritten version.",
  alternates: {
    canonical: "/demos/landing-page-copy-doctor",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LandingPageCopyDoctorDemoPage() {
  return <LandingPageCopyDoctor />;
}
