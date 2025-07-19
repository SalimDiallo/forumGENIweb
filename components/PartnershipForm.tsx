'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Building, User, Mail, Phone, Globe, FileText } from 'lucide-react';

const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    partnershipType: '',
    budget: '',
    description: '',
    objectives: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demande de partenariat:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-16 bg-green-50">
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
              Devenir Partenaire
            </h2>
            <p className="text-lg text-green-700/80">
              Rejoignez notre réseau de partenaires et connectez-vous avec les talents de demain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 border border-green-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations entreprise */}
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Building size={24} />
                  Informations sur votre entreprise
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-green-900 mb-2">
                      Nom de l'entreprise *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-green-900 mb-2">
                      Secteur d'activité *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez un secteur</option>
                      <option value="technology">Technologies</option>
                      <option value="finance">Finance & Banque</option>
                      <option value="industry">Industrie</option>
                      <option value="consulting">Conseil</option>
                      <option value="energy">Énergie</option>
                      <option value="telecom">Télécommunications</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="website" className="block text-sm font-medium text-green-900 mb-2">
                    Site web
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://www.votreentreprise.com"
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <User size={24} />
                  Personne de contact
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-green-900 mb-2">
                      Nom du contact *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nom et prénom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-green-900 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-green-900 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+212 6 XX XX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Type de partenariat */}
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <FileText size={24} />
                  Détails du partenariat
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="partnershipType" className="block text-sm font-medium text-green-900 mb-2">
                      Type de partenariat *
                    </label>
                    <select
                      id="partnershipType"
                      name="partnershipType"
                      required
                      value={formData.partnershipType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="platinum">Partenaire Platinum</option>
                      <option value="gold">Partenaire Gold</option>
                      <option value="silver">Partenaire Silver</option>
                      <option value="academic">Partenaire Académique</option>
                      <option value="speaker">Intervenant/Speaker</option>
                      <option value="sponsor">Sponsor d'événement</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-green-900 mb-2">
                      Budget approximatif
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez une fourchette</option>
                      <option value="5000-15000">5 000 - 15 000 DH</option>
                      <option value="15000-50000">15 000 - 50 000 DH</option>
                      <option value="50000-100000">50 000 - 100 000 DH</option>
                      <option value="100000+">100 000+ DH</option>
                      <option value="custom">À discuter</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description et objectifs */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-green-900 mb-2">
                    Présentation de votre entreprise *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Présentez votre entreprise, vos activités principales et vos valeurs..."
                  />
                </div>

                <div>
                  <label htmlFor="objectives" className="block text-sm font-medium text-green-900 mb-2">
                    Objectifs du partenariat *
                  </label>
                  <textarea
                    id="objectives"
                    name="objectives"
                    required
                    rows={4}
                    value={formData.objectives}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Quels sont vos objectifs avec ce partenariat ? (recrutement, visibilité, innovation, etc.)"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-800 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Envoyer la demande de partenariat
              </motion.button>

              <p className="text-center text-sm text-green-600">
                Nous vous recontacterons sous 48h pour étudier votre demande.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipForm;
