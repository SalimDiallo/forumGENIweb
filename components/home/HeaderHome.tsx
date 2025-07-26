// components/HeaderHome.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Calendar, Users, Award, Camera, FileText, Briefcase, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const HeaderHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const headerHomeRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll tracking avec framer-motion
  const { scrollY } = useScroll();
  
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer le menu mobile sur changement de route
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Gestion du keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setActiveDropdown(null);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const navItems = [
    { 
      name: 'Accueil', 
      path: '/',
      icon: null
    },
    { 
      name: 'À Propos', 
      path: '/about',
      icon: Users
    },
    { 
      name: 'Événements', 
      path: '/events',
      icon: Calendar,
      hasDropdown: false,
      dropdownItems: [
        { name: 'Forum 2025', path: '/events/forum-2025', description: 'L\'événement principal de l\'année' },
        { name: 'Conférences', path: '/events/conferences', description: 'Rencontres avec les experts' },
        { name: 'Ateliers', path: '/events/workshops', description: 'Sessions pratiques et interactives' },
        { name: 'Networking', path: '/events/networking', description: 'Opportunités de réseautage' }
      ]
    },
    { 
      name: 'Galerie', 
      path: '/gallery',
      icon: Camera
    },
    { 
      name: 'Blog', 
      path: '/blog',
      icon: FileText
    },
    { 
      name: 'Carrières', 
      path: '/careers',
      icon: Briefcase,
      hasDropdown: false,
      dropdownItems: [
        { name: 'Offres d\'emploi', path: '/careers/jobs', description: 'Découvrez les opportunités' },
        { name: 'Stages', path: '/careers/internships', description: 'Programme de stages' },
        { name: 'Entreprises partenaires', path: '/careers/partners', description: 'Nos partenaires recruteurs' }
      ]
    },
    { 
      name: 'Contact', 
      path: '/contact',
      icon: Mail
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <motion.header
        ref={headerHomeRef}
        className={`fixed w-full z-30 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-2xl border-b border-gray-200/30 shadow-2xl shadow-black/10'
            : 'bg-slate-900/30 backdrop-blur-xl'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ 
          backgroundColor: scrolled ? 'rgba(255,255,255,0.90)' : 'rgba(15,23,42,0.30)',
        }}
      >
        {/* Bande décorative supérieure avec animation */}
        {/* <motion.div 
          className="h-1 bg-gradient-to-r from-emerald-500  via-purple-500 to-emerald-500 bg-[length:200%_100%]"
          animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
          transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
        />
         */}
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo amélioré avec micro-interactions */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                className={`relative transition-all duration-500 ${
                  scrolled 
                    ? 'p-3 bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg' 
                    : 'p-2 bg-slate-900/60 backdrop-blur-2xl rounded-2xl shadow-emerald-500/10 shadow-lg'
                }`}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -1, 1, 0],
                  transition: { duration: 0.6 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/logo 4.png" 
                  alt="Forum GENI Entreprises" 
                  width={180} 
                  height={50} 
                  className="h-10 w-auto transition-all duration-500 filter drop-shadow-sm"
                  priority
                />
                
                {/* Glow effect */}
                <motion.div 
                  className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500 -z-10 ${scrolled ? 'bg-white/0' : 'bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-80'}`}
                  animate={scrolled ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation améliorée */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                >
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => handleDropdownToggle(item.name)}
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        className={`relative group px-4 py-3 font-medium rounded-xl transition-all duration-300 flex items-center gap-2 ${
                          isActive(item.path)
                            ? scrolled 
                              ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' 
                              : 'text-white bg-emerald-500/10 border border-emerald-400/30'
                            : scrolled 
                              ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/80' 
                              : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.name}
                        <motion.div
                          animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                        
                        {/* Active indicator */}
                        {isActive(item.path) && (
                          <motion.div
                            className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-emerald-500 rounded-full"
                            layoutId="activeTab"
                            initial={false}
                            style={{ x: '-50%' }}
                          />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            <div className="p-2">
                              {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                                <motion.div
                                  key={dropdownIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: dropdownIndex * 0.05 }}
                                >
                                  <Link
                                    href={dropdownItem.path}
                                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 transition-all duration-200"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div>
                                      <div className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                                        {dropdownItem.name}
                                      </div>
                                      <div className="text-sm text-gray-500 mt-0.5">
                                        {dropdownItem.description}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all duration-200" />
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.path}
                      prefetch={true}
                      className={`relative group px-4 py-3 font-medium rounded-xl transition-all duration-300 flex items-center gap-2 ${
                        isActive(item.path)
                          ? scrolled 
                            ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' 
                            : 'text-white bg-emerald-500/10 border border-emerald-400/30'
                          : scrolled 
                            ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/80' 
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.name}
                      
                      {/* Active indicator */}
                      {isActive(item.path) && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-emerald-500 rounded-full"
                          layoutId="activeTab"
                          initial={false}
                          style={{ x: '-50%' }}
                        />
                      )}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* CTA Button amélioré */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Link href="/events">
                <motion.button
                  className="relative px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg hover:shadow-emerald-500/30 group"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.3), 0 10px 10px -5px rgba(16, 185, 129, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100"
                    initial={false}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 animate-shimmer" />
                  
                  <span className="relative flex items-center gap-2">
                    Participer
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Mobile Menu Button amélioré */}
            <motion.button
              onClick={toggleMenu}
              className={`lg:hidden p-3 transition-all duration-300 rounded-xl relative overflow-hidden ${
                scrolled 
                  ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                  : 'text-white/90 hover:text-white hover:bg-slate-900/40'
              }`}
              aria-label="Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X size={24} className='text-black' />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Overlay amélioré */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop avec blur effect */}
            <motion.div 
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl"
              onClick={() => setIsMenuOpen(false)}
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(20px)' }}
              exit={{ backdropFilter: 'blur(0px)' }}
            />

            
            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white/98 backdrop-blur-3xl border-l border-gray-200/30 shadow-3xl overflow-y-auto"
            >
                <motion.button
                  onClick={toggleMenu}
                  className={`lg:hidden pt-6 transition-all duration-300 rounded-xl relative overflow-hidden flex w-full px-8 justify-end ${
                    scrolled 
                      ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                      : 'text-white/90 hover:text-white hover:bg-slate-900/40'
                  }`}
                  aria-label="Menu"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <X size={24} className='text-black' />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Menu size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              <div className="p-6">
                {/* Navigation Links avec animations staggered */}
                <nav className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      <Link
                        href={item.path}
                        prefetch={true}
                        className={`group flex items-center justify-between px-4 py-4 transition-all duration-300 rounded-xl ${
                          isActive(item.path)
                            ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                            : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <item.icon className={`w-5 h-5 ${
                              isActive(item.path) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'
                            }`} />
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        
                        {item.hasDropdown ? (
                          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all duration-200" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA amélioré */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-8 pt-6 border-t border-gray-200/50"
                >
                  <Link href="/events" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 relative overflow-hidden group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Participer au Forum 2025
                      </span>
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Contact Info amélioré */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mt-8 pt-6 border-t border-gray-200/50"
                >
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-500">
                      Forum GENI × INSEA
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
                      <Award className="w-4 h-4" />
                      <span>Excellence • Innovation • Leadership</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles personnalisés */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

HeaderHome.displayName = 'HeaderHome';

export default HeaderHome;