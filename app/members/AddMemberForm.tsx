"use client";

import { useActionState } from "react";
import { addMember, type MemberFormState } from "../member-actions";

const initial: MemberFormState = { ok: false, message: "" };

export default function AddMemberForm() {
  const [state, formAction, pending] = useActionState(addMember, initial);

  return (
    <form
      action={formAction}
      className="mb-8 space-y-4 rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[0_12px_30px_rgba(30,64,110,0.12)] backdrop-blur-md transition duration-200 hover:border-sky-300 hover:shadow-[0_16px_36px_rgba(30,64,110,0.18)] dark:border-sky-400/20 dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-sky-300/40"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Add a member
      </h2>
      <input
        name="name"
        placeholder="Name"
        defaultValue={state.values?.name}
        className="min-h-11 w-full rounded-xl border border-blue-200/80 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 transition-colors duration-150 hover:border-sky-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 dark:border-sky-400/25 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-sky-400 dark:focus-visible:ring-sky-400/70"
      />
      <input
        name="phone"
        placeholder="Phone number (optional)"
        defaultValue={state.values?.phone}
        className="min-h-11 w-full rounded-xl border border-blue-200/80 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 transition-colors duration-150 hover:border-sky-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 dark:border-sky-400/25 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-sky-400 dark:focus-visible:ring-sky-400/70"
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-10 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2 font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.25)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:to-blue-500 hover:shadow-[0_12px_24px_rgba(37,99,235,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:focus-visible:ring-offset-slate-900"
      >
        {pending ? "Saving..." : "Add member"}
      </button>
      {state.message && (
        <p
          className={
            state.ok
              ? "font-medium text-green-700 dark:text-green-300"
              : "font-medium text-red-700 dark:text-red-300"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}