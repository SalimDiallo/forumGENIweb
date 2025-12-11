"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, Home, Mail } from "lucide-react";
import Link from "next/link";
import { getRoleDisplayName, type UserRole } from "@/lib/permissions";

export default function AccessDeniedPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requiredRole = searchParams.get("required") as UserRole | null;

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <ShieldX className="w-10 h-10 text-red-600" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Accès refusé
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-2">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>

                {requiredRole && (
                    <p className="text-sm text-gray-500 mb-8">
                        Rôle minimum requis:{" "}
                        <span className="font-semibold text-gray-700">
                            {getRoleDisplayName(requiredRole)}
                        </span>
                    </p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                    <Link
                        href="/admin"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 rounded-lg text-white font-medium hover:bg-gray-800 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Dashboard
                    </Link>
                </div>

                {/* Contact admin hint */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600">
                        Si vous pensez avoir besoin d'accès à cette page, contactez un{" "}
                        <span className="font-medium">Super Administrateur</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
