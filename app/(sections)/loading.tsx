"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Animation CSS styles (see context)
const introKeyframes = `
@keyframes intro-zoom-in {
  0% {
    opacity: 0;
    transform: scale(0.6);
    filter: blur(8px);
  }
  50% {
    opacity: 1;
    transform: scale(1.035);
    filter: blur(0px);
  }
  85% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0px);
  }
}
`;

// CSS/animation injection for client-side hydration
if (typeof window !== "undefined") {
  if (!document.getElementById("intro-zoom-in-style")) {
    const style = document.createElement("style");
    style.id = "intro-zoom-in-style";
    style.innerHTML = introKeyframes;
    document.head.appendChild(style);
  }
}

export default function SimpleLoader() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowIntro(true), 40);
  }, []);

  return (
    <div className="min-h-[30vh] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex flex-col items-center justify-center">
          {/* Background soft glow spinner */}
          <span className="block w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 opacity-20 absolute top-0 left-0 blur-lg"></span>
          {/* Foreground Logo with intro zoom and subtle loader */}
          <div
            style={{
              animation: showIntro
                ? "intro-zoom-in 0.88s cubic-bezier(0.77,0,0.18,1) forwards"
                : undefined,
              opacity: showIntro ? 1 : 0,
              transform: !showIntro ? "scale(0.7)" : "scale(1)"
            }}
            className="relative z-10"
          >
            <Image
              src="/logo 4.png"
              alt="Forum Madom Logo"
              width={100}
              height={66}
              className="select-none pointer-events-none"
              priority
              draggable={false}
            />
            {/* Loader spinner on logo */}
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 animate-spin-slow text-emerald-600 pointer-events-none"
              style={{ zIndex: 2, opacity: 0.5 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 48 48"
            >
              <circle
                className="opacity-10"
                cx="24"
                cy="24"
                r="19"
                stroke="currentColor"
                strokeWidth="7"
              />
              <path
                d="M44 24c0-11.046-8.954-20-20-20"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                className="opacity-85"
              />
            </svg>
          </div>
          <style dangerouslySetInnerHTML={{__html:`
            @keyframes spin-slow { 
              0% {transform: rotate(0deg);}
              100% {transform: rotate(360deg);}
            }
            .animate-spin-slow {animation: spin-slow 1.5s linear infinite;}
          `}} />
        </div>
        <div
          className={`text-xl font-semibold text-emerald-800 mt-2 transition-opacity duration-600 ${
            showIntro ? "opacity-100" : "opacity-0"
          }`}
        >
          Chargement...
        </div>
      </div>
    </div>
  );
}
