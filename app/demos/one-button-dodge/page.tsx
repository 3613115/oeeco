import type { Metadata } from "next";
import { OneButtonDodgeGame } from "@/components/OneButtonDodgeGame";

export const metadata: Metadata = {
  title: "One Button Dodge",
  description: "A 30-second one-button reflex game where players switch lanes, dodge blocks, and chase a better score.",
  alternates: {
    canonical: "/demos/one-button-dodge",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function OneButtonDodgeDemoPage() {
  return <OneButtonDodgeGame />;
}
