import type { Metadata } from "next";

import { MicroSaasValidationLab } from "@/components/MicroSaasValidationLab";

export const metadata: Metadata = {
  title: "Micro SaaS Validation Lab",
  description:
    "Validate a product idea with scoring, audience mapping, MVP scope, pricing direction, risks, and a launch plan.",
  alternates: {
    canonical: "/demos/micro-saas-validation-lab",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function MicroSaasValidationLabDemoPage() {
  return <MicroSaasValidationLab />;
}
