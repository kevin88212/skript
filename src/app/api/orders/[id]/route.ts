import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "SUBMITTED", "SEEN", "IN_PROGRESS", "DONE", "CANCELLED"]),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      branch: true,
      user: true,
      orderItems: {
        include: { product: { include: { category: true } } },
      },
    },
  });

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isEmployee = session.user.role === "EMPLOYEE";
  if (isEmployee && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdminOrMain = ["ADMIN", "HAUPTFILIALE"].includes(session.user.role);
  if (!isAdminOrMain) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { status } = updateStatusSchema.parse(body);

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
    include: { branch: true, user: true, orderItems: { include: { product: true } } },
  });

  return NextResponse.json(order);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isEmployee = session.user.role === "EMPLOYEE";
  if (isEmployee && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (isEmployee && order.status !== "DRAFT") {
    return NextResponse.json({ error: "Abgesendete Bestellungen können nicht gelöscht werden" }, { status: 400 });
  }

  await prisma.order.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
