import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  unit: z.string().min(1),
  sku: z.string().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  internalNote: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";
  const categoryId = searchParams.get("categoryId");

  const products = await prisma.product.findMany({
    where: {
      ...(activeOnly ? { active: true } : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = productSchema.parse(body);

  const product = await prisma.product.create({ data, include: { category: true } });
  return NextResponse.json(product, { status: 201 });
}
