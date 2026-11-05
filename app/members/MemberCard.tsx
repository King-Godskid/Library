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
      <li className="rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-md active:translate-y-0">
        <form action={updateAction} className="space-y-3">
          <input type="hidden" name="id" value={member.id} />
          <input
            name="name"
            placeholder="Name"
            defaultValue={updateState.values?.name ?? member.name}
            className="min-h-11 w-full rounded-lg border border-stone-300 bg-white p-3 text-slate-800 placeholder:text-slate-500 transition-colors duration-150 hover:border-teal-700 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
          />
          <input
            name="phone"
            placeholder="Phone number (optional)"
            defaultValue={updateState.values?.phone ?? member.phone ?? ""}
            className="min-h-11 w-full rounded-lg border border-stone-300 bg-white p-3 text-slate-800 placeholder:text-slate-500 transition-colors duration-150 hover:border-teal-700 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
          />
          <div className="flex flex-wrap gap-2">
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
              className="min-h-10 rounded-lg border border-slate-400 bg-transparent px-4 py-2 font-medium text-slate-700 transition duration-150 hover:border-teal-700 hover:bg-teal-50 hover:text-teal-900 active:scale-[0.98] active:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          </div>
          {updateState.message && !updateState.ok && (
            <p className="text-sm text-red-600">{updateState.message}</p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-md active:translate-y-0">
      <p className="font-semibold text-slate-800">{member.name}</p>
      <p className="mt-1 text-sm text-slate-600">
        {member.phone ? member.phone : "No phone number"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-h-10 rounded-lg border border-slate-400 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition duration-150 hover:border-teal-700 hover:bg-teal-50 hover:text-teal-900 active:scale-[0.98] active:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
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
            className="min-h-10 rounded-lg border border-red-700 bg-transparent px-4 py-2 text-sm font-medium text-red-700 transition duration-150 hover:bg-red-600 hover:text-white active:scale-[0.98] active:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
