"use client"
import { Raleway } from 'next/font/google';
import './globals.css';
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

// Splash vidéo avec vitesse accélérée
function VideoSplashScreen({ onEnd }: { onEnd: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = React.useState("/intro-low.mp4");

  // Détecte mobile pour charger une version plus light
  React.useEffect(() => {
    const mobile = typeof window !== "undefined"
      ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      : false;

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

  // Accélère la vitesse de lecture de la vidéo (2x plus rapide)
  React.useEffect(() => {
    if (videoRef.current) {
      const handleLoadedMeta = () => {
        if (videoRef.current) {
          // Vitesse 2x pour accélérer la vidéo (ajustable selon vos besoins)
          videoRef.current.playbackRate = 2.0;
        }
      };
      videoRef.current.addEventListener("loadedmetadata", handleLoadedMeta);
      if (videoRef.current.readyState >= 1) {
        handleLoadedMeta();
      }
      return () => {
        if (videoRef.current)
          videoRef.current.removeEventListener("loadedmetadata", handleLoadedMeta);
      };
    }
  }, [videoSource]);

  // Force la vidéo à démarrer automatiquement, SANS aucun bouton "play"
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.controls = false;

      // Tentative de lecture automatique
      const attemptPlay = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          // Si autoplay échoue, on réessaie après un court délai
          setTimeout(() => {
            videoRef.current?.play().catch(() => {
              // En dernier recours, on garde la vidéo en muted autoplay
            });
          }, 100);
        }
      };

      attemptPlay();
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
        poster="/logo-symbol.png"
        onEnded={onEnd}
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        style={{
          transition: 'filter 0.3s',
          filter: 'brightness(1.10) contrast(1.08)',
          objectFit: 'cover',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        preload="auto"
        tabIndex={-1}
        className="[&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-panel]:hidden"
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