"use client";

import { useState, useActionState } from "react";
import {
  deleteMember,
  updateMember,
  type MemberFormState,
} from "../member-actions";

type Member = {
  id: number;
  name: string;
  phone: string | null;
};

const initial: MemberFormState = { ok: false, message: "" };

export default function MemberCard({ member }: { member: Member }) {
  const [editing, setEditing] = useState(false);
  const [updateState, updateAction, updating] = useActionState(
    async (prev: MemberFormState, formData: FormData) => {
      const result = await updateMember(prev, formData);
      if (result.ok) setEditing(false);
      return result;
    },
    initial
  );
  const [deleteState, deleteAction, deleting] = useActionState(
    deleteMember,
    initial
  );

  if (editing) {
    return (
      <li className="rounded-2xl border border-white/25 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-4 text-white shadow-[0_16px_34px_rgba(15,45,82,0.22)] backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_20px_40px_rgba(15,45,82,0.32)] active:translate-y-0 dark:border-sky-400/20 dark:bg-slate-900/60 dark:bg-none sm:p-5">
        <form action={updateAction} className="space-y-3">
          <input type="hidden" name="id" value={member.id} />
          <input
            name="name"
            placeholder="Name"
            defaultValue={updateState.values?.name ?? member.name}
            className="min-h-11 w-full rounded-xl border border-blue-200/80 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-500 transition-colors duration-150 hover:border-sky-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 dark:border-sky-400/25 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-sky-400"
          />
          <input
            name="phone"
            placeholder="Phone number (optional)"
            defaultValue={updateState.values?.phone ?? member.phone ?? ""}
            className="min-h-11 w-full rounded-xl border border-blue-200/80 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-500 transition-colors duration-150 hover:border-sky-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 dark:border-sky-400/25 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-sky-400"
          />
          <div className="flex flex-wrap gap-2">
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
            <p className="text-sm text-red-100">{updateState.message}</p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-white/25 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-4 text-white shadow-[0_16px_34px_rgba(15,45,82,0.22)] backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_20px_40px_rgba(15,45,82,0.32)] active:translate-y-0 dark:border-sky-400/20 dark:bg-slate-900/60 dark:bg-none sm:p-5">
      <p className="break-words font-semibold text-white dark:text-slate-100">
        {member.name}
      </p>
      <p className="mt-1 break-words text-sm text-blue-100/80">
        {member.phone ? member.phone : "No phone number"}
      </p>

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
          onSubmit={(event) => {
            if (!confirm(`Delete "${member.name}"?`)) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={member.id} />
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
