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

// Splash vidéo forcée à 5s max, quelle que soit la durée réelle de la vidéo
function VideoSplashScreen({ onEnd }: { onEnd: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = React.useState("/intro.mp4");
  const [isMobile, setIsMobile] = React.useState(false);

  // Détecte mobile pour charger une version plus light
  React.useEffect(() => {
    const mobile = typeof window !== "undefined"
      ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      : false;
    setIsMobile(mobile);

    if (mobile) {
      setVideoSource("/intro-low.mp4");
    }
  }, []);

  // Empêche de défiler le body pendant le splash
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Accélère la vidéo pour durer 5 secondes
  React.useEffect(() => {
    if (videoRef.current) {
      // On utilise l'événement loadedmetadata pour régler le playbackRate selon la durée réelle
      const handleLoadedMeta = () => {
        if (videoRef.current) {
          const duration = videoRef.current.duration;
          // Pour éviter les divisions par zéro ou durées inconnues, playbackRate = durée réelle / 5 (sec)
          if (duration && duration > 0) {
            videoRef.current.playbackRate = duration / 5;
          } else {
            // fallback, on garde valeur très rapide
            videoRef.current.playbackRate = 5.0;
          }
        }
      };
      videoRef.current.addEventListener("loadedmetadata", handleLoadedMeta);
      // Si metadata déjà chargé, appelez tout de suite
      if (videoRef.current.readyState >= 1) {
        handleLoadedMeta();
      }
      return () => {
        if (videoRef.current)
          videoRef.current.removeEventListener("loadedmetadata", handleLoadedMeta);
      };
    }
  }, [videoSource]);

  // Démarrage automatique de la vidéo si possible
  React.useEffect(() => {
    if (videoRef.current) {
      const promise = videoRef.current.play();
      if (promise && promise.catch) {
        promise.catch(() => {
          // Certains navigateurs peuvent refuser le play auto (muted uniquement donc ça va)
        });
      }
    }
  }, [videoSource]);

  // Déclencher onEnd automatiquement au bout de 5 secondes au maximum (sûreté)
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (onEnd) onEnd();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [onEnd]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={videoSource}
        autoPlay
        muted
        playsInline
        poster="/logo-symbol.png"
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