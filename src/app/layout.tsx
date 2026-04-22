import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "靴卸売 販売在庫管理",
  description: "靴の卸売業向け販売在庫管理システム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
