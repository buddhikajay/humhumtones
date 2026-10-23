import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import wordmark from "@/assets/wordmark.png";
import wordmarkDark from "@/assets/wordmark-dark.png";
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
  title: "HumHumTones: hear it, name the note",
  description: "Train your ear to recognize musical notes. Listen, guess, and track your progress.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" aria-label="HumHumTones home">
              <Image src={wordmark} alt="HumHumTones" priority className="h-8 w-auto dark:hidden" />
              <Image src={wordmarkDark} alt="HumHumTones" priority className="hidden h-8 w-auto dark:block" />
            </Link>
            <div className="flex gap-5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Link href="/" className="hover:text-zinc-950 dark:hover:text-white">
                Train
              </Link>
              <Link href="/stats" className="hover:text-zinc-950 dark:hover:text-white">
                Stats
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
