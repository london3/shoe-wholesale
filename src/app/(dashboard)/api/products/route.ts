import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await db.execute("SELECT * FROM products ORDER BY code");
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  await db.execute({
    sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    args: [b.code,b.name,b.brand,b.category,b.type,b.sizes,b.colors,b.retail_price,b.cost_price,b.wholesale_price,b.supplier_code,b.supplier_name,b.status],
  });
  return NextResponse.json({ message: "登録しました" });
}

export async function PUT(req: NextRequest) {
  const b = await req.json();
  await db.execute({
    sql: "UPDATE products SET code=?,name=?,brand=?,category=?,type=?,sizes=?,colors=?,retail_price=?,cost_price=?,wholesale_price=?,supplier_code=?,supplier_name=?,status=? WHERE id=?",
    args: [b.code,b.name,b.brand,b.category,b.type,b.sizes,b.colors,b.retail_price,b.cost_price,b.wholesale_price,b.supplier_code,b.supplier_name,b.status,b.id],
  });
  return NextResponse.json({ message: "更新しました" });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM products WHERE id=?", args: [id] });
  return NextResponse.json({ message: "削除しました" });
}
