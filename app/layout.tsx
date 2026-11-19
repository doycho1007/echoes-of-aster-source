import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "별의 잔향 · Echoes of Aster",
  description: "달이 멈춘 밤, 잊힌 별을 찾아 떠나는 픽셀 판타지 JRPG.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
