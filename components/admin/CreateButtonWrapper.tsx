'use client';

import React from 'react';
import { useRole } from '@/contexts/RoleContext';

interface CreateButtonWrapperProps {
    children: React.ReactNode;
}

/**
 * Wrapper for "Create" buttons - hidden for viewers
 * Must wrap any "Nouvel événement", "Nouvelle annonce", etc. buttons
 */
export function CreateButtonWrapper({ children }: CreateButtonWrapperProps) {
    const { isLoading, canWrite } = useRole();

    if (isLoading) {
        return null;
    }

    if (!canWrite) {
        return null;
    }

    return <>{children}</>;
}
