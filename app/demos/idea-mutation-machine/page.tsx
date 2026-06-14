import type { Metadata } from "next";

import { IdeaMutationMachine } from "@/components/IdeaMutationMachine";

export const metadata: Metadata = {
  title: "Idea Mutation Machine",
  description: "Generate alternate versions of a rough idea with hooks, build notes, audiences, and validation signals.",
  alternates: {
    canonical: "/demos/idea-mutation-machine",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function IdeaMutationMachineDemoPage() {
  return <IdeaMutationMachine />;
}
