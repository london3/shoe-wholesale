import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await db.execute("SELECT * FROM suppliers ORDER BY code");
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, name, contact_person, phone, email, address, payment_terms, notes } = body;
  await db.execute({
    sql: "INSERT INTO suppliers (code,name,contact_person,phone,email,address,payment_terms,notes) VALUES (?,?,?,?,?,?,?,?)",
    args: [code, name, contact_person, phone, email, address, payment_terms, notes],
  });
  return NextResponse.json({ message: "登録しました" });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, code, name, contact_person, phone, email, address, payment_terms, notes } = body;
  await db.execute({
    sql: "UPDATE suppliers SET code=?,name=?,contact_person=?,phone=?,email=?,address=?,payment_terms=?,notes=? WHERE id=?",
    args: [code, name, contact_person, phone, email, address, payment_terms, notes, id],
  });
  return NextResponse.json({ message: "更新しました" });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM suppliers WHERE id=?", args: [id] });
  return NextResponse.json({ message: "削除しました" });
}
