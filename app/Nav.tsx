"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex items-center justify-between border-b border-blue-200/80 pb-4 dark:border-white/10">
      <div className="flex gap-2">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className={`inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 hover:bg-sky-100 hover:text-blue-950 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7fc] dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-offset-slate-950 ${
            pathname === "/"
              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-blue-900/20 hover:from-sky-400 hover:to-blue-500 dark:hover:text-white"
              : "text-blue-900 dark:text-slate-300"
          }`}
        >
          Books
        </Link>
        <Link
          href="/members"
          aria-current={pathname === "/members" ? "page" : undefined}
          className={`inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 hover:bg-sky-100 hover:text-blue-950 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7fc] dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-offset-slate-950 ${
            pathname === "/members"
              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-blue-900/20 hover:from-sky-400 hover:to-blue-500 dark:hover:text-white"
              : "text-blue-900 dark:text-slate-300"
          }`}
        >
          Members
        </Link>
      </div>
      <ThemeToggle />
    </nav>
  );
}