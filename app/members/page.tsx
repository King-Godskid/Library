import { Suspense } from "react";
import { sql } from "@/db";
import Nav from "../Nav";
import AddMemberForm from "./AddMemberForm";

async function MemberList() {
  const members = await sql`
    select id, name, phone from members order by name
  `;

  return (
    <ul className="space-y-3">
      {members.map((member) => (
        <li key={member.id} className="rounded-lg border p-4">
          <p className="font-semibold">{member.name}</p>
          <p className="text-sm text-gray-600">
            {member.phone ? member.phone : "No phone number"}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function MembersPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Nav />
      <h1 className="mb-6 text-2xl font-bold">Members</h1>
      <AddMemberForm />
      <Suspense fallback={<p>Loading members...</p>}>
        <MemberList />
      </Suspense>
    </main>
  );
}