"use client"
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/blog", label: "Gestion du Blog" },
  { href: "/admin/requests", label: "Demandes & Partenariats" },
  { href: "/admin/jobs", label: "Annonces de Jobs" },
  { href: "/admin/testimonials", label: "Avis & Témoignages" },
];

function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <ul className="flex space-x-4 px-6 py-3">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                pathname?.startsWith(item.href)
                  ? "bg-gray-900 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Vérifie si on est en production
  if (process.env.NODE_ENV === "production") {
    // En production, on ne rentre pas dans le layout (rien n'est rendu)
    return null;
  }

  // En développement, on affiche le layout admin avec navigation
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold">Admin Panel (DEV ONLY)</h1>
      </header>
      <AdminNav />
      <main className="p-6">{children}</main>
    </div>
  );
}
