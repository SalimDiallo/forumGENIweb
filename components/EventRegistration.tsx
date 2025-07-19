'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, MapPin, Users, Send } from 'lucide-react';

const EventRegistration = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    experience: '',
    expectations: '',
    dietaryRestrictions: '',
    newsletter: true
  });

  const upcomingEvents = [
    {
      id: 'forum-2025',
      name: 'Forum GENI Entreprises 2025',
      date: '3-5 mai 2025',
      location: 'INSEA Rabat',
      price: 'Gratuit',
      description: '17ème édition de notre forum annuel'
    },
    {
      id: 'ai-workshop',
      name: 'Atelier Intelligence Artificielle',
      date: '15 mars 2025',
      location: 'INSEA Rabat',
      price: '200 DH',
      description: 'Workshop pratique sur l\'IA en entreprise'
    },
    {
      id: 'networking-casa',
      name: 'Soirée Networking Casablanca',
      date: '28 février 2025',
      location: 'Casablanca',
      price: '150 DH',
      description: 'Rencontrez notre communauté d\'entrepreneurs'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inscription:', { event: selectedEvent, ...formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
              Inscription aux Événements
            </h2>
            <p className="text-lg text-green-700/80">
              Réservez votre place pour nos prochains événements
            </p>
          </motion.div>

          {/* Sélection d'événement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-green-900 mb-4">Choisissez votre événement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className={`cursor-pointer border rounded-xl p-4 transition-all ${
                    selectedEvent === event.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-green-200 hover:border-green-300'
                  }`}
                >
                  <h4 className="font-bold text-green-900 mb-2">{event.name}</h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-800 font-medium">{event.price}</span>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">{event.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Formulaire d'inscription */}
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-green-50 rounded-xl p-8 border border-green-100"
            >
              <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
                <UserPlus size={24} />
                Formulaire d'inscription
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-green-900 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-green-900 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-green-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-green-900 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Informations professionnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-green-900 mb-2">
                      Organisation/Entreprise
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-green-900 mb-2">
                      Poste/Fonction
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-green-900 mb-2">
                    Niveau d'expérience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez votre niveau</option>
                    <option value="student">Étudiant</option>
                    <option value="junior">Junior (0-2 ans)</option>
                    <option value="intermediate">Intermédiaire (2-5 ans)</option>
                    <option value="senior">Senior (5+ ans)</option>
                    <option value="executive">Dirigeant</option>
                  </select>
                </div>

                {/* Attentes */}
                <div>
                  <label htmlFor="expectations" className="block text-sm font-medium text-green-900 mb-2">
                    Vos attentes pour cet événement
                  </label>
                  <textarea
                    id="expectations"
                    name="expectations"
                    rows={3}
                    value={formData.expectations}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Qu'espérez-vous obtenir de cet événement ?"
                  />
                </div>

                {/* Restrictions alimentaires */}
                <div>
                  <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-green-900 mb-2">
                    Restrictions alimentaires ou besoins spéciaux
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Végétarien, allergies, etc."
                  />
                </div>

                {/* Newsletter */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="rounded border-green-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="newsletter" className="text-sm text-green-900">
                    Je souhaite recevoir la newsletter avec les actualités et événements futurs
                  </label>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-800 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Confirmer mon inscription
                </motion.button>

                <p className="text-center text-sm text-green-600">
                  Vous recevrez un email de confirmation avec tous les détails.
                </p>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

EventRegistration.displayName = 'EventRegistration';

export default EventRegistration;
