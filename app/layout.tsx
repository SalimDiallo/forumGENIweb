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

// Optimisation du splash pour mobiles et faibles connexions
function VideoSplashScreen({ onEnd }: { onEnd: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = React.useState("/intro-low.mp4");
  const [isMobile, setIsMobile] = React.useState(false);

  // Détecte mobile pour charger une version plus light
  React.useEffect(() => {
    // Option 1: User agent check (simple, non exhaustif)
    const mobile = typeof window !== "undefined"
      ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      : false;
    setIsMobile(mobile);

    // Si besoin, version basse qualité dispo en /intro-low.mp4 sinon fallback
    if (mobile) {
      setVideoSource("/intro-low.mp4"); // Doit être pré-générée (mp4 optimisé ~360p, low bitrate)
    }
  }, []);

  // Empêche de défiler le body pendant le splash
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Rend la vidéo plus fluide et accélérée (mais respect du device et perf faible)
  React.useEffect(() => {
    if (videoRef.current) {
      // Si mobile ou connexion faible, augmentez peu la vitesse (préserve expérience)
      if (isMobile) {
        videoRef.current.playbackRate = 2.5;
      } else {
        videoRef.current.playbackRate = 2.0; // Desktop : rapide
      }
    }
  }, [isMobile]);

  // ==> CHARGEMENT AUTO dès le montage (dès que composant monté, lance la vidéo si possible)
  React.useEffect(() => {
    // Pour s'assurer que la vidéo démarre TOUT DE SUITE si possible
    if (videoRef.current) {
      const promise = videoRef.current.play();
      if (promise && promise.catch) {
        promise.catch(() => {
          // Sur certains navigateurs le play auto peut échouer sans interaction; ce n'est pas grave ici (muted)
        });
      }
    }
  }, [videoSource]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={videoSource}
        autoPlay
        muted
        playsInline
        // Si possible, force un démarrage rapide/bas débit pour mobile+faible réseau
        poster="/logo-symbol.png" // Affiche un fallback rapide en attendant le chargement vidéo
        onEnded={onEnd}
        style={{
          transition: 'filter 0.3s',
          filter: 'brightness(1.10) contrast(1.08)',
          objectFit: 'cover',
          width: '100vw',
          height: '100vh',
        }}
        preload="auto"
      >
        {/* Fallback image si vidéo ne charge pas sur vieux navigateur */}
        <img src="/logo-symbol.png" alt="Forum GENI Entreprises" />
      </video>
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
    if (typeof window !== "undefined" && window.sessionStorage.getItem('splash-done')) {
      setSplashDone(true);
    }
  }, []);

  const handleSplashEnd = () => {
    setSplashDone(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem('splash-done', '1');
    }
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