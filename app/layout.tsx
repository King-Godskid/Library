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
  title: "ShelfTrack",
  description:
    "A smart library management platform for organizing books, managing members, tracking borrowed books and recording returns.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var theme=null;try{theme=localStorage.getItem("theme")}catch{}var dark=theme==="dark"||(theme!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark)})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-gradient-to-br from-[#fffdf7] via-[#f4f7fc] to-[#e6eefb] text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
