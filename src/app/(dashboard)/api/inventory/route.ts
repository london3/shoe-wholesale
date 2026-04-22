import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await db.execute("SELECT * FROM inventory ORDER BY product_code, size");
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  await db.execute({
    sql: "INSERT INTO inventory (product_code,product_name,size,color,current_stock,optimal_stock,location,last_in_date,last_out_date) VALUES (?,?,?,?,?,?,?,?,?)",
    args: [b.product_code,b.product_name,b.size,b.color,b.current_stock,b.optimal_stock,b.location,b.last_in_date,b.last_out_date],
  });
  return NextResponse.json({ message: "登録しました" });
}

export async function PUT(req: NextRequest) {
  const b = await req.json();
  await db.execute({
    sql: "UPDATE inventory SET product_code=?,product_name=?,size=?,color=?,current_stock=?,optimal_stock=?,location=?,last_in_date=?,last_out_date=? WHERE id=?",
    args: [b.product_code,b.product_name,b.size,b.color,b.current_stock,b.optimal_stock,b.location,b.last_in_date,b.last_out_date,b.id],
  });
  return NextResponse.json({ message: "更新しました" });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM inventory WHERE id=?", args: [id] });
  return NextResponse.json({ message: "削除しました" });
}
