import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: { include: { product: true } },
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Meine Bestellungen</h1>
        <Link href="/orders/new" className="btn-primary text-sm">
          ➕ Neue Bestellung
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          <p className="text-base mb-2">Noch keine Bestellungen</p>
          <Link href="/orders/new" className="btn-primary text-sm">
            Erste Bestellung aufgeben
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900">
                    Lieferung: {formatDate(order.deliveryDate)}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bestellt am {formatDate(order.createdAt)} ·{" "}
                  {order.orderItems.length} Artikel
                </p>
              </div>
              <span className="text-gray-400 text-sm">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
