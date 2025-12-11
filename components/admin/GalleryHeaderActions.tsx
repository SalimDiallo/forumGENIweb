'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryHeaderActionsProps {
    activeTab: "videos" | "photos";
}

/**
 * Client wrapper for gallery header action buttons with role-based visibility:
 * - viewer: No buttons visible
 * - editor+: All buttons visible (create actions)
 */
export function GalleryHeaderActions({ activeTab }: GalleryHeaderActionsProps) {
    const { isLoading, canWrite } = useRole();

    if (isLoading) {
        return <Skeleton className="h-10 w-48" />;
    }

    if (!canWrite) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href={`/admin/gallery/bulk?type=${activeTab === "videos" ? "video" : "photo"}`}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 font-medium hover:bg-gray-50 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Multiple
            </Link>
            <Link
                href={`/admin/gallery/create?type=${activeTab}`}
                className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-gray-800 transition-colors"
            >
                <Plus className="w-5 h-5" />
                Ajouter {activeTab === "videos" ? "une vidéo" : "une photo"}
            </Link>
        </div>
    );
}
