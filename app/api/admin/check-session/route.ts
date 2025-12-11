import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * API endpoint to check if the current user's session is still valid
 * This checks the database directly to ensure we have fresh data
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { valid: false, reason: "no_session" },
                { status: 401 }
            );
        }

        // Get fresh user data from database
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                isActive: true,
                role: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { valid: false, reason: "user_not_found" },
                { status: 401 }
            );
        }

        if (user.isActive === false) {
            return NextResponse.json(
                { valid: false, reason: "account_disabled" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            valid: true,
            user: {
                id: user.id,
                isActive: user.isActive,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Session validity check error:", error);
        return NextResponse.json(
            { valid: false, reason: "error" },
            { status: 500 }
        );
    }
}
