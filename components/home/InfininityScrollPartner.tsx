'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Handshake } from 'lucide-react';
import Link from 'next/link';
import { partners } from '@/lib/data/partners.data';

  // Partner Card Component
  export const PartnerCard = ({ partner }: { partner: typeof partners[0] }) => (
    <Link
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative flex-shrink-0"
      tabIndex={0}
    >
      <div className="relative bg-white border border-neutral-200/60 rounded-lg p-5 md:p-7 h-28 md:h-32  flex items-center justify-center
        transition-all duration-300 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-900/5 hover:-translate-y-0.5"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={partner.logo}
            alt={partner.name}
            width={200}
            height={100}
            className="max-h-14 md:max-h-20 w-auto object-contain transition-all duration-300 group-hover:scale-105"
          />
        </div>
        {/* Tooltip-on-hover (desktop only) */}
        <div className="hidden md:block absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          <div className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg relative">
            {partner.name}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
          </div>
        </div>
      </div>
    </Link>
  );

  // Infinite Scroll Row Component using CSS animations (inspired by InfiniteMovingCards)
 export  const InfiniteScrollRow = ({
    items,
    duration,
    reverse = false,
  }: {
    items: typeof partners;
    duration: number;
    reverse?: boolean;
  }) => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [start, setStart] = useState(false);

    useEffect(() => {
      if (scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        // Duplicate items for seamless infinite scroll
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        setStart(true);
      }
    }, []);

    return (
      <div
        className="w-full overflow-hidden relative"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div
          ref={scrollerRef}
          className="flex items-center gap-6 md:gap-8 lg:gap-10 w-max"
          style={{
            animation: start
              ? `scroll ${duration}s linear infinite ${reverse ? 'reverse' : 'forwards'}`
              : 'none',
          }}
        >
          {items.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    );
  };