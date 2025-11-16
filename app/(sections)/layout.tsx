import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forum GENI Entreprises | INSEA',
  description: 'Association professionnelle de l\'INSEA depuis 2002. Connecter l\'excellence académique avec le monde professionnel pour façonner les leaders de demain.',
  icons: {
    icon: '/logo-symbol.png',
    shortcut: '/logo-symbol.png',
    apple: '/logo-symbol.png',
  },
};

export default function SectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='py-18'>
      {children}
    </div>
  );
}