"use client";

export default function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      onClick={() => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      }}
      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-blue-200/80 bg-white/60 text-blue-900 shadow-sm backdrop-blur transition duration-200 hover:border-sky-400 hover:bg-sky-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7fc] dark:border-sky-400/25 dark:bg-slate-900/60 dark:text-sky-100 dark:hover:border-sky-300 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5 dark:hidden"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="hidden h-5 w-5 dark:block"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z"
        />
      </svg>
    </button>
  );
}
