// Server Component Wrapper for VideoTestimonials
import VideoTestimonials from "@/components/VideoTestimonials";

// Données de démonstration avec vidéos depuis Pexels
const fakeTestimonials = [
  {
    id: 1,
    name: "Sarah El Mansouri",
    position: "Data Scientist",
    company: "Google",
    graduationYear: 2020,
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=165&oauth2_token_id=57447761",
    thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
    quote: "L'association GENI m'a permis de développer mes compétences techniques tout en créant un réseau professionnel solide.",
    fullTranscript: "Mon expérience au sein de GENI a été transformatrice...",
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 2,
    name: "Youssef Benali",
    position: "Software Engineer",
    company: "Microsoft",
    graduationYear: 2019,
    videoUrl: "https://player.vimeo.com/external/395925944.sd.mp4?s=eed3a7830b3a5be1f0e1cd12f3d45e3f4e7cbf09&profile_id=165&oauth2_token_id=57447761",
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    quote: "Grâce au Forum GENI, j'ai pu rencontrer des professionnels qui ont changé ma trajectoire de carrière.",
    fullTranscript: "Le Forum GENI a été un tournant décisif...",
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 3,
    name: "Amina Zahiri",
    position: "Product Manager",
    company: "Amazon",
    graduationYear: 2021,
    videoUrl: "https://player.vimeo.com/external/397719386.sd.mp4?s=e04327e3cdf95debbbb5bb42d8e2705d23c52edd&profile_id=165&oauth2_token_id=57447761",
    thumbnailUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop",
    quote: "Les événements organisés par GENI m'ont aidée à comprendre les enjeux réels du monde professionnel.",
    fullTranscript: "Participer aux événements GENI...",
    isFeatured: false,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 4,
    name: "Mehdi Alaoui",
    position: "Machine Learning Engineer",
    company: "Meta",
    graduationYear: 2018,
    videoUrl: "https://player.vimeo.com/external/404081395.sd.mp4?s=5c1a8e22a5fb75ba9d8db2d7b1e4b3a0f3f5e8c3&profile_id=165&oauth2_token_id=57447761",
    thumbnailUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop",
    quote: "GENI est bien plus qu'une association, c'est une communauté qui accompagne vers l'excellence.",
    fullTranscript: "Mon parcours chez GENI...",
    isFeatured: true,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 5,
    name: "Fatima Mouhib",
    position: "DevOps Engineer",
    company: "OVHcloud",
    graduationYear: 2022,
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=165&oauth2_token_id=57447761",
    thumbnailUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&auto=format&fit=crop",
    quote: "Les ateliers techniques organisés par GENI m'ont donné une longueur d'avance sur le marché du travail.",
    fullTranscript: "Les compétences acquises grâce à GENI...",
    isFeatured: false,
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 6,
    name: "Omar Chakir",
    position: "Cloud Architect",
    company: "AWS",
    graduationYear: 2017,
    videoUrl: "https://player.vimeo.com/external/395925944.sd.mp4?s=eed3a7830b3a5be1f0e1cd12f3d45e3f4e7cbf09&profile_id=165&oauth2_token_id=57447761",
    thumbnailUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop",
    quote: "Le réseau d'anciens élèves de GENI continue de m'ouvrir des portes même des années après ma graduation.",
    fullTranscript: "Le réseau professionnel créé via GENI...",
    isFeatured: false,
    isActive: true,
    sortOrder: 6,
  },
];

export default async function VideoTestimonialsWrapper() {
  // Utiliser les données de démonstration
  const testimonials = fakeTestimonials;

  // Don't render section if no testimonials available
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return <VideoTestimonials testimonials={testimonials} />;
}
