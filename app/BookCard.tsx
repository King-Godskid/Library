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
      <li className="rounded-2xl border border-white/25 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-5 text-white shadow-[0_16px_34px_rgba(15,45,82,0.22)] backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_20px_40px_rgba(15,45,82,0.32)] active:translate-y-0 dark:border-sky-400/20 dark:bg-slate-900/60 dark:bg-none">
        <form action={updateAction} className="space-y-3">
          <input type="hidden" name="id" value={book.id} />
          <input
            name="title"
            placeholder="Title"
            defaultValue={updateState.values?.title ?? book.title}
            className="min-h-11 w-full rounded-xl border border-blue-200/80 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-500 transition-colors duration-150 hover:border-sky-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 dark:border-sky-400/25 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-sky-400"
          />
          <input
            name="author"
            placeholder="Author"
            defaultValue={updateState.values?.author ?? book.author}
            className="min-h-11 w-full rounded-xl border border-blue-200/80 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-500 transition-colors duration-150 hover:border-sky-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 dark:border-sky-400/25 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-sky-400"
          />
          <input
            name="year"
            placeholder="Year"
            defaultValue={updateState.values?.year ?? String(book.year ?? "")}
            className="min-h-11 w-full rounded-xl border border-blue-200/80 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-500 transition-colors duration-150 hover:border-sky-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 dark:border-sky-400/25 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-sky-400"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updating}
              className="min-h-10 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.25)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:to-blue-500 hover:shadow-[0_12px_24px_rgba(37,99,235,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {updating ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-10 rounded-xl border border-sky-200 bg-transparent px-4 py-2 font-medium text-sky-100 transition duration-200 hover:border-sky-300 hover:bg-sky-100 hover:text-blue-950 active:scale-95 active:bg-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              Cancel
            </button>
          </div>
          {updateState.message && !updateState.ok && (
            <p className="text-red-100">{updateState.message}</p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-white/25 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-5 text-white shadow-[0_16px_34px_rgba(15,45,82,0.22)] backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_20px_40px_rgba(15,45,82,0.32)] active:translate-y-0 dark:border-sky-400/20 dark:bg-slate-900/60 dark:bg-none">
      <p className="font-semibold text-white dark:text-slate-100">
        {book.title}
        {book.year ? ` (${book.year})` : ""}
      </p>
      <p className="mt-1 text-sm text-blue-100/80">by {book.author}</p>
      <p className="mt-2">
        {book.borrower
          ? (
            <span className="inline-block rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-950">
              {`On loan to ${book.borrower}, due ${book.due_on}`}
            </span>
          )
          : (
            <span className="inline-block rounded-full bg-emerald-300 px-3 py-1 text-sm font-bold text-emerald-950">
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
            className="min-h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(124,58,237,0.28)] transition duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_12px_24px_rgba(124,58,237,0.4)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="min-h-10 rounded-xl border border-blue-200/80 bg-white/90 px-4 py-2 text-sm text-slate-900 transition-colors duration-150 hover:border-sky-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 dark:border-sky-400/25 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-sky-400"
          >
            <option value="" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              Choose member
            </option>
            {members.map((member) => (
              <option
                key={member.id}
                value={member.id}
                className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
              >
                {member.name}
              </option>
            ))}
            <option
              value="__add__"
              className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            >
              + Add a new member...
            </option>
          </select>
          <button
            type="submit"
            disabled={lending}
            className="min-h-10 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.25)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:to-blue-500 hover:shadow-[0_12px_24px_rgba(37,99,235,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {lending ? "Saving..." : "Lend for 14 days"}
          </button>
        </form>
      )}

      {lendState.message && !lendState.ok && (
        <p className="mt-2 text-sm text-red-100">{lendState.message}</p>
      )}
      {returnState.message && !returnState.ok && (
        <p className="mt-2 text-sm text-red-100">{returnState.message}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-h-10 rounded-xl border border-sky-200 bg-transparent px-4 py-2 text-sm font-medium text-sky-100 transition duration-200 hover:border-sky-300 hover:bg-sky-100 hover:text-blue-950 active:scale-95 active:bg-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
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
            className="min-h-10 rounded-xl border border-red-300 bg-transparent px-4 py-2 text-sm font-medium text-red-100 transition duration-200 hover:bg-red-600 hover:text-white active:scale-95 active:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </form>
      </div>

      {deleteState.message && !deleteState.ok && (
        <p className="mt-2 text-sm text-red-100">{deleteState.message}</p>
      )}
    </li>
  );
}