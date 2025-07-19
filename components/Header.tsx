// components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { 
      name: 'Accueil', 
      path: '/' 
    },
    { 
      name: 'À Propos', 
      path: '/about'
    },
    { 
      name: 'Événements', 
      path: '/events'
    },
    { 
      name: 'Galerie', 
      path: '/gallery'
    },
    { 
      name: 'Blog', 
      path: '/blog'
    },
    { 
      name: 'Carrières', 
      path: '/careers'
    },
    { 
      name: 'Contact', 
      path: '/contact'
    }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      {/* Bande décorative supérieure */}
      <div className="h-2 bg-gradient-to-r from-[#228B22] via-indigo-600 to-[#228B22]"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="">
             <Image
               src="/logo 4.png" 
                alt="Forum GENI Entreprises" 
                width={180} 
                height={50} 
               className='h-12 w-auto'
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                prefetch={true}
                className="px-4 py-2 text-gray-700 hover:text-[#228B22] font-medium transition-colors rounded-lg hover:bg-green-50"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-[#228B22] transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-100"
            >
              <nav className="flex flex-col gap-2 pt-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    prefetch={true}
                    className="px-4 py-3 text-gray-700 hover:text-[#228B22] hover:bg-green-50 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export default Header;