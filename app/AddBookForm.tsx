"use client";

import { useActionState } from "react";
import { addBook, type FormState } from "./actions";

const initial: FormState = { ok: false, message: "" };

export default function AddBookForm() {
  const [state, formAction, pending] = useActionState(addBook, initial);

  return (
    <form action={formAction} className="mb-8 space-y-3 rounded-lg border p-4">
      <h2 className="font-semibold">Add a book</h2>
      <input
        name="title"
        placeholder="Title"
        defaultValue={state.values?.title}
        className="w-full rounded border p-2"
      />
      <input
        name="author"
        placeholder="Author"
        defaultValue={state.values?.author}
        className="w-full rounded border p-2"
      />
      <input
        name="year"
        placeholder="Year (for example 1987)"
        defaultValue={state.values?.year}
        className="w-full rounded border p-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Add book"}
      </button>
      {state.message && (
        <p className={state.ok ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}
    </form>
  );
}