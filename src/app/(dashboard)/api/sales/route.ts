import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await db.execute("SELECT * FROM sales ORDER BY order_date DESC, order_number");
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  await db.execute({
    sql: "INSERT INTO sales (order_number,order_date,customer_name,customer_contact,customer_phone,product_code,product_name,size,color,quantity,unit_price,status,delivery_date,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    args: [b.order_number,b.order_date,b.customer_name,b.customer_contact,b.customer_phone,b.product_code,b.product_name,b.size,b.color,b.quantity,b.unit_price,b.status,b.delivery_date,b.notes],
  });
  return NextResponse.json({ message: "登録しました" });
}

export async function PUT(req: NextRequest) {
  const b = await req.json();
  await db.execute({
    sql: "UPDATE sales SET order_number=?,order_date=?,customer_name=?,customer_contact=?,customer_phone=?,product_code=?,product_name=?,size=?,color=?,quantity=?,unit_price=?,status=?,delivery_date=?,notes=? WHERE id=?",
    args: [b.order_number,b.order_date,b.customer_name,b.customer_contact,b.customer_phone,b.product_code,b.product_name,b.size,b.color,b.quantity,b.unit_price,b.status,b.delivery_date,b.notes,b.id],
  });
  return NextResponse.json({ message: "更新しました" });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM sales WHERE id=?", args: [id] });
  return NextResponse.json({ message: "削除しました" });
}
