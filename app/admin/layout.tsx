"use client"
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/blog", label: "Blog", children: [
    { href: "/admin/blog/categories", label: "Catégories" },
    { href: "/admin/blog/tags", label: "Tags" },
  ]},
  { href: "/admin/crm", label: "CRM", children: [
    { href: "/admin/crm/contacts", label: "Contacts" },
    { href: "/admin/crm/partnerships", label: "Partenariats" },
  ]},
  { href: "/admin/events", label: "Événements" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/media", label: "Médias" },
  { href: "/admin/testimonials", label: "Témoignages" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/analytics", label: "Analytics" },
];

function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <ul className="flex flex-wrap gap-2 px-6 py-3">
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
      {/* Sub-navigation when inside a section */}
      {navItems.map((parent) => (
        pathname?.startsWith(parent.href + "/") && parent.children ? (
          <ul key={parent.href+"/sub"} className="flex gap-2 px-6 pb-3">
            {parent.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    pathname?.startsWith(child.href)
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null
      ))}
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
