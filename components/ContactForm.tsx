'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Phone, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormInput } from '@/app/(sections)/contact/contact.schema';
import { submitContactForm } from '@/app/(sections)/contact/contact.action';

const ContactForm = () => {
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
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      category: 'general',
    },
  });

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitContactForm(data);

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
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Envoyez-nous un message
            </h2>
            <p className="text-lg text-black/80">
              Nous répondons généralement sous 24h
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-emerald-50  p-8 border border-emerald-100"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                    Nom complet *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={20} />
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-emerald-200'
                      }`}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={20} />
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-emerald-200'
                      }`}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                  Téléphone (optionnel)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={20} />
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="w-full pl-12 pr-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-black mb-2">
                  Type de demande
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                >
                  <option value="general">Question générale</option>
                  <option value="event">Participation événement</option>
                  <option value="career">Carrière</option>
                  <option value="press">Relations presse</option>
                  <option value="technical">Support technique</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register('subject')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent ${
                    errors.subject ? 'border-red-500' : 'border-emerald-200'
                  }`}
                  placeholder="Sujet de votre message"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-black" size={20} />
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message')}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-transparent resize-none ${
                      errors.message ? 'border-red-500' : 'border-emerald-200'
                    }`}
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
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
                    Envoyer le message
                  </>
                )}
              </motion.button>

              <p className="text-center text-sm text-black">
                En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
