"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/db";

export type FormState = {
  ok: boolean;
  message: string;
  values?: { title: string; author: string; year: string };
};

function validateBook(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const yearText = String(formData.get("year") ?? "").trim();
  const values = { title, author, year: yearText };

  let year: number | null = null;
  let error: string | null = null;

  if (!title) {
    error = "Please enter a title.";
  } else if (!author) {
    error = "Please enter an author.";
  } else if (yearText) {
    const n = Number(yearText);
    const thisYear = new Date().getFullYear();
    if (!Number.isInteger(n) || n < 1000 || n > thisYear) {
      error = `Year must be a whole number between 1000 and ${thisYear}.`;
    } else {
      year = n;
    }
  }

  return { values, year, error };
}

export async function addBook(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { values, year, error } = validateBook(formData);
  if (error) return { ok: false, message: error, values };

  await sql.begin(async (tx) => {
    const existing = await tx`
      select id from authors where lower(name) = lower(${values.author})
    `;
    const authorId =
      existing.length > 0
        ? existing[0].id
        : (
            await tx`
              insert into authors (name) values (${values.author}) returning id
            `
          )[0].id;

    await tx`
      insert into books (title, year, author_id)
      values (${values.title}, ${year}, ${authorId})
    `;
  });

  revalidatePath("/");
  return { ok: true, message: `"${values.title}" was added.` };
}

export async function updateBook(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("id"));
  const { values, year, error } = validateBook(formData);

  if (!Number.isInteger(id)) {
    return { ok: false, message: "Book not found.", values };
  }
  if (error) return { ok: false, message: error, values };

  const found = await sql`select id from books where id = ${id}`;
  if (found.length === 0) {
    return { ok: false, message: "Book not found.", values };
  }

  await sql.begin(async (tx) => {
    const existing = await tx`
      select id from authors where lower(name) = lower(${values.author})
    `;
    const authorId =
      existing.length > 0
        ? existing[0].id
        : (
            await tx`
              insert into authors (name) values (${values.author}) returning id
            `
          )[0].id;

    await tx`
      update books
      set title = ${values.title}, year = ${year}, author_id = ${authorId}
      where id = ${id}
    `;
  });

  revalidatePath("/");
  return { ok: true, message: "Book updated." };
}

export async function deleteBook(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    return { ok: false, message: "Book not found." };
  }

  const open = await sql`
    select 1 from loans where book_id = ${id} and returned_on is null
  `;
  if (open.length > 0) {
    return {
      ok: false,
      message: "This book is on loan, so it can't be deleted until it comes back.",
    };
  }

  await sql`delete from books where id = ${id}`;

  revalidatePath("/");
  return { ok: true, message: "Book deleted." };
}