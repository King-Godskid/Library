import { Suspense } from "react";
import { sql } from "@/db";
import Nav from "../Nav";
import AddMemberForm from "./AddMemberForm";
import MemberCard from "./MemberCard";

async function MemberList() {
  const members = await sql`
    select id, name, phone from members order by name
  `;

  return (
    <ul className="space-y-4">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={{ id: member.id, name: member.name, phone: member.phone }}
        />
      ))}
    </ul>
  );
}

export default function MembersPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Nav />
      <h1 className="mb-7 text-3xl font-bold tracking-tight text-blue-950 dark:text-slate-100">
        Members
      </h1>
      <AddMemberForm />
      <Suspense
        fallback={
          <p className="py-4 text-sm text-slate-600 dark:text-slate-300">
            Loading members...
          </p>
        }
      >
        <MemberList />
      </Suspense>
    </main>
  );
}