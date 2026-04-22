import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correct = (process.env.APP_PASSWORD || "admin").trim();
  const input = (password || "").trim();

  if (input !== correct) {
    return NextResponse.json({ error: "パスワードが違います" }, { status: 401 });
  }

  const token = Buffer.from(`${correct}:${Date.now()}`).toString("base64");

  const res = NextResponse.json({ message: "ログインしました" });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ message: "ログアウトしました" });
  res.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
  return res;
}
