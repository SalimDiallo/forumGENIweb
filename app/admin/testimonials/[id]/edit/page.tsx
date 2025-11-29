import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TestimonialForm } from "../../TestimonialForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTestimonialPage({ params }: PageProps) {
  const { id } = await params;
  const testimonialId = parseInt(id);

  if (isNaN(testimonialId)) {
    notFound();
  }

  const testimonial = await prisma.videoTestimonial.findUnique({
    where: { id: testimonialId },
  });

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/testimonials"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Modifier le Témoignage
            </h1>
            <p className="text-gray-600">{testimonial.name}</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <TestimonialForm testimonial={testimonial} />
      </section>
    </div>
  );
}
