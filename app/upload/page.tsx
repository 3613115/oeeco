import type { Metadata } from "next";
import { UploadForm } from "@/components/UploadForm";

export const metadata: Metadata = {
  title: "Submit Work",
  description: "Submit an AI-made game, web tool, interactive page, or creative experiment to oeeco.",
  alternates: {
    canonical: "/upload",
  },
};

export default function UploadPage() {
  return <UploadForm />;
}
