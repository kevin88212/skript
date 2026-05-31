"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Branch, OrderStatus } from "@prisma/client";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Order {
  id: string;
  branchId: string;
  branch: { id: string; name: string };
  user: { name: string };
  deliveryDate: string;
  createdAt: string;
  status: OrderStatus;
  orderItems: { id: string }[];
  note?: string | null;
}

interface Props {
  orders: Order[];
  branches: Branch[];
}

const ALL_STATUSES: OrderStatus[] = [
  "DRAFT", "SUBMITTED", "SEEN", "IN_PROGRESS", "DONE", "CANCELLED"
];

export function AdminOrdersClient({ orders, branches }: Props) {
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (filterBranch && o.branchId !== filterBranch) return false;
        if (filterStatus && o.status !== filterStatus) return false;
        if (filterDate && !o.deliveryDate.startsWith(filterDate)) return false;
        return true;
      }),
    [orders, filterBranch, filterStatus, filterDate]
  );

  async function updateStatus(orderId: string, status: OrderStatus) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="label text-xs">Filiale</label>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="input text-sm"
          >
            <option value="">Alle Filialen</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label text-xs">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input text-sm"
          >
            <option value="">Alle Status</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {getStatusLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label text-xs">Lieferdatum</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="input text-sm"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {filtered.length} von {orders.length} Bestellungen
      </p>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 text-sm">
          Keine Bestellungen gefunden.
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {filtered.map((order) => (
            <div key={order.id} className="px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">
                      {order.branch.name}
                    </p>
                    <span className="text-gray-400 text-xs">·</span>
                    <p className="text-sm text-gray-600">{order.user.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Lieferung: {formatDate(order.deliveryDate)} ·{" "}
                    {order.orderItems.length} Artikel · Bestellt:{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={order.status} />
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-xs text-brand-600 hover:text-brand-700"
                  >
                    Details
                  </Link>
                </div>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {ALL_STATUSES.filter((s) => s !== order.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.id, s)}
                    className="text-xs px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    → {getStatusLabel(s)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
