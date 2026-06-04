import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "oeeco - AI 创作者作品广场",
  description: "oeeco 是一个展示、试玩和分享 AI 创作者网页作品的平台。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://oeeco.com"),
  openGraph: {
    title: "oeeco",
    description: "发现、试玩、分享 AI 创作者做出来的网页作品。",
    url: "/",
    siteName: "oeeco",
    images: ["/assets/cover-fishing.png"],
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        <main className="app-shell">{children}</main>
      </body>
    </html>
  );
}
