import { Suspense } from "react";
import { sql } from "@/db";
import AddBookForm from "./AddBookForm";

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

  return (
    <ul className="space-y-3">
      {books.map((book) => (
        <li key={book.id} className="rounded-lg border p-4">
          <p className="font-semibold">
            {book.title}
            {book.year ? ` (${book.year})` : ""}
          </p>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p
            className={
              book.borrower
                ? "text-sm text-red-600"
                : "text-sm text-green-600"
            }
          >
            {book.borrower
              ? `On loan to ${book.borrower}, due ${book.due_on}`
              : "Available"}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Library</h1>
      <AddBookForm />
      <Suspense fallback={<p>Loading books...</p>}>
        <BookList />
      </Suspense>
    </main>
  );
}