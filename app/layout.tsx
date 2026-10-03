import type { Metadata, Viewport } from "next";
import { Mali } from "next/font/google";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
});

const TITLE = "K-Thok — คุยกับเพื่อนใหม่ในรั้ว สจล.";
const DESCRIPTION =
  "K-Thok (KMITL Thok) แชตนิรนามสำหรับชาว สจล. กดหาห้องแล้วจับคู่ให้ทันที เลือกคณะที่อยากคุยด้วยได้";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "K-Thok",
  appleWebApp: { title: "K-Thok", capable: true },
  openGraph: {
    type: "website",
    siteName: "K-Thok",
    locale: "th_TH",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1c1a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${mali.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
