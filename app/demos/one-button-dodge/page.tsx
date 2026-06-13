import type { Metadata } from "next";
import { OneButtonDodgeGame } from "@/components/OneButtonDodgeGame";

export const metadata: Metadata = {
  title: "One Button Dodge",
  description:
    "A polished 30-second one-button reflex game with lane switching, combo scoring, near-dodge bonuses, and arcade feedback.",
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
