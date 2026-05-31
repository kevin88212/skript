"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface HeaderProps {
  session: Session;
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="bg-brand-700 text-white px-4 py-3 flex items-center justify-between shadow-md no-print">
      <div className="flex items-center gap-2">
        <span className="text-xl">🌿</span>
        <span className="font-semibold text-sm hidden sm:inline">
          Obstbauer Haller
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium">{session.user.name}</p>
          <p className="text-xs text-brand-200">{session.user.branchName ?? "–"}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs bg-brand-600 hover:bg-brand-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          Abmelden
        </button>
      </div>
    </header>
  );
}
