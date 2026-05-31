"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";

interface BranchQty {
  branchId: string;
  branchName: string;
  quantity: number;
}

interface CollectionItem {
  productId: string;
  productName: string;
  unit: string;
  totalQuantity: number;
  byBranch: BranchQty[];
}

interface CollectionCategory {
  categoryId: string;
  categoryName: string;
  sortOrder: number;
  items: CollectionItem[];
}

interface CollectionData {
  deliveryDate: string;
  orderCount: number;
  categories: CollectionCategory[];
}

interface Props {
  defaultDate: string;
}

export function CollectionListClient({ defaultDate }: Props) {
  const [date, setDate] = useState(defaultDate);
  const [data, setData] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (d: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/collection-list?deliveryDate=${d}`);
      if (!res.ok) throw new Error("Fehler beim Laden");
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(date);
  }, [date, load]);

  function exportCSV() {
    if (!data) return;
    const rows = [["Kategorie", "Artikel", "Einheit", "Gesamt", ...data.categories.flatMap((c) => c.items.flatMap((i) => i.byBranch.map((b) => b.branchName))).filter((v, i, a) => a.indexOf(v) === i)]];
    // Collect all unique branches
    const allBranches = Array.from(
      new Set(
        data.categories.flatMap((c) =>
          c.items.flatMap((i) => i.byBranch.map((b) => b.branchName))
        )
      )
    );
    const header = ["Kategorie", "Artikel", "Einheit", "Gesamt", ...allBranches];
    const csvRows = [header.join(";")];
    for (const cat of data.categories) {
      for (const item of cat.items) {
        const branchCols = allBranches.map((bn) => {
          const b = item.byBranch.find((x) => x.branchName === bn);
          return b ? b.quantity.toLocaleString("de-DE") : "";
        });
        csvRows.push(
          [cat.categoryName, item.productName, item.unit, item.totalQuantity.toLocaleString("de-DE"), ...branchCols].join(";")
        );
      }
    }
    const blob = new Blob(["﻿" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sammelliste_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="card p-3 flex gap-3 items-end no-print flex-wrap">
        <div className="flex-1 min-w-40">
          <label className="label text-xs">Lieferdatum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input text-sm"
          />
        </div>
        <button onClick={() => load(date)} className="btn-secondary text-sm" disabled={loading}>
          {loading ? "Lädt..." : "🔄 Aktualisieren"}
        </button>
        <button onClick={exportCSV} className="btn-secondary text-sm" disabled={!data}>
          📥 CSV Export
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {data && (
        <>
          {/* Print header */}
          <div className="hidden print:block text-center mb-2">
            <h1 className="text-lg font-bold">Obstbauer Haller – Sammelliste</h1>
            <p className="text-sm">
              Lieferdatum: {formatDate(date + "T00:00:00")} · {data.orderCount} Bestellungen
            </p>
          </div>

          <div className="no-print card p-3 bg-brand-50 text-sm text-brand-700 font-medium">
            Lieferdatum: {formatDate(date + "T00:00:00")} · {data.orderCount}{" "}
            {data.orderCount === 1 ? "Bestellung" : "Bestellungen"}
          </div>

          {data.categories.length === 0 ? (
            <div className="card p-8 text-center text-gray-500 text-sm">
              Keine Bestellungen für dieses Datum.
            </div>
          ) : (
            <div className="space-y-4">
              {data.categories.map((cat) => (
                <div key={cat.categoryId} className="card overflow-hidden">
                  <div className="bg-brand-50 px-4 py-2 border-b border-brand-100">
                    <h3 className="font-bold text-brand-800 text-sm">
                      {cat.categoryName}
                    </h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                        <th className="px-4 py-2 font-medium">Artikel</th>
                        <th className="px-4 py-2 font-medium text-right">Gesamt</th>
                        <th className="px-4 py-2 font-medium text-right hidden sm:table-cell">
                          nach Filiale
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cat.items.map((item) => (
                        <tr key={item.productId}>
                          <td className="px-4 py-2.5 text-gray-800">
                            {item.productName}
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold text-gray-900">
                            {item.totalQuantity.toLocaleString("de-DE")} {item.unit}
                          </td>
                          <td className="px-4 py-2.5 text-right hidden sm:table-cell">
                            <div className="text-xs text-gray-500 space-y-0.5">
                              {item.byBranch.map((b) => (
                                <div key={b.branchId}>
                                  {b.branchName}: {b.quantity.toLocaleString("de-DE")} {item.unit}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
