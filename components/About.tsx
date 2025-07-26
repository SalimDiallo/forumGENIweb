'use client';

import React from 'react';
import { Calendar, Users, Award, Target } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-700 font-semibold rounded-full text-xs tracking-widest shadow-sm uppercase">
            Depuis 2002
          </span>
        </div>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1 bg-green-50 text-green-700 rounded-full mb-4 font-semibold text-xs uppercase tracking-widest shadow">
            Notre Histoire
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            À Propos du Forum GENI INSEA
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Depuis 2002, nous connectons l'excellence académique de l'INSEA avec les leaders du monde professionnel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8">
          {/* Histoire */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Notre Histoire
            </h2>
            <div className="space-y-4 text-gray-600 text-base md:text-lg">
              <p>
                Fondé en 2002 par des étudiants visionnaires de l'INSEA, le Forum GENI INSEA
                est né d'une ambition simple : créer un pont durable entre l'excellence académique
                et l'innovation entrepreneuriale.
              </p>
              <p>
                Au fil des années, nous avons rassemblé plus de 500 experts, entrepreneurs et
                décideurs qui partagent notre vision d'un écosystème économique marocain dynamique
                et inclusif.
              </p>
              <p>
                Aujourd'hui, notre forum annuel est devenu un rendez-vous incontournable pour tous
                ceux qui façonnent l'avenir économique du Maroc et de l'Afrique.
              </p>
            </div>
          </div>

          {/* Moments Clés */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-green-800 mb-6 tracking-wide uppercase">Moments Clés</h3>
              <ol className="relative border-l-2 border-green-100 pl-6 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shadow border border-green-100">
                    <Calendar className="text-green-400" size={22} />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">2002</p>
                    <p className="text-green-700 text-sm">Création du Forum</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shadow border border-green-100">
                    <Users className="text-green-400" size={22} />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">2012</p>
                    <p className="text-green-700 text-sm">1er Forum International</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shadow border border-green-100">
                    <Award className="text-green-400" size={22} />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">2018</p>
                    <p className="text-green-700 text-sm">Prix Excellence Innovation</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shadow border border-green-100">
                    <Target className="text-green-400" size={22} />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">2025</p>
                    <p className="text-green-700 text-sm">23ème édition</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
