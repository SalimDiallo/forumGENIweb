import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TestimonialForm } from "../TestimonialForm";

export default function CreateTestimonialPage() {
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
              Nouveau Témoignage Vidéo
            </h1>
            <p className="text-gray-600">
              Ajoutez un témoignage vidéo YouTube (vidéo publique ou non répertoriée)
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <TestimonialForm />
      </section>
    </div>
  );
}
