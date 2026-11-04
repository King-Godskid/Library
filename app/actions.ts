"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/db";

export type FormState = {
  ok: boolean;
  message: string;
  values?: { title: string; author: string; year: string };
};

export async function addBook(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const yearText = String(formData.get("year") ?? "").trim();
  const values = { title, author, year: yearText };

  if (!title) {
    return { ok: false, message: "Please enter a title.", values };
  }
  if (!author) {
    return { ok: false, message: "Please enter an author.", values };
  }

  let year: number | null = null;
  if (yearText) {
    year = Number(yearText);
    const thisYear = new Date().getFullYear();
    if (!Number.isInteger(year) || year < 1000 || year > thisYear) {
      return {
        ok: false,
        message: `Year must be a whole number between 1000 and ${thisYear}.`,
        values,
      };
    }
  }

  await sql.begin(async (tx) => {
    const existing = await tx`
      select id from authors where lower(name) = lower(${author})
    `;
    const authorId =
      existing.length > 0
        ? existing[0].id
        : (
            await tx`
              insert into authors (name) values (${author}) returning id
            `
          )[0].id;

    await tx`
      insert into books (title, year, author_id)
      values (${title}, ${year}, ${authorId})
    `;
  });

  revalidatePath("/");
  return { ok: true, message: `"${title}" was added.` };
}