import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdminOrMain = ["ADMIN", "HAUPTFILIALE"].includes(session.user.role);
  if (!isAdminOrMain) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const deliveryDate = searchParams.get("deliveryDate");

  if (!deliveryDate) {
    return NextResponse.json({ error: "deliveryDate required" }, { status: 400 });
  }

  const date = new Date(deliveryDate);

  const orders = await prisma.order.findMany({
    where: {
      deliveryDate: date,
      status: { notIn: ["DRAFT", "CANCELLED"] },
    },
    include: {
      branch: true,
      user: true,
      orderItems: {
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
  });

  // Aggregate by product
  const productMap = new Map<
    string,
    {
      productId: string;
      productName: string;
      unit: string;
      categoryId: string;
      categoryName: string;
      categorySortOrder: number;
      totalQuantity: number;
      byBranch: { branchId: string; branchName: string; quantity: number }[];
    }
  >();

  for (const order of orders) {
    for (const item of order.orderItems) {
      const key = item.productId;
      const qty = Number(item.quantity);

      if (!productMap.has(key)) {
        productMap.set(key, {
          productId: item.productId,
          productName: item.product.name,
          unit: item.unit,
          categoryId: item.product.categoryId,
          categoryName: item.product.category.name,
          categorySortOrder: item.product.category.sortOrder,
          totalQuantity: 0,
          byBranch: [],
        });
      }

      const entry = productMap.get(key)!;
      entry.totalQuantity += qty;

      const branchEntry = entry.byBranch.find((b) => b.branchId === order.branchId);
      if (branchEntry) {
        branchEntry.quantity += qty;
      } else {
        entry.byBranch.push({
          branchId: order.branchId,
          branchName: order.branch.name,
          quantity: qty,
        });
      }
    }
  }

  // Group by category
  const categoryMap = new Map<
    string,
    { categoryId: string; categoryName: string; sortOrder: number; items: typeof productMap extends Map<string, infer V> ? V[] : never }
  >();

  for (const item of Array.from(productMap.values())) {
    if (!categoryMap.has(item.categoryId)) {
      categoryMap.set(item.categoryId, {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        sortOrder: item.categorySortOrder,
        items: [],
      });
    }
    categoryMap.get(item.categoryId)!.items.push(item as any);
  }

  const result = Array.from(categoryMap.values())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((cat) => ({
      ...cat,
      items: cat.items.sort((a: any, b: any) => a.productName.localeCompare(b.productName)),
    }));

  return NextResponse.json({
    deliveryDate,
    orderCount: orders.length,
    categories: result,
  });
}
