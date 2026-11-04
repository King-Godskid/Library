"use client";

import { useState, useActionState } from "react";
import { deleteBook, updateBook, type FormState } from "./actions";
import { lendBook, returnBook, type LoanFormState } from "./loan-actions";

type Book = {
  id: number;
  title: string;
  year: number | null;
  author: string;
  borrower: string | null;
  due_on: string | null;
};

type Member = { id: number; name: string };

const initial: FormState = { ok: false, message: "" };
const initialLoan: LoanFormState = { ok: false, message: "" };

export default function BookCard({
  book,
  members,
}: {
  book: Book;
  members: Member[];
}) {
  const [editing, setEditing] = useState(false);

  const [updateState, updateAction, updating] = useActionState(
    async (prev: FormState, formData: FormData) => {
      const result = await updateBook(prev, formData);
      if (result.ok) setEditing(false);
      return result;
    },
    initial
  );

  const [deleteState, deleteAction, deleting] = useActionState(
    deleteBook,
    initial
  );
  const [lendState, lendAction, lending] = useActionState(
    lendBook,
    initialLoan
  );
  const [returnState, returnAction, returning] = useActionState(
    returnBook,
    initialLoan
  );

  if (editing) {
    return (
      <li className="rounded-lg border p-4">
        <form action={updateAction} className="space-y-3">
          <input type="hidden" name="id" value={book.id} />
          <input
            name="title"
            placeholder="Title"
            defaultValue={updateState.values?.title ?? book.title}
            className="w-full rounded border p-2"
          />
          <input
            name="author"
            placeholder="Author"
            defaultValue={updateState.values?.author ?? book.author}
            className="w-full rounded border p-2"
          />
          <input
            name="year"
            placeholder="Year"
            defaultValue={updateState.values?.year ?? String(book.year ?? "")}
            className="w-full rounded border p-2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updating}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>
          </div>
          {updateState.message && !updateState.ok && (
            <p className="text-red-600">{updateState.message}</p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-lg border p-4">
      <p className="font-semibold">
        {book.title}
        {book.year ? ` (${book.year})` : ""}
      </p>
      <p className="text-sm text-gray-600">by {book.author}</p>
      <p
        className={
          book.borrower ? "text-sm text-red-600" : "text-sm text-green-600"
        }
      >
        {book.borrower
          ? `On loan to ${book.borrower}, due ${book.due_on}`
          : "Available"}
      </p>

      {book.borrower ? (
        <form action={returnAction} className="mt-3">
          <input type="hidden" name="bookId" value={book.id} />
          <button
            type="submit"
            disabled={returning}
            className="rounded bg-green-700 px-3 py-1 text-sm text-white disabled:opacity-50"
          >
            {returning ? "Saving..." : "Record return"}
          </button>
        </form>
      ) : (
        <form action={lendAction} className="mt-3 flex flex-wrap gap-2">
          <input type="hidden" name="bookId" value={book.id} />
          <select
            name="memberId"
            defaultValue=""
            className="rounded border p-1 text-sm"
          >
            <option value="">Choose member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={lending}
            className="rounded bg-black px-3 py-1 text-sm text-white disabled:opacity-50"
          >
            {lending ? "Saving..." : "Lend for 14 days"}
          </button>
        </form>
      )}

      {lendState.message && !lendState.ok && (
        <p className="mt-2 text-sm text-red-600">{lendState.message}</p>
      )}
      {returnState.message && !returnState.ok && (
        <p className="mt-2 text-sm text-red-600">{returnState.message}</p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded border px-3 py-1 text-sm"
        >
          Edit
        </button>
        <form
          action={deleteAction}
          onSubmit={(e) => {
            if (!confirm(`Delete "${book.title}"?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={book.id} />
          <button
            type="submit"
            disabled={deleting}
            className="rounded border border-red-600 px-3 py-1 text-sm text-red-600 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </form>
      </div>

      {deleteState.message && !deleteState.ok && (
        <p className="mt-2 text-sm text-red-600">{deleteState.message}</p>
      )}
    </li>
  );
}