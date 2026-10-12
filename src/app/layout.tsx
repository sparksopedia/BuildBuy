import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build or Buy — Structured Decision Rubric for Teams",
  description:
    "A free tool that helps product, engineering, and business teams evaluate whether to build internally or buy a commercial solution. Score dimensions, collect stakeholder input, and export results.",
  metadataBase: new URL("https://buildorbuy.app"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Build or Buy — Structured Decision Rubric",
    description:
      "Evaluate build vs. buy decisions with structured clarity. Free tool for product and strategy teams.",
    url: "https://buildorbuy.app",
    siteName: "Build or Buy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build or Buy — Decision Rubric Tool",
    description:
      "Evaluate build vs. buy decisions with structured clarity. Free for teams.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
