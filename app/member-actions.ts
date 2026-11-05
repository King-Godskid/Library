"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/db";

export type MemberFormState = {
  ok: boolean;
  message: string;
  values?: { name: string; phone: string };
};

export async function addMember(
  _prev: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const values = { name, phone };

  if (!name) {
    return { ok: false, message: "Please enter the member's name.", values };
  }

  await sql`
    insert into members (name, phone)
    values (${name}, ${phone === "" ? null : phone})
  `;

  revalidatePath("/members");
  revalidatePath("/");
  return { ok: true, message: `${name} was added.` };
}

export async function updateMember(
  _prev: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const rawId = formData.get("id");
  const id = typeof rawId === "string" ? Number(rawId) : NaN;
  const rawName = formData.get("name");
  const rawPhone = formData.get("phone");
  const name = typeof rawName === "string" ? rawName.trim() : "";
  const phone = typeof rawPhone === "string" ? rawPhone.trim() : "";
  const values = { name, phone };

  if (!Number.isInteger(id) || id < 1) {
    return { ok: false, message: "Member not found.", values };
  }
  if (!name) {
    return { ok: false, message: "Please enter the member's name.", values };
  }

  const found = await sql`select id from members where id = ${id}`;
  if (found.length === 0) {
    return { ok: false, message: "Member not found.", values };
  }

  await sql`
    update members
    set name = ${name}, phone = ${phone === "" ? null : phone}
    where id = ${id}
  `;

  revalidatePath("/members");
  revalidatePath("/");
  return { ok: true, message: "Member updated." };
}

export async function deleteMember(
  _prev: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const rawId = formData.get("id");
  const id = typeof rawId === "string" ? Number(rawId) : NaN;
  if (!Number.isInteger(id) || id < 1) {
    return { ok: false, message: "Member not found." };
  }

  const loans = await sql`
    select 1 from loans where member_id = ${id} limit 1
  `;
  if (loans.length > 0) {
    return {
      ok: false,
      message: "This member has borrowed books before, so they can't be deleted.",
    };
  }

  await sql`delete from members where id = ${id}`;

  revalidatePath("/members");
  revalidatePath("/");
  return { ok: true, message: "Member deleted." };
}