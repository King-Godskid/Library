"use client";

import { useActionState } from "react";
import { addMember, type MemberFormState } from "../member-actions";

const initial: MemberFormState = { ok: false, message: "" };

export default function AddMemberForm() {
  const [state, formAction, pending] = useActionState(addMember, initial);

  return (
    <form action={formAction} className="mb-8 space-y-3 rounded-lg border p-4">
      <h2 className="font-semibold">Add a member</h2>
      <input
        name="name"
        placeholder="Name"
        defaultValue={state.values?.name}
        className="w-full rounded border p-2"
      />
      <input
        name="phone"
        placeholder="Phone number (optional)"
        defaultValue={state.values?.phone}
        className="w-full rounded border p-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
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