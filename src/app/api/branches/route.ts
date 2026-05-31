import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const branchSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true, orders: true } } },
  });

  return NextResponse.json(branches);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = branchSchema.parse(body);

  const branch = await prisma.branch.create({ data });
  return NextResponse.json(branch, { status: 201 });
}
