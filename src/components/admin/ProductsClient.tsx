"use client";

import { useState, useMemo } from "react";
import { Category } from "@prisma/client";

interface Product {
  id: string;
  name: string;
  unit: string;
  sku: string | null;
  active: boolean;
  sortOrder: number;
  internalNote: string | null;
  categoryId: string;
  category: { id: string; name: string };
}

interface Props {
  products: Product[];
  categories: Category[];
}

const UNITS = ["kg", "g", "Stück", "Kiste", "Bund", "Flasche", "Packung", "Becher", "Schale", "Topf", "Liter"];

const emptyForm = {
  name: "",
  categoryId: "",
  unit: "kg",
  sku: "",
  active: true,
  sortOrder: 0,
  internalNote: "",
};

export function ProductsClient({ products: initialProducts, categories }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterCategory && p.categoryId !== filterCategory) return false;
        if (filterActive === "active" && !p.active) return false;
        if (filterActive === "inactive" && p.active) return false;
        return true;
      }),
    [products, search, filterCategory, filterActive]
  );

  function startEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      categoryId: p.categoryId,
      unit: p.unit,
      sku: p.sku ?? "",
      active: p.active,
      sortOrder: p.sortOrder,
      internalNote: p.internalNote ?? "",
    });
    setShowNew(false);
  }

  function startNew() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setShowNew(true);
    setEditId(null);
  }

  async function save() {
    setLoading(true);
    setError("");
    try {
      const body = {
        ...form,
        sku: form.sku || undefined,
        internalNote: form.internalNote || undefined,
      };
      let res;
      if (showNew) {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/products/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler");
      const updated = await res.json();
      if (showNew) {
        setProducts((prev) => [...prev, updated]);
        setShowNew(false);
      } else {
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditId(null);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Artikel wirklich löschen?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  const FormPanel = (
    <div className="card p-4 space-y-3">
      <h3 className="font-semibold text-sm">{showNew ? "Neuer Artikel" : "Artikel bearbeiten"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="label">Kategorie *</label>
          <select className="input" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Einheit *</label>
          <select className="input" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Artikelnummer (optional)</label>
          <input className="input" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} placeholder="z. B. 1234" />
        </div>
        <div>
          <label className="label">Reihenfolge</label>
          <input type="number" className="input" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="rounded" />
          <label htmlFor="active" className="text-sm text-gray-700">Aktiv</label>
        </div>
      </div>
      <div>
        <label className="label">Interne Notiz (optional)</label>
        <textarea className="input resize-none" rows={2} value={form.internalNote} onChange={(e) => setForm((f) => ({ ...f, internalNote: e.target.value }))} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" onClick={save} disabled={loading || !form.name || !form.categoryId}>
          {loading ? "Speichert..." : "Speichern"}
        </button>
        <button className="btn-secondary" onClick={() => { setEditId(null); setShowNew(false); setError(""); }}>
          Abbrechen
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={startNew} className="btn-primary text-sm">➕ Neuer Artikel</button>
      </div>

      {(showNew || editId) && FormPanel}

      <div className="card p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input className="input text-sm" placeholder="🔍 Suchen..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input text-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Alle Kategorien</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input text-sm" value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
          <option value="all">Alle</option>
          <option value="active">Nur aktive</option>
          <option value="inactive">Nur inaktive</option>
        </select>
      </div>

      <p className="text-xs text-gray-500">{filtered.length} Artikel</p>

      <div className="card divide-y divide-gray-100">
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${p.active ? "text-gray-900" : "text-gray-400 line-through"}`}>{p.name}</p>
              <p className="text-xs text-gray-500">{p.category.name} · {p.unit}{p.sku ? ` · #${p.sku}` : ""}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => toggleActive(p)} className={`text-xs px-2 py-1 rounded border transition-colors ${p.active ? "border-orange-200 text-orange-600 hover:bg-orange-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
                {p.active ? "Deaktivieren" : "Aktivieren"}
              </button>
              <button onClick={() => startEdit(p)} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">
                ✏️
              </button>
              <button onClick={() => deleteProduct(p.id)} className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
