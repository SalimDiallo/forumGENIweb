import type { Metadata } from 'next';
import Header from '@/components/Header';



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
    <html lang="fr" className="scroll-smooth">
      <body className={` antialiased min-h-screen`}>
        <Header />
        <div className='py-18'>
        {children}
        </div>
      </body>
    </html>
  );
}