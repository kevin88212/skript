"use client";

import { useState } from "react";

interface Branch {
  id: string;
  name: string;
  location: string | null;
  active: boolean;
  _count: { users: number; orders: number };
}

interface Props {
  branches: Branch[];
}

export function BranchesClient({ branches: initial }: Props) {
  const [branches, setBranches] = useState(initial);
  const [editId, setEditId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", active: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startEdit(b: Branch) {
    setEditId(b.id);
    setForm({ name: b.name, location: b.location ?? "", active: b.active });
    setShowNew(false);
  }

  async function save() {
    setLoading(true);
    setError("");
    try {
      const body = { ...form, location: form.location || undefined };
      let res;
      if (showNew) {
        res = await fetch("/api/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/branches/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler");
      const updated = await res.json();
      if (showNew) {
        setBranches((prev) => [...prev, { ...updated, _count: { users: 0, orders: 0 } }]);
        setShowNew(false);
      } else {
        setBranches((prev) =>
          prev.map((b) => (b.id === updated.id ? { ...updated, _count: b._count } : b))
        );
        setEditId(null);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBranch(id: string) {
    if (!confirm("Filiale wirklich löschen?")) return;
    const res = await fetch(`/api/branches/${id}`, { method: "DELETE" });
    if (res.ok) setBranches((prev) => prev.filter((b) => b.id !== id));
  }

  const FormPanel = (
    <div className="card p-4 space-y-3">
      <h3 className="font-semibold text-sm">{showNew ? "Neue Filiale" : "Filiale bearbeiten"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="label">Standort (optional)</label>
          <input className="input" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="branch-active" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          <label htmlFor="branch-active" className="text-sm">Aktiv</label>
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
        <button onClick={() => { setForm({ name: "", location: "", active: true }); setShowNew(true); setEditId(null); }} className="btn-primary text-sm">
          ➕ Neue Filiale
        </button>
      </div>

      {(showNew || editId) && FormPanel}

      <div className="card divide-y divide-gray-100">
        {branches.map((b) => (
          <div key={b.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1">
              <p className={`text-sm font-medium ${b.active ? "text-gray-900" : "text-gray-400"}`}>{b.name}</p>
              <p className="text-xs text-gray-500">
                {b.location && `${b.location} · `}
                {b._count.users} Benutzer · {b._count.orders} Bestellungen
                {!b.active && " · Inaktiv"}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(b)} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">✏️</button>
              <button onClick={() => deleteBranch(b.id)} className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
