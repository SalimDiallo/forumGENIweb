// components/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, Users, Camera, FileText, Briefcase, Mail, ArrowRight, School } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile sur changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Gestion du keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { name: 'Accueil', path: '/', icon: null },
    { name: 'À Propos', path: '/about', icon: Users },
    { name: 'INSEA', path: '/insea', icon: School },
    { name: 'Événements', path: '/events', icon: Calendar },
    { name: 'Galerie', path: '/gallery', icon: Camera },
    { name: 'Blog', path: '/blog', icon: FileText },
    { name: 'Carrières', path: '/careers', icon: Briefcase },
    { name: 'Contact', path: '/contact', icon: Mail }
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const isHomePage = pathname === '/';

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
          : 'bg-transparent'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className={`relative transition-all duration-300 ${scrolled || !isHomePage
                  ? 'bg-white rounded-lg p-1.5 shadow-sm'
                  : ''
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Effet blur blanc derrière le logo */}
                <div className="absolute inset-0 bg-white/80 blur-xl rounded-2xl -z-10" />
                <Image
                  src="/logo.svg"
                  alt="Forum GENI"
                  width={140}
                  height={40}
                  className="h-8 sm:h-9 w-auto relative z-10"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  prefetch={true}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${isActive(item.path)
                    ? scrolled || !isHomePage
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-white bg-white/15'
                    : scrolled || !isHomePage
                      ? 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.div
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${scrolled || !isHomePage ? 'bg-emerald-600' : 'bg-white'
                        }`}
                      layoutId="navIndicator"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link href="/events">
                <motion.button
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${scrolled || !isHomePage
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-white text-emerald-700 hover:bg-white/90'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Forum 2025</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled || !isHomePage
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
                }`}
              aria-label="Menu"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Image
                  src="/logo.svg"
                  alt="Forum GENI"
                  width={120}
                  height={35}
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                        ? 'text-emerald-700 bg-emerald-50 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon && (
                        <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-emerald-600' : 'text-gray-400'
                          }`} />
                      )}
                      <span>{item.name}</span>
                      {isActive(item.path) && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
                <Link href="/events" onClick={() => setIsMenuOpen(false)}>
                  <motion.button
                    className="w-full py-3.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Découvrir le Forum 2025</span>
                  </motion.button>
                </Link>
                <p className="text-center text-xs text-gray-500 mt-3">
                  Forum GENI × INSEA • Excellence & Innovation
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

Header.displayName = 'Header';

export default Header;