"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Übersicht", icon: "🏠" },
  { href: "/orders/new", label: "Neue Bestellung", icon: "➕", roles: ["EMPLOYEE", "ADMIN"] },
  { href: "/orders", label: "Meine Bestellungen", icon: "📋", roles: ["EMPLOYEE"] },
  { href: "/admin/orders", label: "Alle Bestellungen", icon: "📦", roles: ["ADMIN", "HAUPTFILIALE"] },
  { href: "/admin/collection-list", label: "Sammelliste", icon: "📊", roles: ["ADMIN", "HAUPTFILIALE"] },
  { href: "/admin/products", label: "Artikel", icon: "🥦", roles: ["ADMIN"] },
  { href: "/admin/categories", label: "Kategorien", icon: "🏷️", roles: ["ADMIN"] },
  { href: "/admin/users", label: "Benutzer", icon: "👥", roles: ["ADMIN"] },
  { href: "/admin/branches", label: "Filialen", icon: "🏪", roles: ["ADMIN"] },
];

interface NavigationProps {
  role: string;
}

export function Navigation({ role }: NavigationProps) {
  const pathname = usePathname();

  const visible = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <nav className="bg-white border-r border-gray-200 w-14 md:w-52 shrink-0 no-print">
      <ul className="py-2">
        {visible.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span className="hidden md:inline truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
