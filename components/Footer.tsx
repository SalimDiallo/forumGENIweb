// components/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Heart, Mail, Phone, MapPin } from 'lucide-react';

// For "sticky" footer: 
// - "w-full" ensures width,
// - "mt-auto" (if using flex-col min-h-screen on parent) ensures it pushes to bottom,
// - "fixed bottom-0" always sticks, but can obstruct content. 
// Using "relative" and "min-h-[theme(minHeight.screen)]" is usually handled in parent/layout!
// Here, we ensure footer is at least stuck to bottom in all contexts.

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'YouTube', icon: Youtube, url: '#' }
  ];

  return (
    <footer
      className="bg-slate-900 text-white py-10 w-full relative"
      style={{ marginTop: 'auto' }} // For layouts that use flex-col, min-h-screen
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="inline-block">
            <Image
              src="/logo 4.png"
              alt="Forum GENI Entreprises"
              width={160}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <p className="text-gray-400 text-center md:text-left text-sm max-w-xs">
            Le Forum GENI × INSEA connecte étudiants, diplômés et professionnels dans un environnement d'excellence.
          </p>
          <div className="flex flex-col gap-1 text-gray-400 text-sm">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-800" /> INSEA, Rabat</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-800" /> contact@forum-geni.ma</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-800" /> +212 5 37 77 XX XX</span>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-emerald-600 transition"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-xs flex items-center gap-1 mt-2">
            © {currentYear} Forum GENI × INSEA. Fait avec <Heart className="w-4 h-4 text-red-500" /> au Maroc
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;