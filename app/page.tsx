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
      to_char(loans.due_on, 'DD Mon YYYY') as due_on
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
    <ul className="space-y-4">
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
          }}
        />
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Nav />
      <h1 className="mb-7 text-3xl font-bold tracking-tight text-slate-800">
        Library
      </h1>
      <AddBookForm />
      <Suspense
        fallback={<p className="py-4 text-sm text-slate-600">Loading books...</p>}
      >
        <BookList />
      </Suspense>
    </main>
  );
}