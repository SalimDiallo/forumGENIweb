"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface SessionWatcherProps {
    /** Check interval in milliseconds (default: 30 seconds) */
    checkInterval?: number;
    /** Whether to show toast on forced logout (default: true) */
    showToast?: boolean;
}

/**
 * Component that watches for session invalidation and auto-logs out the user
 * This handles cases when:
 * - Super admin deactivates the user's account
 * - Super admin resets the user's password
 * - Session expires naturally
 */
export function SessionWatcher({
    checkInterval = 30000, // 30 seconds
    showToast = true,
}: SessionWatcherProps) {
    const { data: session, isPending, error } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const lastCheckRef = useRef<Date>(new Date());
    const isCheckingRef = useRef(false);

    // Skip for login page
    const isLoginPage = pathname === "/admin/login";

    const handleForcedLogout = useCallback(async (message: string, reason: string = "forced_logout") => {
        if (showToast) {
            toast.error(message, {
                duration: 5000,
            });
        }

        try {
            await signOut();
        } catch (e) {
            // Ignore signOut errors
        }

        // Redirect to login with reason
        router.replace(`/admin/login?reason=${reason}`);
    }, [showToast, router]);

    // Check session validity by calling dedicated API that checks database directly
    const checkSessionValidity = useCallback(async () => {
        if (isCheckingRef.current || isLoginPage) return;

        isCheckingRef.current = true;

        try {
            // Make a request to verify session is still valid
            // This endpoint checks the database directly for fresh user status
            const response = await fetch("/api/admin/check-session", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok || !data.valid) {
                // Determine the appropriate message based on reason
                let message = "Votre session a expiré.";
                let reason = "session_expired";

                if (data.reason === "account_disabled") {
                    message = "Votre compte a été désactivé par un administrateur.";
                    reason = "account_disabled";
                } else if (data.reason === "user_not_found") {
                    message = "Votre compte n'existe plus.";
                    reason = "session_expired";
                } else if (data.reason === "no_session") {
                    message = "Votre session a expiré.";
                    reason = "session_expired";
                }

                await handleForcedLogout(message, reason);
                return;
            }

            lastCheckRef.current = new Date();
        } catch (error) {
            // Network error or session issue
            console.error("Session check failed:", error);
            // Don't force logout on network errors, just log
        } finally {
            isCheckingRef.current = false;
        }
    }, [handleForcedLogout, isLoginPage]);

    // Initial check and set up interval
    useEffect(() => {
        if (isLoginPage) return;

        // Check immediately on mount
        checkSessionValidity();

        // Set up periodic checks
        const intervalId = setInterval(() => {
            checkSessionValidity();
        }, checkInterval);

        return () => {
            clearInterval(intervalId);
        };
    }, [checkInterval, checkSessionValidity, isLoginPage]);

    // Check on visibility change (when user returns to tab)
    useEffect(() => {
        if (isLoginPage) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                // Check if enough time has passed since last check
                const now = new Date();
                const timeSinceLastCheck = now.getTime() - lastCheckRef.current.getTime();

                // If more than 5 seconds since last check, check again
                if (timeSinceLastCheck > 5000) {
                    checkSessionValidity();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [checkSessionValidity, isLoginPage]);

    // Check on focus (when window regains focus)
    useEffect(() => {
        if (isLoginPage) return;

        const handleFocus = () => {
            const now = new Date();
            const timeSinceLastCheck = now.getTime() - lastCheckRef.current.getTime();

            // If more than 5 seconds since last check, check again
            if (timeSinceLastCheck > 5000) {
                checkSessionValidity();
            }
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [checkSessionValidity, isLoginPage]);

    // This component doesn't render anything
    return null;
}
