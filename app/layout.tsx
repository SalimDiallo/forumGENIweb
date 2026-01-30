"use client"
import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from './Providers';
import { Toaster } from 'sonner';
import React from 'react';

// Raleway comme police secondaire (Google Fonts)
const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// export const metadata: Metadata = {
//   title: 'Forum GENI Entreprises | INSEA',
//   description: "Association professionnelle de l'INSEA depuis 2002. Connecter l'excellence académique avec le monde professionnel pour façonner les leaders de demain.",
//   icons: {
//     icon: '/logo-symbol.png',
//     shortcut: '/logo-symbol.png',
//     apple: '/logo-symbol.png',
//   },
// };

// Ajout d'un composant de splash vidéo plus fluide et accéléré
function VideoSplashScreen({ onEnd }: { onEnd: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Empêche de défiler le body pendant le splash
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Rend la vidéo plus fluide (60 FPS) et accélérée (vitesse x1.35)
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.5; // Accélère la vidéo (ajuster si besoin)
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={onEnd}
        style={{ 
          transition: 'filter 0.3s',
          filter: 'brightness(1.10) contrast(1.08)',
        }}
        preload="auto"
      />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [splashDone, setSplashDone] = React.useState(false);

  React.useEffect(() => {
    // Si déjà vu dans la session, ne pas remontrer le splash (optionnel)
    if (window.sessionStorage.getItem('splash-done')) {
      setSplashDone(true);
    }
  }, []);

  const handleSplashEnd = () => {
    setSplashDone(true);
    window.sessionStorage.setItem('splash-done', '1');
  };

  return (
    <html lang="fr" className={`scroll-smooth ${raleway.variable}`}>
      <body className="antialiased min-h-screen">
        <Providers>
          <>
            {!splashDone && (
              <VideoSplashScreen onEnd={handleSplashEnd} />
            )}
            {splashDone && (
              <>
                {children}
                <Footer />
                <Toaster theme="light" richColors={true} />
              </>
            )}
          </>
        </Providers>
      </body>
    </html>
  );
}