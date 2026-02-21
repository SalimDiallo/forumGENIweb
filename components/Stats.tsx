'use client';

import { Users, Building, Calendar, Award } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const stats = [
  {
    icon: Users,
    number: 5000,
    label: "Participants",
    suffix: "+"
  },
  {
    icon: Building,
    number: 85,
    label: "Partenaires"
  },
  {
    icon: Calendar,
    number: 127,
    label: "Événements"
  },
  {
    icon: Award,
    number: 23,
    label: "Années d'Excellence"
  }
];

// Composant pour animer le compteur avec easing
const AnimatedCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2500; // 2.5 secondes pour plus de fluidité

    // Fonction d'easing pour une animation plus naturelle (ease-out)
    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Applique l'easing pour un mouvement fluide
      const easedProgress = easeOutQuart(progress);
      const currentCount = Math.floor(easedProgress * end);

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // S'assurer que la valeur finale est exacte
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isVisible, end]);

  return (
    <div ref={counterRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tabular-nums mb-2">
      {count.toLocaleString()}<span className="text-emerald-600">{suffix}</span>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* En-tête minimal */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-3">
            L'impact en chiffres
          </h2>
          <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
            Des résultats concrets qui témoignent de notre engagement et de notre impact.
          </p>
        </div>

        {/* Statistiques - Grand format professionnel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center group"
            >
              {/* Icône en noir */}
              <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 text-neutral-900 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                <stat.icon size={20} strokeWidth={1.5} />
              </div>

              {/* Grand nombre avec animation - Focus principal */}
              <AnimatedCounter end={stat.number} suffix={stat.suffix} />

              {/* Label sobre */}
              <div className="text-sm md:text-base text-neutral-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;