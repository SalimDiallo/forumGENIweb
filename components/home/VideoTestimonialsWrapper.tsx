// Server Component Wrapper for VideoTestimonials
import VideoTestimonials from "@/components/VideoTestimonials";
import { prisma } from "@/lib/db";

export default async function VideoTestimonialsWrapper() {
  // Fetch active testimonials from database, ordered by sortOrder
  const testimonials = await prisma.videoTestimonial.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  // Don't render section if no testimonials available
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return <VideoTestimonials testimonials={testimonials} />;
}
