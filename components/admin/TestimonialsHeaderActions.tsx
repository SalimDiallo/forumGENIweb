'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Client wrapper for testimonials header create button with role-based visibility:
 * - viewer: No button visible
 * - editor+: Create button visible
 */
export function TestimonialsHeaderActions() {
    const { isLoading, canWrite } = useRole();

    if (isLoading) {
        return <Skeleton className="h-10 w-48" />;
    }

    if (!canWrite) {
        return null;
    }

    return (
        <Link
            href="/admin/testimonials/create"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg px-5 py-2.5 font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-200"
        >
            <Plus className="w-5 h-5" />
            Nouveau témoignage
        </Link>
    );
}
