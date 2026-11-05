"use client";

import { useActionState } from "react";
import { addMember, type MemberFormState } from "../member-actions";

const initial: MemberFormState = { ok: false, message: "" };

export default function AddMemberForm() {
  const [state, formAction, pending] = useActionState(addMember, initial);

  return (
    <form
      action={formAction}
      className="mb-8 space-y-4 rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm transition duration-200 hover:border-teal-700 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-slate-800">Add a member</h2>
      <input
        name="name"
        placeholder="Name"
        defaultValue={state.values?.name}
        className="min-h-11 w-full rounded-lg border border-stone-300 bg-white p-3 text-slate-800 placeholder:text-slate-500 transition-colors duration-150 hover:border-teal-700 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
      />
      <input
        name="phone"
        placeholder="Phone number (optional)"
        defaultValue={state.values?.phone}
        className="min-h-11 w-full rounded-lg border border-stone-300 bg-white p-3 text-slate-800 placeholder:text-slate-500 transition-colors duration-150 hover:border-teal-700 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-10 rounded-lg bg-teal-800 px-5 py-2 font-semibold text-white shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-teal-900 active:translate-y-0 active:scale-[0.98] active:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {pending ? "Saving..." : "Add member"}
      </button>
      {state.message && (
        <p className={state.ok ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}
    </form>
  );
}