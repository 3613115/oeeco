import type { Metadata } from "next";
import { AIPromptCardGenerator } from "@/components/AIPromptCardGenerator";

export const metadata: Metadata = {
  title: "AI Prompt Card Generator",
  description:
    "A practical prompt builder that turns a goal, tone, output format, and topic into a reusable AI prompt card.",
  alternates: {
    canonical: "/demos/ai-prompt-card-generator",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function AIPromptCardGeneratorDemoPage() {
  return <AIPromptCardGenerator />;
}
