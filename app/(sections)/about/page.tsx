import BookHistory from '@/components/BookHistory';
import TeamsMembres from '@/components/TeamsMembres';
import Stats from '@/components/Stats';
import PageHero from '@/components/PageHero';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <PageHero
        title="À Propos"
        subtitle="Découvrez l'histoire et la mission du Forum Génie Entreprise"
        image="/insea-building.jpg"
      />

      <BookHistory />
      <TeamsMembres />
      <Stats />
    </main>
  );
}
