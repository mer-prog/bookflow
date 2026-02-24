import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, phone } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "パスワードは8文字以上で入力してください" }, { status: 400 });
  }

  // Sanitize email
  const sanitizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: sanitizedEmail,
      password: hashedPassword,
      phone: phone || null,
      role: "CUSTOMER",
    },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
