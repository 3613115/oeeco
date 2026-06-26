import type { Metadata } from "next";

import { CustomerInterviewSignalLab } from "@/components/CustomerInterviewSignalLab";

export const metadata: Metadata = {
  title: "Customer Interview Signal Lab",
  description:
    "Turn customer interview notes into product evidence with signal scoring, themes, next questions, and an action plan.",
  alternates: {
    canonical: "/demos/customer-interview-signal-lab",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CustomerInterviewSignalLabDemoPage() {
  return <CustomerInterviewSignalLab />;
}
