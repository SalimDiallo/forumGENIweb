// components/Footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Award, 
  Camera, 
  FileText, 
  Briefcase,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ArrowRight,
  ChevronUp,
  ExternalLink,
  Heart,
  Globe,
  Send
} from 'lucide-react';

const Footer = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    setEmail('');
    setIsNewsletterOpen(false);
  };

  const footerLinks = {
    navigation: [
      { name: 'Accueil', path: '/' },
      { name: 'À Propos', path: '/about' },
      { name: 'Événements', path: '/events' },
      { name: 'Galerie', path: '/gallery' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' }
    ],
    events: [
      { name: 'Forum 2025', path: '/events/forum-2025' },
      { name: 'Conférences', path: '/events/conferences' },
      { name: 'Ateliers', path: '/events/workshops' },
      { name: 'Networking', path: '/events/networking' },
      { name: 'Programme complet', path: '/events/schedule' }
    ],
    careers: [
      { name: 'Offres d\'emploi', path: '/careers/jobs' },
      { name: 'Stages', path: '/careers/internships' },
      { name: 'Entreprises partenaires', path: '/careers/partners' },
      { name: 'Conseils carrière', path: '/careers/advice' }
    ],
    resources: [
      { name: 'Documentation', path: '/resources/docs' },
      { name: 'FAQ', path: '/resources/faq' },
      { name: 'Support', path: '/resources/support' },
      { name: 'Politique de confidentialité', path: '/privacy' },
      { name: 'Conditions d\'utilisation', path: '/terms' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, url: '#', color: 'hover:text-sky-500' },
    { name: 'LinkedIn', icon: Linkedin, url: '#', color: 'hover:text-blue-700' },
    { name: 'Instagram', icon: Instagram, url: '#', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: Youtube, url: '#', color: 'hover:text-red-600' }
  ];

  const stats = [
    { number: '500+', label: 'Participants attendus', icon: Users },
    { number: '50+', label: 'Entreprises partenaires', icon: Briefcase },
    { number: '20+', label: 'Conférences & Ateliers', icon: Calendar },
    { number: '10+', label: 'Années d\'excellence', icon: Award }
  ];

  return (
    <>
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40'></div>

        <div className="relative z-10">
          {/* Newsletter Section */}
          <div className="border-b border-white/10">
            <div className="container mx-auto px-6 py-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Restez connecté avec le Forum GENI
                </h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Recevez les dernières actualités, opportunités et annonces directement dans votre boîte mail
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre adresse email"
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    S'abonner
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-b border-white/10">
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-sm font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Brand Section */}
              <motion.div
                className="lg:col-span-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link href="/" className="inline-block mb-6 group">
                  <motion.div 
                    className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg inline-block"
                    whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src="/logo 4.png" 
                      alt="Forum GENI Entreprises" 
                      width={200} 
                      height={60} 
                      className="h-12 w-auto filter drop-shadow-sm"
                    />
                  </motion.div>
                </Link>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Le Forum GENI × INSEA est l'événement de référence pour connecter les étudiants, 
                  diplômés et professionnels dans un environnement d'excellence et d'innovation.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>INSEA, Rabat, Maroc</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>contact@forum-geni.ma</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>+212 5 37 77 XX XX</span>
                  </div>
                </div>
              </motion.div>

              {/* Links Sections */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-lg font-semibold mb-6 text-white">Navigation</h4>
                <ul className="space-y-3">
                  {footerLinks.navigation.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.path}
                        className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold mb-6 text-white">Événements</h4>
                <ul className="space-y-3">
                  {footerLinks.events.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.path}
                        className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="text-lg font-semibold mb-6 text-white">Carrières</h4>
                <ul className="space-y-3">
                  {footerLinks.careers.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.path}
                        className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className="text-lg font-semibent mb-6 text-white">Ressources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.path}
                        className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10">
            <div className="container mx-auto px-6 py-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Copyright */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-gray-400 text-center lg:text-left"
                >
                  <p className="flex items-center justify-center lg:justify-start gap-2">
                    © {currentYear} Forum GENI × INSEA. 
                    <span className="flex items-center gap-1">
                      Fait avec <Heart className="w-4 h-4 text-red-500 animate-pulse" /> au Maroc
                    </span>
                  </p>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-gray-300 ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:shadow-lg`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </motion.div>

                {/* Language Selector */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <Globe className="w-4 h-4" />
                  <select className="bg-transparent border-none text-gray-400 focus:outline-none cursor-pointer">
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-60">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"
            animate={{ 
              background: [
                'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
                'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)',
                'linear-gradient(90deg, #8b5cf6, #10b981, #3b82f6)',
                'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </footer>
    </>
  );
};

Footer.displayName = 'Footer';

export default Footer;