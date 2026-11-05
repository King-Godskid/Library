"use client";

import { useState, useActionState } from "react";
import { deleteBook, updateBook, type FormState } from "./actions";
import { lendBook, returnBook, type LoanFormState } from "./loan-actions";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
      <li className="rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-md active:translate-y-0">
        <form action={updateAction} className="space-y-3">
          <input type="hidden" name="id" value={book.id} />
          <input
            name="title"
            placeholder="Title"
            defaultValue={updateState.values?.title ?? book.title}
            className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 transition-colors duration-200 hover:border-teal-700 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
          />
          <input
            name="author"
            placeholder="Author"
            defaultValue={updateState.values?.author ?? book.author}
            className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 transition-colors duration-200 hover:border-teal-700 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
          />
          <input
            name="year"
            placeholder="Year"
            defaultValue={updateState.values?.year ?? String(book.year ?? "")}
            className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-500 transition-colors duration-200 hover:border-teal-700 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updating}
              className="min-h-10 rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-teal-900 active:translate-y-0 active:scale-[0.98] active:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {updating ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-10 rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium text-slate-700 transition duration-150 hover:border-stone-400 hover:bg-stone-100 active:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
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
    <li className="rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-md active:translate-y-0">
      <p className="font-semibold text-slate-800">
        {book.title}
        {book.year ? ` (${book.year})` : ""}
      </p>
      <p className="mt-1 text-sm text-slate-600">by {book.author}</p>
      <p className="mt-2">
        {book.borrower
          ? (
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
              {`On loan to ${book.borrower}, due ${book.due_on}`}
            </span>
          )
          : (
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
              Available
            </span>
          )}
      </p>

      {book.borrower ? (
        <form action={returnAction} className="mt-3">
          <input type="hidden" name="bookId" value={book.id} />
          <button
            type="submit"
            disabled={returning}
            className="min-h-10 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-indigo-800 active:translate-y-0 active:scale-[0.98] active:bg-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
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
            onChange={(e) => {
  if (e.target.value === "__add__") {
    e.target.value = "";
    router.push("/members");
  }
}}
            className="min-h-10 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors duration-200 hover:border-teal-700 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
          >
            <option value="">Choose member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
            <option value="__add__">+ Add a new member...</option>
          </select>
          <button
            type="submit"
            disabled={lending}
            className="min-h-10 rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-teal-900 active:translate-y-0 active:scale-[0.98] active:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
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

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-h-10 rounded-lg border border-slate-400 px-4 py-2 text-sm font-medium text-slate-700 transition duration-150 hover:border-teal-700 hover:bg-teal-50 hover:text-teal-900 active:scale-[0.98] active:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
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
            className="min-h-10 rounded-lg border border-red-700 px-4 py-2 text-sm font-medium text-red-700 transition duration-150 hover:bg-red-600 hover:text-white active:scale-[0.98] active:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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