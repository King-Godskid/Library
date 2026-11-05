import { connection } from "next/server";
import { sql } from "@/db";

export async function GET() {
  // Always read fresh data from the database on every request.
  await connection();

  try {
    const rows = await sql`
      select
        books.id,
        books.title,
        books.year,
        authors.name as author,
        (loans.id is not null) as on_loan,
        members.name as borrower,
        to_char(loans.borrowed_on, 'YYYY-MM-DD') as borrowed_on,
        to_char(loans.due_on, 'YYYY-MM-DD') as due_on
      from books
      join authors on authors.id = books.author_id
      left join loans on loans.book_id = books.id and loans.returned_on is null
      left join members on members.id = loans.member_id
      order by books.title
    `;

    const books = rows.map((row) => ({
      id: row.id,
      title: row.title,
      year: row.year,
      author: row.author,
      onLoan: row.on_loan,
      borrower: row.borrower,
      borrowedOn: row.borrowed_on,
      dueOn: row.due_on,
    }));

    return Response.json(books, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "Could not load books." },
      { status: 500 }
    );
  }
}