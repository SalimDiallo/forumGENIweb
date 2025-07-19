'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const Blog = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center p-1 bg-green-100 rounded-full mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-green-800 text-white rounded-full">
              Actualités
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Blog & Actualités
          </h1>
          <p className="text-xl text-green-700/80 max-w-3xl mx-auto">
            Découvrez les dernières actualités, analyses et tendances du monde de l'entreprise et de l'innovation
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
