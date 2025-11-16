'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BookHistory from '@/components/BookHistory';
import { Target, Eye, Users, Award, Building, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import TeamsMembres from '@/components/TeamsMembres';
import Stats from '@/components/Stats';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Book History Section */}
      <BookHistory />

      <TeamsMembres />
      <Stats />

    </main>
  );
}
