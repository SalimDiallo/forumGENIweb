import Contact from '@/components/Contact';
import ContactForm from '@/components/ContactForm';
import Hero from '@/components/Hero';
import PageHero from '@/components/PageHero';

export default function ContactPage() {
  return (
    <main className='min-h-screen'>
      <PageHero
        title="Contact"
        subtitle="Nous sommes à votre écoute pour toute question ou demande de partenariat"
        image="/insea-building.jpg"
        badge="Contactez-nous"
      />
      <Contact />
      <ContactForm />
    </main>
  );
}
