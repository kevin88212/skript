import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const isAdmin = session.user.role === "ADMIN";
  const isHauptfiliale = session.user.role === "HAUPTFILIALE";
  const isEmployee = session.user.role === "EMPLOYEE";

  const recentOrders = await prisma.order.findMany({
    where: isEmployee ? { userId: session.user.id } : undefined,
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      branch: true,
      user: true,
      orderItems: true,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await prisma.order.count({
    where: {
      ...(isEmployee ? { userId: session.user.id } : {}),
      createdAt: { gte: today },
    },
  });

  const openOrders = await prisma.order.count({
    where: {
      ...(isEmployee ? { userId: session.user.id } : {}),
      status: { in: ["SUBMITTED", "SEEN", "IN_PROGRESS"] },
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Willkommen, {session.user.name}
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {session.user.branchName && `Filiale: ${session.user.branchName}`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Heute erstellt</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{todayOrders}</p>
          <p className="text-xs text-gray-500 mt-0.5">Bestellungen</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Offen / In Bearbeitung</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{openOrders}</p>
          <p className="text-xs text-gray-500 mt-0.5">Bestellungen</p>
        </div>
        {(isAdmin || isHauptfiliale) && (
          <div className="card p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500">Schnellzugriff</p>
            <Link
              href="/admin/collection-list"
              className="btn-primary mt-2 w-full text-xs py-2"
            >
              📊 Sammelliste
            </Link>
          </div>
        )}
      </div>

      {isEmployee && (
        <div className="card p-4 flex gap-4 items-center">
          <div className="flex-1">
            <p className="font-medium text-sm">Neue Bestellung aufgeben</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Artikel nach Kategorien auswählen und Mengen eintragen.
            </p>
          </div>
          <Link href="/orders/new" className="btn-primary shrink-0">
            ➕ Bestellen
          </Link>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Letzte Bestellungen</h2>
          <Link
            href={isEmployee ? "/orders" : "/admin/orders"}
            className="text-sm text-brand-600 hover:text-brand-700"
          >
            Alle anzeigen →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 text-sm">
            Noch keine Bestellungen vorhanden.
          </div>
        ) : (
          <div className="card divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {isAdmin || isHauptfiliale
                        ? `${order.branch.name} – ${order.user.name}`
                        : `Bestellung vom ${formatDate(order.createdAt)}`}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Lieferung: {formatDate(order.deliveryDate)} ·{" "}
                    {order.orderItems.length} Artikel
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
