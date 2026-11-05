import { Suspense } from "react";
import { sql } from "@/db";
import AddBookForm from "./AddBookForm";
import BookCard from "./BookCard";
import Nav from "./Nav";

async function BookList() {
  const books = await sql`
    select
      books.id,
      books.title,
      books.year,
      authors.name as author,
      members.name as borrower,
      to_char(loans.due_on, 'DD Mon YYYY') as due_on,
      to_char(loans.borrowed_on, 'DD Mon YYYY') as borrowed_on
    from books
    join authors on authors.id = books.author_id
    left join loans on loans.book_id = books.id and loans.returned_on is null
    left join members on members.id = loans.member_id
    order by books.title
  `;

  const memberRows = await sql`
    select id, name from members order by name
  `;
  const members = memberRows.map((m) => ({ id: m.id, name: m.name }));

  return (
    <ul className="space-y-3 sm:space-y-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          members={members}
          book={{
            id: book.id,
            title: book.title,
            year: book.year,
            author: book.author,
            borrower: book.borrower,
            due_on: book.due_on,
            borrowed_on: book.borrowed_on,
          }}
        />
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <Nav />
      <header className="relative isolate mb-6 overflow-hidden rounded-[1.75rem] border border-blue-900/20 bg-gradient-to-br from-[#102b55] via-[#174783] to-[#2563a8] px-5 py-6 shadow-[0_20px_45px_rgba(16,43,85,0.22)] sm:mb-8 sm:px-8 sm:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_48%,rgba(96,165,250,0.26),transparent_34%),linear-gradient(115deg,transparent_54%,rgba(255,255,255,0.06)_54.2%,transparent_54.5%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full border border-white/10 sm:-right-8 sm:-top-24 sm:h-72 sm:w-72"
        />
        <div className="relative flex min-w-0 items-center justify-between gap-3 sm:gap-5">
          <div className="min-w-0 flex-1">
            <p className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-200/25 bg-white/10 px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.17em] text-sky-100 sm:text-xs">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.8)]" />
              LIBRARY MANAGEMENT SYSTEM
            </p>
            <h1 className="font-serif text-3xl font-semibold leading-none tracking-[-0.045em] text-white sm:text-5xl">
              Shelf<span className="text-sky-300">Track</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-blue-100 sm:mt-5 sm:text-base sm:leading-7">
              A smart library management platform for organizing books,
              managing members, tracking borrowed books and recording returns.
            </p>
            <div className="mt-5 h-px w-16 bg-gradient-to-r from-sky-300 to-transparent sm:mt-6" />
          </div>

          <div
            aria-hidden="true"
            className="relative mr-[-0.75rem] hidden h-24 w-20 shrink-0 items-center justify-center min-[400px]:flex sm:mr-0 sm:h-40 sm:w-40"
          >
            <div className="absolute h-16 w-16 rounded-full bg-sky-300/20 blur-2xl sm:h-32 sm:w-32" />
            <div className="absolute h-14 w-14 rotate-[-12deg] rounded-2xl border border-white/15 bg-blue-950/25 sm:h-28 sm:w-28" />
            <svg
              viewBox="0 0 120 100"
              fill="none"
              className="relative w-full drop-shadow-[0_14px_18px_rgba(5,20,45,0.35)]"
            >
              <path
                d="M60 29c-13-9-29-11-45-7v47c17-4 32-1 45 9 13-10 28-13 45-9V22c-16-4-32-2-45 7Z"
                fill="#F8FAFC"
                fillOpacity=".97"
              />
              <path
                d="M60 29v49M23 33c11-2 22 0 31 5M23 43c11-2 22 0 31 5M97 33c-11-2-22 0-31 5M97 43c-11-2-22 0-31 5"
                stroke="#7AADE0"
                strokeLinecap="round"
                strokeWidth="2"
              />
              <path
                d="M60 29c-13-9-29-11-45-7v47c17-4 32-1 45 9 13-10 28-13 45-9V22c-16-4-32-2-45 7Z"
                stroke="white"
                strokeOpacity=".9"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="absolute bottom-1 right-0 h-2 w-2 rounded-full bg-sky-200 shadow-[0_0_12px_rgba(186,230,253,0.9)] sm:bottom-4 sm:right-2" />
          </div>
        </div>
      </header>
      <AddBookForm />
      <Suspense
        fallback={
          <p className="py-4 text-sm text-slate-600 dark:text-slate-300">
            Loading books...
          </p>
        }
      >
        <BookList />
      </Suspense>
    </main>
  );
}