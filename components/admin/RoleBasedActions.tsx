'use client';

import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Skeleton } from '@/components/ui/skeleton';

interface RoleBasedActionsProps {
    children: React.ReactNode;
    /** 
     * Type of action buttons this wrapper contains:
     * - 'view': Always visible to all roles
     * - 'edit': Visible to editor+ (hidden for viewer)
     * - 'delete': Visible to admin+ (hidden for viewer and editor)
     * - 'create': Visible to editor+ (hidden for viewer)
     */
    type: 'view' | 'edit' | 'delete' | 'create';
    /** Afficher un skeleton pendant le chargement */
    showLoadingSkeleton?: boolean;
    /** Fallback content when user doesn't have permission */
    fallback?: React.ReactNode;
}

/**
 * Wrapper component for role-based action visibility in admin panel.
 * 
 * Roles hierarchy:
 * - viewer: Can only view (read-only access)
 * - editor: Can view and edit (no delete access)
 * - admin/super_admin: Full access
 * 
 * @example
 * // View button - visible to all
 * <RoleBasedActions type="view">
 *   <Link href="/admin/events/1">Voir</Link>
 * </RoleBasedActions>
 * 
 * @example
 * // Edit button - hidden for viewers
 * <RoleBasedActions type="edit">
 *   <Link href="/admin/events/1/edit">Éditer</Link>
 * </RoleBasedActions>
 * 
 * @example
 * // Delete button - hidden for viewers and editors
 * <RoleBasedActions type="delete">
 *   <DeleteEventButton eventId={1} />
 * </RoleBasedActions>
 */
export function RoleBasedActions({
    children,
    type,
    showLoadingSkeleton = false,
    fallback = null,
}: RoleBasedActionsProps) {
    const { isLoading, isViewer, canWrite, canDelete } = useRole();

    // Pendant le chargement, afficher un skeleton ou rien
    if (isLoading) {
        if (showLoadingSkeleton) {
            return <Skeleton className="h-10 w-24" />;
        }
        return null;
    }

    // Determine visibility based on action type
    let isVisible = false;

    switch (type) {
        case 'view':
            // View is always visible for all roles
            isVisible = true;
            break;
        case 'edit':
        case 'create':
            // Edit/Create requires at least editor role
            isVisible = canWrite;
            break;
        case 'delete':
            // Delete requires at least admin role
            isVisible = canDelete;
            break;
    }

    if (!isVisible) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Wrapper to hide entire action sections for viewers
 * Useful when a viewer should only see the "View" button
 */
interface ViewerOnlyActionsProps {
    /** Content visible only to viewers */
    viewerContent: React.ReactNode;
    /** Content visible to editors and above */
    editorContent: React.ReactNode;
    /** Content visible only to admins and above */
    adminContent?: React.ReactNode;
    /** Show skeleton while loading */
    showLoadingSkeleton?: boolean;
}

export function ConditionalActionsByRole({
    viewerContent,
    editorContent,
    adminContent,
    showLoadingSkeleton = false,
}: ViewerOnlyActionsProps) {
    const { isLoading, isViewer, isEditor, isAdmin } = useRole();

    if (isLoading) {
        if (showLoadingSkeleton) {
            return <Skeleton className="h-10 w-32" />;
        }
        return null;
    }

    return (
        <>
            {/* Viewer sees only viewerContent */}
            {isViewer && viewerContent}

            {/* Editor sees viewerContent + editorContent */}
            {isEditor && (
                <>
                    {viewerContent}
                    {editorContent}
                </>
            )}

            {/* Admin sees all content */}
            {isAdmin && (
                <>
                    {viewerContent}
                    {editorContent}
                    {adminContent}
                </>
            )}
        </>
    );
}

/**
 * Comprehensive action bar that automatically handles visibility
 * for view, edit, and delete actions based on user role.
 */
interface AdminActionBarProps {
    /** View button/link - always visible */
    viewAction: React.ReactNode;
    /** Edit button/link - visible to editor+ */
    editAction?: React.ReactNode;
    /** Delete button - visible to admin+ only */
    deleteAction?: React.ReactNode;
    /** Additional actions visible to all */
    additionalActions?: React.ReactNode;
    /** CSS classes for the container */
    className?: string;
}

export function AdminActionBar({
    viewAction,
    editAction,
    deleteAction,
    additionalActions,
    className = "flex items-center gap-2",
}: AdminActionBarProps) {
    const { isLoading, canWrite, canDelete } = useRole();

    if (isLoading) {
        return <Skeleton className="h-10 w-32" />;
    }

    return (
        <div className={className}>
            {/* View - always visible */}
            {viewAction}

            {/* Edit - visible to editor+ */}
            {canWrite && editAction}

            {/* Delete - visible to admin+ */}
            {canDelete && deleteAction}

            {/* Additional actions */}
            {additionalActions}
        </div>
    );
}
