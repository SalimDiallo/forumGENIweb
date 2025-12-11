'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit2 } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { DeleteEventButton } from '@/app/admin/events/DeleteEventButton';
import { Skeleton } from '@/components/ui/skeleton';

interface EventActionsWrapperProps {
    eventId: number;
    eventTitle: string;
    hasRegistrations: boolean;
}

/**
 * Client wrapper for event action buttons with role-based visibility:
 * - viewer: Only "Voir" button
 * - editor: "Voir" + "Éditer" buttons
 * - admin/super_admin: All buttons including delete
 */
export function EventActionsWrapper({
    eventId,
    eventTitle,
    hasRegistrations,
}: EventActionsWrapperProps) {
    const { isLoading, canWrite, canDelete } = useRole();

    if (isLoading) {
        return <Skeleton className="h-10 w-40" />;
    }

    return (
        <div className="flex items-center gap-2">
            {/* View - always visible */}
            <Link
                href={`/admin/events/event/${eventId}`}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Eye className="w-4 h-4" />
                Voir
            </Link>

            {/* Edit - hidden for viewers */}
            {canWrite && (
                <Link
                    href={`/admin/events/event/${eventId}/edit`}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                    Éditer
                </Link>
            )}

            {/* Delete - hidden for viewers and editors */}
            {canDelete && (
                <DeleteEventButton
                    eventId={eventId}
                    eventTitle={eventTitle}
                    hasRegistrations={hasRegistrations}
                />
            )}
        </div>
    );
}
