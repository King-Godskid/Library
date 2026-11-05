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