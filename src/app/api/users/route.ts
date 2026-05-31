import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["EMPLOYEE", "ADMIN", "HAUPTFILIALE"]),
  branchId: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const allUsers = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: { branch: true },
  });

  const users = allUsers.map(({ passwordHash: _, ...u }) => u);

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { password, ...data } = createUserSchema.parse(body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json({ error: "E-Mail bereits vergeben" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const created = await prisma.user.create({
    data: { ...data, passwordHash },
    include: { branch: true },
  });

  const { passwordHash: _ph, ...user } = created;
  return NextResponse.json(user, { status: 201 });
}
