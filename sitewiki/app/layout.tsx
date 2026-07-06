import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "한국 웹사이트 검색",
  description: "한국의 다양한 웹사이트를 한 곳에서 검색하고 발견하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 dark:bg-neutral-900">
        {children}
      </body>
    </html>
  );
}
