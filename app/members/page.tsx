import { Suspense } from "react";
import { sql } from "@/db";
import Nav from "../Nav";
import AddMemberForm from "./AddMemberForm";

async function MemberList() {
  const members = await sql`
    select id, name, phone from members order by name
  `;

  return (
    <ul className="space-y-4">
      {members.map((member) => (
        <li
          key={member.id}
          className="rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-md active:translate-y-0"
        >
          <p className="font-semibold text-slate-800">{member.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            {member.phone ? member.phone : "No phone number"}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function MembersPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Nav />
      <h1 className="mb-7 text-3xl font-bold tracking-tight text-slate-800">
        Members
      </h1>
      <AddMemberForm />
      <Suspense
        fallback={
          <p className="py-4 text-sm text-slate-600">Loading members...</p>
        }
      >
        <MemberList />
      </Suspense>
    </main>
  );
}