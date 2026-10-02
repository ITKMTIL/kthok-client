import type { Metadata } from "next";
import { Mali } from "next/font/google";
import "./globals.css";

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "K-Thok — คุยกับเพื่อนใหม่ในรั้ว สจล.",
  description:
    "K-Thok (KMITL Thok) แชตนิรนามสำหรับชาว สจล. กดหาห้องแล้วจับคู่ให้ทันที เลือกคณะที่อยากคุยด้วยได้",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${mali.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
