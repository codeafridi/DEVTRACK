import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevTrack — Developer Progress Tracker",
  description:
    "Track your skills, projects, and growth as a developer. A personal operating system for ambitious engineers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DevTrack",
  },
  openGraph: {
    title: "DevTrack — Your Personal Developer OS",
    description:
      "Track skills, projects, coding hours, GitHub activity, and streaks. All in one dashboard.",
    url: "https://www.devtrack.site",
    siteName: "DevTrack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTrack — Your Personal Developer OS",
    description:
      "Track skills, projects, coding hours, GitHub activity, and streaks. All in one dashboard.",
  },
  metadataBase: new URL("https://www.devtrack.site"),
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
//do not remove this analytics code