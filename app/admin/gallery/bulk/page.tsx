import { prisma } from "@/lib/db";
import { BulkGalleryForm } from "../BulkGalleryForm";

interface PageProps {
    searchParams: Promise<{
        type?: string;
    }>;
}

export default async function BulkUploadPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const type = params.type === "photo" ? "photo" : "video";

    // Fetch events for dropdown
    const events = await prisma.event.findMany({
        select: {
            id: true,
            title: true,
            startDate: true,
        },
        orderBy: { startDate: "desc" },
        take: 50,
    });

    return (
        <div className="max-w-4xl mx-auto">
            <BulkGalleryForm type={type} events={events} />
        </div>
    );
}
