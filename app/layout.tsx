import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "oeeco - Explore AI-Made Web Works",
  description:
    "oeeco is a global gallery for AI-made games, web tools, interactive pages, and creative experiments.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://oeeco.com"),
  openGraph: {
    title: "oeeco",
    description: "Discover, try, and share web works made by AI-assisted creators.",
    url: "/",
    siteName: "oeeco",
    images: ["/assets/cover-fishing.png"],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="app-shell">{children}</main>
      </body>
    </html>
  );
}
