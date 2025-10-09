"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Briefcase, 
  Users, 
  Calendar, 
  FileText, 
  Mail, 
  BarChart3,
  Settings,
  Home
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Offres d'emploi", href: "/admin/jobs", icon: Briefcase },
  { name: "Candidatures", href: "/admin/jobs/applications", icon: Users },
  { name: "Événements", href: "/admin/events", icon: Calendar },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Messages", href: "/admin/crm", icon: Mail },
  { name: "Analytiques", href: "/admin/analytics", icon: BarChart3 },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Administration
        </h2>
        
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
