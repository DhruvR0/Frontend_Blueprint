import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";
import ErrorHandler from "@/components/ErrorHandler";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Studio Architecture & Design",
  description: "Creative architecture and design studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-black text-white antialiased min-h-screen overflow-x-hidden">
        <ErrorHandler />
        <Preloader>
          <SmoothScroll>
            <Navbar />
            <PageTransition>
              <main className="min-h-screen w-full">{children}</main>
            </PageTransition>
          </SmoothScroll>
        </Preloader>
      </body>
    </html>
  );
}
