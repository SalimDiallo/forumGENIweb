'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Building, User, Mail, Phone, Globe, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnershipFormSchema, type PartnershipFormInput } from '@/app/(sections)/contact/partnership.schema';
import { submitPartnershipForm } from '@/app/(sections)/contact/partnership.action';

const PartnershipForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PartnershipFormInput>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      companySize: 'pme',
      website: '',
      contactName: '',
      contactPosition: '',
      contactEmail: '',
      contactPhone: '',
      partnershipType: 'sponsor',
      budgetRange: '',
      objectives: '',
      additionalInfo: '',
    },
  });

  const onSubmit = async (data: PartnershipFormInput) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitPartnershipForm(data);

      if (result?.data?.success) {
        setSubmitStatus({
          type: 'success',
          message: result.data.message,
        });
        reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Une erreur est survenue. Veuillez réessayer.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-emerald-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
              Devenir Partenaire
            </h2>
            <p className="text-lg text-emerald-900/80">
              Rejoignez notre réseau de partenaires et connectez-vous avec les talents de demain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 border border-emerald-100"
          >
            {/* Status messages */}
            {submitStatus.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  submitStatus.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informations entreprise */}
              <div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Building size={24} />
                  Informations sur votre entreprise
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-emerald-900 mb-2">
                      Nom de l'entreprise *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      {...register('companyName')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                        errors.companyName ? 'border-red-500' : 'border-emerald-200'
                      }`}
                      placeholder="Nom de votre entreprise"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="companySize" className="block text-sm font-medium text-emerald-900 mb-2">
                      Taille de l'entreprise *
                    </label>
                    <select
                      id="companySize"
                      {...register('companySize')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                        errors.companySize ? 'border-red-500' : 'border-emerald-200'
                      }`}
                    >
                      <option value="startup">Startup</option>
                      <option value="pme">PME (Petite et Moyenne Entreprise)</option>
                      <option value="eti">ETI (Entreprise de Taille Intermédiaire)</option>
                      <option value="grande_entreprise">Grande Entreprise</option>
                    </select>
                    {errors.companySize && (
                      <p className="mt-1 text-sm text-red-600">{errors.companySize.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-emerald-900 mb-2">
                      Secteur d'activité *
                    </label>
                    <select
                      id="industry"
                      {...register('industry')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                        errors.industry ? 'border-red-500' : 'border-emerald-200'
                      }`}
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
                    {errors.industry && (
                      <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-emerald-900 mb-2">
                      Site web
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-800" size={20} />
                      <input
                        type="url"
                        id="website"
                        {...register('website')}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                          errors.website ? 'border-red-500' : 'border-emerald-200'
                        }`}
                        placeholder="https://www.votreentreprise.com"
                      />
                    </div>
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <User size={24} />
                  Personne de contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-emerald-900 mb-2">
                      Nom du contact *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      {...register('contactName')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                        errors.contactName ? 'border-red-500' : 'border-emerald-200'
                      }`}
                      placeholder="Nom et prénom"
                    />
                    {errors.contactName && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contactPosition" className="block text-sm font-medium text-emerald-900 mb-2">
                      Poste / Fonction
                    </label>
                    <input
                      type="text"
                      id="contactPosition"
                      {...register('contactPosition')}
                      className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                      placeholder="Directeur Marketing, CEO, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-emerald-900 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-800" size={20} />
                      <input
                        type="email"
                        id="contactEmail"
                        {...register('contactEmail')}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                          errors.contactEmail ? 'border-red-500' : 'border-emerald-200'
                        }`}
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-emerald-900 mb-2">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-800" size={20} />
                      <input
                        type="tel"
                        id="contactPhone"
                        {...register('contactPhone')}
                        className="w-full pl-12 pr-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                        placeholder="+212 6 XX XX XX XX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Type de partenariat */}
              <div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <FileText size={24} />
                  Détails du partenariat
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="partnershipType" className="block text-sm font-medium text-emerald-900 mb-2">
                      Type de partenariat *
                    </label>
                    <select
                      id="partnershipType"
                      {...register('partnershipType')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                        errors.partnershipType ? 'border-red-500' : 'border-emerald-200'
                      }`}
                    >
                      <option value="sponsor">Sponsor d'événement</option>
                      <option value="recruiter">Recruteur</option>
                      <option value="speaker">Intervenant/Speaker</option>
                      <option value="mentor">Mentor</option>
                      <option value="other">Autre</option>
                    </select>
                    {errors.partnershipType && (
                      <p className="mt-1 text-sm text-red-600">{errors.partnershipType.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="budgetRange" className="block text-sm font-medium text-emerald-900 mb-2">
                      Budget approximatif
                    </label>
                    <select
                      id="budgetRange"
                      {...register('budgetRange')}
                      className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
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
                  <label htmlFor="objectives" className="block text-sm font-medium text-emerald-900 mb-2">
                    Objectifs du partenariat *
                  </label>
                  <textarea
                    id="objectives"
                    rows={4}
                    {...register('objectives')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent resize-none ${
                      errors.objectives ? 'border-red-500' : 'border-emerald-200'
                    }`}
                    placeholder="Quels sont vos objectifs avec ce partenariat ? (recrutement, visibilité, innovation, etc.)"
                  />
                  {errors.objectives && (
                    <p className="mt-1 text-sm text-red-600">{errors.objectives.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-emerald-900 mb-2">
                    Informations complémentaires
                  </label>
                  <textarea
                    id="additionalInfo"
                    rows={4}
                    {...register('additionalInfo')}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent resize-none"
                    placeholder="Présentez votre entreprise, vos activités principales, vos valeurs, vos partenariats précédents..."
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-emerald-600 cursor-not-allowed'
                    : 'bg-emerald-800 hover:bg-emerald-900'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Envoyer la demande de partenariat
                  </>
                )}
              </motion.button>

              <p className="text-center text-sm text-emerald-800">
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
