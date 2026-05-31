"use client";

import { useState } from "react";
import { Branch } from "@prisma/client";

type Role = "EMPLOYEE" | "ADMIN" | "HAUPTFILIALE";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  branchId: string | null;
  branch: { name: string } | null;
  createdAt: string;
}

interface Props {
  users: User[];
  branches: Branch[];
  currentUserId: string;
}

const ROLES: { value: Role; label: string }[] = [
  { value: "EMPLOYEE", label: "Mitarbeiter" },
  { value: "ADMIN", label: "Admin" },
  { value: "HAUPTFILIALE", label: "Hauptfiliale" },
];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "EMPLOYEE" as Role,
  branchId: "",
  active: true,
};

export function UsersClient({ users: initial, branches, currentUserId }: Props) {
  const [users, setUsers] = useState(initial);
  const [editId, setEditId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startEdit(u: User) {
    setEditId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      branchId: u.branchId ?? "",
      active: u.active,
    });
    setShowNew(false);
  }

  async function save() {
    setLoading(true);
    setError("");
    try {
      const body: any = {
        ...form,
        branchId: form.branchId || null,
      };
      if (!showNew && !body.password) delete body.password;

      let res;
      if (showNew) {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/users/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler");
      const updated = await res.json();
      if (showNew) {
        setUsers((prev) => [...prev, updated]);
        setShowNew(false);
      } else {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setEditId(null);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: string) {
    if (id === currentUserId) return;
    if (!confirm("Benutzer wirklich löschen?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  const getRoleLabel = (role: Role) => ROLES.find((r) => r.value === role)?.label ?? role;

  const FormPanel = (
    <div className="card p-4 space-y-3">
      <h3 className="font-semibold text-sm">{showNew ? "Neuer Benutzer" : "Benutzer bearbeiten"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="label">E-Mail *</label>
          <input type="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="label">{showNew ? "Passwort *" : "Neues Passwort (leer = keine Änderung)"}</label>
          <input type="password" className="input" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder={showNew ? "" : "Leer lassen für keine Änderung"} />
        </div>
        <div>
          <label className="label">Rolle *</label>
          <select className="input" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Filiale</label>
          <select className="input" value={form.branchId} onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))}>
            <option value="">Keine Filiale</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" id="user-active" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          <label htmlFor="user-active" className="text-sm">Aktiv</label>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" onClick={save} disabled={loading || !form.name || !form.email || (showNew && !form.password)}>
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
        <button onClick={() => { setForm({ ...emptyForm, branchId: branches[0]?.id ?? "" }); setShowNew(true); setEditId(null); }} className="btn-primary text-sm">
          ➕ Neuer Benutzer
        </button>
      </div>

      {(showNew || editId) && FormPanel}

      <div className="card divide-y divide-gray-100">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-medium ${u.active ? "text-gray-900" : "text-gray-400"}`}>{u.name}</p>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{getRoleLabel(u.role)}</span>
                {!u.active && <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">Inaktiv</span>}
              </div>
              <p className="text-xs text-gray-500">{u.email} · {u.branch?.name ?? "Keine Filiale"}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(u)} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">✏️</button>
              {u.id !== currentUserId && (
                <button onClick={() => deleteUser(u.id)} className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50">🗑️</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
