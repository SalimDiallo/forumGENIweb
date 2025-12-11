'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit2 } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { DeleteJobButton } from '@/app/admin/jobs/DeleteJobButton';
import { Skeleton } from '@/components/ui/skeleton';

interface JobActionsWrapperProps {
    jobId: number;
    jobTitle: string;
}

/**
 * Client wrapper for job action buttons with role-based visibility:
 * - viewer: Only "Détails" button
 * - editor: "Détails" + "Éditer" buttons
 * - admin/super_admin: All buttons including delete
 */
export function JobActionsWrapper({
    jobId,
    jobTitle,
}: JobActionsWrapperProps) {
    const { isLoading, canWrite, canDelete } = useRole();

    if (isLoading) {
        return <Skeleton className="h-10 w-40" />;
    }

    return (
        <div className="flex items-center gap-2">
            {/* View - always visible */}
            <Link
                href={`/admin/jobs/job/${jobId}`}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Eye className="w-4 h-4" />
                Détails
            </Link>

            {/* Edit - hidden for viewers */}
            {canWrite && (
                <Link
                    href={`/admin/jobs/job/${jobId}/edit`}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                    Éditer
                </Link>
            )}

            {/* Delete - hidden for viewers and editors */}
            {canDelete && (
                <DeleteJobButton
                    jobId={jobId}
                    jobTitle={jobTitle}
                />
            )}
        </div>
    );
}
