import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  note: z.string().optional(),
});

const createOrderSchema = z.object({
  deliveryDate: z.string(),
  note: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const deliveryDate = searchParams.get("deliveryDate");
  const branchId = searchParams.get("branchId");
  const status = searchParams.get("status");

  const isEmployee = session.user.role === "EMPLOYEE";

  const orders = await prisma.order.findMany({
    where: {
      ...(isEmployee ? { userId: session.user.id } : {}),
      ...(deliveryDate ? { deliveryDate: new Date(deliveryDate) } : {}),
      ...(branchId ? { branchId } : {}),
      ...(status ? { status: status as any } : {}),
    },
    include: {
      branch: true,
      user: true,
      orderItems: {
        include: { product: { include: { category: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!session.user.branchId) {
    return NextResponse.json({ error: "Kein Filiale zugewiesen" }, { status: 400 });
  }

  const body = await req.json();
  const { deliveryDate, note, items } = createOrderSchema.parse(body);

  const order = await prisma.order.create({
    data: {
      branchId: session.user.branchId,
      userId: session.user.id,
      deliveryDate: new Date(deliveryDate),
      note,
      status: "SUBMITTED",
      submittedAt: new Date(),
      orderItems: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unit: item.unit,
          note: item.note,
        })),
      },
    },
    include: {
      branch: true,
      orderItems: { include: { product: true } },
    },
  });

  return NextResponse.json(order, { status: 201 });
}
