import type { Metadata } from "next";

import { OrbitalSalvage } from "@/components/OrbitalSalvage";

export const metadata: Metadata = {
  title: "ORBITAL//SALVAGE",
  description: "A Newtonian flight prototype for a precision orbital salvage game.",
  alternates: { canonical: "/demos/orbital-salvage" },
  robots: { index: false, follow: true },
};

export default function OrbitalSalvagePage() {
  return <OrbitalSalvage />;
}
