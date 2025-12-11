"use client";

import { useRole } from "@/contexts/RoleContext";
import Link from "next/link";
import {
    Users,
    Briefcase,
    Calendar,
    MessageSquare,
    FileText,
    Image as ImageIcon,
    Video,
    ArrowRight,
    Loader2,
} from "lucide-react";

// Mapping of sections to allowed roles
const SECTION_ACCESS: Record<string, string[]> = {
    "/admin/crm": ["viewer", "editor", "admin", "super_admin", "prospection"],
    "/admin/jobs": ["viewer", "editor", "admin", "super_admin", "prospection"],
    "/admin/events": ["viewer", "editor", "admin", "super_admin"],
    "/admin/blog": ["viewer", "editor", "admin", "super_admin", "revue"],
    "/admin/gallery": ["viewer", "editor", "admin", "super_admin"],
    "/admin/testimonials": ["viewer", "editor", "admin", "super_admin"],
};

// Quick actions with their base routes for access checking
const QUICK_ACTION_ACCESS: Record<string, string> = {
    "/admin/blog/posts/create": "/admin/blog",
    "/admin/events/event/create": "/admin/events",
    "/admin/jobs/create": "/admin/jobs",
    "/admin/crm/contacts": "/admin/crm",
};

interface DashboardStats {
    contacts: { total: number; new: number };
    jobs: { total: number };
    blog: { posts: number; categories: number };
    events: { total: number; upcoming: number };
}

export function DashboardSections({ stats }: { stats: DashboardStats }) {
    const { role, isLoading } = useRole();

    // Define sections with icons inside the client component
    const sections = [
        {
            name: "CRM",
            href: "/admin/crm",
            icon: Users,
            lightColor: "bg-blue-50",
            textColor: "text-blue-600",
            value: stats.contacts.total,
            label: "contacts",
            badge: stats.contacts.new > 0 ? `+${stats.contacts.new} nouveaux` : null,
        },
        {
            name: "Emplois",
            href: "/admin/jobs",
            icon: Briefcase,
            lightColor: "bg-amber-50",
            textColor: "text-amber-600",
            value: stats.jobs.total,
            label: "offres",
            badge: null,
        },
        {
            name: "Événements",
            href: "/admin/events",
            icon: Calendar,
            lightColor: "bg-purple-50",
            textColor: "text-purple-600",
            value: stats.events.total,
            label: "événements",
            badge: stats.events.upcoming > 0 ? `${stats.events.upcoming} à venir` : null,
        },
        {
            name: "Blog",
            href: "/admin/blog",
            icon: FileText,
            lightColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            value: stats.blog.posts,
            label: "articles",
            badge: `${stats.blog.categories} catégories`,
        },
        {
            name: "Galerie",
            href: "/admin/gallery",
            icon: ImageIcon,
            lightColor: "bg-pink-50",
            textColor: "text-pink-600",
            value: null,
            label: "Médias",
            badge: null,
        },
        {
            name: "Témoignages",
            href: "/admin/testimonials",
            icon: Video,
            lightColor: "bg-cyan-50",
            textColor: "text-cyan-600",
            value: null,
            label: "Vidéos",
            badge: null,
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3" />
                        <div className="h-6 bg-gray-200 rounded w-16 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-12" />
                    </div>
                ))}
            </div>
        );
    }

    // Filter sections based on role
    const visibleSections = sections.filter((section) => {
        const allowedRoles = SECTION_ACCESS[section.href];
        if (!allowedRoles) return true; // Allow if not in mapping
        return role && allowedRoles.includes(role);
    });

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {visibleSections.map((section) => {
                const Icon = section.icon;
                return (
                    <Link
                        key={section.href}
                        href={section.href}
                        className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
                    >
                        <div className={`w-10 h-10 ${section.lightColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-5 h-5 ${section.textColor}`} />
                        </div>
                        {section.value !== null ? (
                            <p className="text-2xl font-bold text-gray-900">{section.value}</p>
                        ) : (
                            <p className="text-lg font-semibold text-gray-900">{section.name}</p>
                        )}
                        <p className="text-sm text-gray-500">{section.label}</p>
                        {section.badge && (
                            <span className={`mt-2 inline-block text-xs font-medium ${section.lightColor} ${section.textColor} px-2 py-0.5 rounded-full`}>
                                {section.badge}
                            </span>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

interface QuickActionProps {
    href: string;
    icon: any;
    title: string;
    description: string;
    gradientFrom: string;
    gradientTo: string;
    hoverFrom: string;
    hoverTo: string;
    lightTextColor: string;
}

const quickActions: QuickActionProps[] = [
    {
        href: "/admin/blog/posts/create",
        icon: FileText,
        title: "Nouvel article",
        description: "Créer un article de blog",
        gradientFrom: "from-emerald-500",
        gradientTo: "to-emerald-600",
        hoverFrom: "hover:from-emerald-600",
        hoverTo: "hover:to-emerald-700",
        lightTextColor: "text-emerald-100",
    },
    {
        href: "/admin/events/event/create",
        icon: Calendar,
        title: "Nouvel événement",
        description: "Planifier un événement",
        gradientFrom: "from-purple-500",
        gradientTo: "to-purple-600",
        hoverFrom: "hover:from-purple-600",
        hoverTo: "hover:to-purple-700",
        lightTextColor: "text-purple-100",
    },
    {
        href: "/admin/jobs/create",
        icon: Briefcase,
        title: "Nouvelle offre",
        description: "Publier une offre d'emploi",
        gradientFrom: "from-amber-500",
        gradientTo: "to-amber-600",
        hoverFrom: "hover:from-amber-600",
        hoverTo: "hover:to-amber-700",
        lightTextColor: "text-amber-100",
    },
    {
        href: "/admin/crm/contacts",
        icon: MessageSquare,
        title: "Messages",
        description: "Voir les contacts",
        gradientFrom: "from-blue-500",
        gradientTo: "to-blue-600",
        hoverFrom: "hover:from-blue-600",
        hoverTo: "hover:to-blue-700",
        lightTextColor: "text-blue-100",
    },
];

export function DashboardQuickActions() {
    const { role, isLoading, canWrite } = useRole();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-xl p-5 animate-pulse h-24" />
                ))}
            </div>
        );
    }

    // Only show quick actions for users who can write
    if (!canWrite) {
        return null;
    }

    // Filter actions based on role access
    const visibleActions = quickActions.filter((action) => {
        const baseRoute = QUICK_ACTION_ACCESS[action.href];
        if (!baseRoute) return true;
        const allowedRoles = SECTION_ACCESS[baseRoute];
        if (!allowedRoles) return true;
        return role && allowedRoles.includes(role);
    });

    if (visibleActions.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleActions.map((action) => {
                const Icon = action.icon;
                return (
                    <Link
                        key={action.href}
                        href={action.href}
                        className={`group flex items-center gap-4 bg-gradient-to-r ${action.gradientFrom} ${action.gradientTo} text-white rounded-xl p-5 ${action.hoverFrom} ${action.hoverTo} transition-all`}
                    >
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{action.title}</p>
                            <p className={`text-sm ${action.lightTextColor}`}>{action.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                );
            })}
        </div>
    );
}
