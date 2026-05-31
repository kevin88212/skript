"use client";

import { useState } from "react";

interface Category {
  id: string;
  name: string;
  sortOrder: number;
  active: boolean;
  _count: { products: number };
}

interface Props {
  categories: Category[];
}

export function CategoriesClient({ categories: initial }: Props) {
  const [categories, setCategories] = useState(initial);
  const [editId, setEditId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", sortOrder: 0, active: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startEdit(c: Category) {
    setEditId(c.id);
    setForm({ name: c.name, sortOrder: c.sortOrder, active: c.active });
    setShowNew(false);
  }

  async function save() {
    setLoading(true);
    setError("");
    try {
      let res;
      if (showNew) {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(`/api/categories/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler");
      const updated = await res.json();
      if (showNew) {
        setCategories((prev) => [...prev, { ...updated, _count: { products: 0 } }]);
        setShowNew(false);
      } else {
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? { ...updated, _count: c._count } : c))
        );
        setEditId(null);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Kategorie wirklich löschen? Alle zugehörigen Artikel werden ebenfalls gelöscht.")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  const FormPanel = (
    <div className="card p-4 space-y-3">
      <h3 className="font-semibold text-sm">{showNew ? "Neue Kategorie" : "Kategorie bearbeiten"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="label">Reihenfolge</label>
          <input type="number" className="input" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="cat-active" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          <label htmlFor="cat-active" className="text-sm">Aktiv</label>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" onClick={save} disabled={loading || !form.name}>
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
        <button onClick={() => { setForm({ name: "", sortOrder: 0, active: true }); setShowNew(true); setEditId(null); }} className="btn-primary text-sm">
          ➕ Neue Kategorie
        </button>
      </div>

      {(showNew || editId) && FormPanel}

      <div className="card divide-y divide-gray-100">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1">
              <p className={`text-sm font-medium ${c.active ? "text-gray-900" : "text-gray-400"}`}>{c.name}</p>
              <p className="text-xs text-gray-500">
                {c._count.products} Artikel · Reihenfolge: {c.sortOrder}
                {!c.active && " · Inaktiv"}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(c)} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">✏️</button>
              <button onClick={() => deleteCategory(c.id)} className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
