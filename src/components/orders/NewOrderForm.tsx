"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Category, Product } from "@prisma/client";

type CategoryWithProducts = Category & { products: Product[] };

interface Props {
  categories: CategoryWithProducts[];
}

type QuantityMap = Record<string, string>;

export function NewOrderForm({ categories }: Props) {
  const router = useRouter();
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const defaultDeliveryDate = today.toISOString().split("T")[0];

  const [deliveryDate, setDeliveryDate] = useState(defaultDeliveryDate);
  const [note, setNote] = useState("");
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<"form" | "summary">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allProducts = useMemo(
    () => categories.flatMap((c) => c.products),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        products: cat.products.filter((p) => p.name.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.products.length > 0);
  }, [categories, search]);

  const orderItems = useMemo(
    () =>
      Object.entries(quantities)
        .filter(([, qty]) => qty !== "" && Number(qty) > 0)
        .map(([productId, qty]) => {
          const product = allProducts.find((p) => p.id === productId)!;
          return { productId, quantity: Number(qty), unit: product.unit, product };
        }),
    [quantities, allProducts]
  );

  function setQty(productId: string, value: string) {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryDate,
          note,
          items: orderItems.map(({ productId, quantity, unit }) => ({
            productId,
            quantity,
            unit,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Fehler beim Absenden");
      }

      const order = await res.json();
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (step === "summary") {
    return (
      <div className="space-y-4">
        <div className="card p-4 space-y-2">
          <h2 className="font-semibold text-gray-900">Zusammenfassung</h2>
          <p className="text-sm text-gray-600">
            Lieferdatum:{" "}
            <strong>
              {new Date(deliveryDate + "T00:00:00").toLocaleDateString("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </strong>
          </p>
          {note && <p className="text-sm text-gray-600">Notiz: {note}</p>}
        </div>

        <div className="card divide-y divide-gray-100">
          {orderItems.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Keine Artikel ausgewählt.</p>
          ) : (
            orderItems.map(({ productId, quantity, unit, product }) => (
              <div
                key={productId}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <span className="text-sm text-gray-800">{product.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {quantity} {unit}
                </span>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setStep("form")}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            ← Zurück
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1"
            disabled={loading || orderItems.length === 0}
          >
            {loading ? "Wird gesendet..." : "✓ Bestellung absenden"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="label">Lieferdatum</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">Bestellnotiz (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="input resize-none"
            placeholder="z. B. Bitte extra reife Tomaten..."
          />
        </div>
      </div>

      <div className="relative">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
          placeholder="Artikel suchen..."
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
      </div>

      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="card overflow-hidden">
            <div className="bg-brand-50 px-4 py-2 border-b border-brand-100">
              <h3 className="font-semibold text-brand-800 text-sm">{category.name}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.unit}</p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={quantities[product.id] ?? ""}
                    onChange={(e) => setQty(product.id, e.target.value)}
                    className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4">
        <div className="card p-3 flex items-center justify-between gap-4 shadow-lg">
          <p className="text-sm text-gray-600">
            <strong className="text-brand-600">{orderItems.length}</strong> Artikel
            ausgewählt
          </p>
          <button
            onClick={() => setStep("summary")}
            className="btn-primary"
            disabled={orderItems.length === 0}
          >
            Prüfen & Absenden →
          </button>
        </div>
      </div>
    </div>
  );
}
