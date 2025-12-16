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
        image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80"
        badge="Contactez-nous"
      />
      <Contact />
      <ContactForm />
    </main>
  );
}
