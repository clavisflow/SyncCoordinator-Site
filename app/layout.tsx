import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteOrigin, sitePath } from "./i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const englishPath = sitePath("/en");
const title = "SyncCoordinator Documentation | ClavisFlow";
const description =
  "Official documentation for ClavisFlow SyncCoordinator, an enterprise data synchronization platform.";

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  title,
  description,
  icons: {
    icon: sitePath("/sync-brand-mark.png"),
    shortcut: sitePath("/sync-brand-mark.png"),
  },
  openGraph: {
    type: "website",
    title,
    description,
    ...(siteOrigin ? { images: [{ url: `${siteOrigin}${sitePath("/og.png")}`, width: 1200, height: 630 }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(siteOrigin ? { images: [`${siteOrigin}${sitePath("/og.png")}`] } : {}),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `const p=${JSON.stringify(englishPath)};document.documentElement.lang=(location.pathname===p||location.pathname.startsWith(p+'/'))?'en':'ja';`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
