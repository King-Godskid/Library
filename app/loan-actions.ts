"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/db";

export type LoanFormState = {
  ok: boolean;
  message: string;
};

export async function lendBook(
  _prev: LoanFormState,
  formData: FormData
): Promise<LoanFormState> {
  const bookText = String(formData.get("bookId") ?? "");
  const memberText = String(formData.get("memberId") ?? "");

  if (!memberText) {
    return { ok: false, message: "Please choose a member." };
  }

  const bookId = Number(bookText);
  const memberId = Number(memberText);
  if (!Number.isInteger(bookId) || !Number.isInteger(memberId)) {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  try {
    await sql`
      insert into loans (book_id, member_id, due_on)
      values (${bookId}, ${memberId}, current_date + 14)
    `;
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "23505") {
      return { ok: false, message: "This book is already on loan." };
    }
    if (code === "23503") {
      return { ok: false, message: "That book or member no longer exists." };
    }
    throw err;
  }

  revalidatePath("/");
  return { ok: true, message: "Book lent." };
}

export async function returnBook(
  _prev: LoanFormState,
  formData: FormData
): Promise<LoanFormState> {
  const bookId = Number(formData.get("bookId"));
  if (!Number.isInteger(bookId)) {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  const updated = await sql`
    update loans
    set returned_on = current_date
    where book_id = ${bookId} and returned_on is null
    returning id
  `;

  if (updated.length === 0) {
    return { ok: false, message: "This book isn't on loan." };
  }

  revalidatePath("/");
  return { ok: true, message: "Book returned." };
}