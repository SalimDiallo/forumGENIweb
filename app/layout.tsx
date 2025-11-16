import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from './Providers';
import { Toaster } from 'sonner';

// Raleway comme police secondaire (Google Fonts)
const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// Clash Display et Britney sont importés via globals.css depuis les fichiers locaux

export const metadata: Metadata = {
  title: 'Forum GENI Entreprises | INSEA',
  description: 'Association professionnelle de l\'INSEA depuis 2002. Connecter l\'excellence académique avec le monde professionnel pour façonner les leaders de demain.',
  icons: {
    icon: '/logo-symbol.png',
    shortcut: '/logo-symbol.png',
    apple: '/logo-symbol.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="fr" className={`scroll-smooth ${raleway.variable}`}>
      <body className="antialiased min-h-screen">
        <Providers>
          <>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </>
        </Providers>
      </body>
    </html>
  );
}