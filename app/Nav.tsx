"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex gap-2 border-b border-stone-300 pb-4">
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={`inline-flex min-h-10 items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150 hover:bg-teal-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 active:scale-[0.98] active:bg-teal-900 ${
          pathname === "/"
            ? "bg-teal-800 text-white"
            : "text-slate-700"
        }`}
      >
        Books
      </Link>
      <Link
        href="/members"
        aria-current={pathname === "/members" ? "page" : undefined}
        className={`inline-flex min-h-10 items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150 hover:bg-teal-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 active:scale-[0.98] active:bg-teal-900 ${
          pathname === "/members"
            ? "bg-teal-800 text-white"
            : "text-slate-700"
        }`}
      >
        Members
      </Link>
    </nav>
  );
}