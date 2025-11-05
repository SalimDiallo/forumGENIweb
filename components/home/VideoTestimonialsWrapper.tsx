// Server Component Wrapper for VideoTestimonials
import { getActiveTestimonials } from "@/app/actions/home-sections";
import VideoTestimonials from "@/components/VideoTestimonials";

export default async function VideoTestimonialsWrapper() {
  const result = await getActiveTestimonials();

  // Fallback to empty array if no testimonials found or if action failed
  const testimonials = result?.data?.testimonials || [];

  // Don't render section if no testimonials available
  if (testimonials.length === 0) {
    return null;
  }

  return <VideoTestimonials testimonials={testimonials} />;
}
