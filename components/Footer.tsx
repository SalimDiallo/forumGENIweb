// components/Footer.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Heart, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'YouTube', icon: Youtube, url: '#' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter logic here
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-white py-10">
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

        {/* Newsletter */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <h4 className="font-semibold mb-2">Newsletter</h4>
          <p className="text-gray-400 text-sm text-center">
            Recevez les dernières actualités et annonces du Forum GENI × INSEA.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Votre email"
              className="flex-1 px-3 py-2 rounded-l-md bg-white/10 text-white placeholder-gray-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 rounded-r-md hover:bg-emerald-700 transition flex items-center"
              aria-label="S'abonner"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
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
                className="p-2  bg-white/10 hover:bg-emerald-600 transition"
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