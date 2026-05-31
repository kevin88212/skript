import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { formatDate, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PrintButton } from "@/components/ui/PrintButton";
import Link from "next/link";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      branch: true,
      user: true,
      orderItems: {
        include: {
          product: { include: { category: true } },
        },
        orderBy: [
          { product: { category: { sortOrder: "asc" } } },
          { product: { sortOrder: "asc" } },
        ],
      },
    },
  });

  if (!order) notFound();

  const isEmployee = session.user.role === "EMPLOYEE";
  if (isEmployee && order.userId !== session.user.id) redirect("/orders");

  // Group by category
  const byCategory = order.orderItems.reduce(
    (acc, item) => {
      const key = item.product.category.id;
      if (!acc[key]) {
        acc[key] = {
          name: item.product.category.name,
          items: [],
        };
      }
      acc[key].items.push(item);
      return acc;
    },
    {} as Record<string, { name: string; items: typeof order.orderItems }>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="no-print flex items-center gap-3">
        <Link
          href={isEmployee ? "/orders" : "/admin/orders"}
          className="btn-secondary text-sm"
        >
          ← Zurück
        </Link>
        <h1 className="text-xl font-bold text-gray-900 flex-1">Bestellung</h1>
        <PrintButton />
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center mb-4">
        <h1 className="text-xl font-bold">Obstbauer Haller – Bestellung</h1>
      </div>

      <div className="card p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">
              Filiale:{" "}
              <strong className="text-gray-900">{order.branch.name}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Mitarbeiter:{" "}
              <strong className="text-gray-900">{order.user.name}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Lieferdatum:{" "}
              <strong className="text-gray-900">
                {formatDate(order.deliveryDate)}
              </strong>
            </p>
            {order.submittedAt && (
              <p className="text-sm text-gray-500">
                Abgesendet: {formatDateTime(order.submittedAt)}
              </p>
            )}
          </div>
          <StatusBadge status={order.status} />
        </div>
        {order.note && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
            📝 {order.note}
          </div>
        )}
      </div>

      {Object.entries(byCategory).map(([catId, { name, items }]) => (
        <div key={catId} className="card overflow-hidden">
          <div className="bg-brand-50 px-4 py-2 border-b border-brand-100">
            <h3 className="font-semibold text-brand-800 text-sm">{name}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <span className="text-sm text-gray-800">{item.product.name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {Number(item.quantity).toLocaleString("de-DE")} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-xs text-gray-400 text-center no-print">
        Bestell-ID: {order.id}
      </div>
    </div>
  );
}
