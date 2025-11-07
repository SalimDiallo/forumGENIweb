'use client';

import React, { useState } from 'react';
import { Mail, User, Phone, School, Newspaper, GraduationCap } from 'lucide-react';
import { registerForEvent } from '@/app/(sections)/events/register-action';

type Props = { 
  eventSlug: string;
  formData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    school: string;
    cne: string;
    cycle?: string;
    level?: string;
    schoolYear: string;
    newsletter?: boolean;
  };
};

const cycleOptions = [
  { value: '', label: 'Sélectionnez le cycle' },
  { value: 'CP', label: 'CP' },
  { value: 'ING', label: 'ING' },
  { value: 'MASTER', label: 'Master' },
  { value: 'LICENCE', label: 'Licence' },
  { value: 'DOCTORAT', label: 'Doctorat' },
];

const levelOptions = [
  { value: '', label: 'Sélectionnez le niveau' },
  { value: '1', label: '1ère année' },
  { value: '2', label: '2ème année' },
  { value: '3', label: '3ème année' },
  { value: '4', label: '4ème année' },
  { value: '5', label: '5ème année' },
];

const initialFields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  school: '',
  cne: '',
  cycle: '',
  level: '',
  schoolYear: '',
  newsletter: true,
};

type Errors = Partial<Record<keyof typeof initialFields | 'form', string>>;

function validate(fields: typeof initialFields) {
  const errors: Errors = {};
  if (!fields.firstName.trim()) errors.firstName = 'Le prénom est requis';
  if (!fields.lastName.trim()) errors.lastName = 'Le nom est requis';
  if (!fields.email.trim()) errors.email = 'L\'email est requis';
  else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(fields.email)) errors.email = 'Email invalide';
  if (!fields.school.trim()) errors.school = 'L\'établissement est requis';
  if (!fields.cne.trim()) errors.cne = 'Le CNE est requis';
  if (!fields.cycle) errors.cycle = 'Le cycle est requis';
  if (!fields.level) errors.level = 'Le niveau est requis';
  if (!fields.schoolYear.trim()) errors.schoolYear = 'L\'année scolaire est requise';
  return errors;
}

export default function RegistrationForm({ eventSlug, formData }: Props) {
  const [fields, setFields] = useState({
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    email: formData?.email || '',
    phone: formData?.phone || '',
    school: formData?.school || '',
    cne: formData?.cne || '',
    cycle: formData?.cycle || '',
    level: formData?.level || '',
    schoolYear: formData?.schoolYear || '',
    newsletter: formData?.newsletter ?? true,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) return;
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);

    const result = await registerForEvent({
      eventSlug,
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      phone: fields.phone,
      school: fields.school,
      cne: fields.cne,
      cycle: fields.cycle,
      level: fields.level,
      schoolYear: fields.schoolYear,
      newsletter: fields.newsletter,
    });

    setIsSubmitting(false);

    // Handle server errors
    if (result?.serverError) {
      setErrors(prev => ({
        ...prev,
        form: result.serverError
      }));
      return;
    }

    // Handle validation errors from server
    if (result?.validationErrors) {
      const newErrors: Errors = {};
      Object.entries(result.validationErrors).forEach(([key, value]) => {
        if (value) {
          // Handle both array format and object format
          const errorMessage = Array.isArray(value)
            ? value[0]
            : (typeof value === 'object' && '_errors' in value && Array.isArray(value._errors) && value._errors.length > 0)
              ? value._errors[0]
              : undefined;

          if (errorMessage) {
            newErrors[key as keyof Errors] = errorMessage;
          }
        }
      });
      setErrors(newErrors);
      return;
    }

    // Success
    setSubmitted(true);
    setFields({ ...initialFields });
  };

  return (
    <section className="py-3 bg-white text-xs">
      <div className="mx-auto px-2">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium text-emerald-900 mb-1 flex items-center gap-1">
                  <User size={12} /> Prénom *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={fields.firstName}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 border ${errors.firstName ? 'border-red-400' : 'border-emerald-200'} rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs`}
                  placeholder="Prénom"
                  disabled={submitted}
                />
                {errors.firstName && <p className="text-red-600 text-[10px] mt-0.5">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-medium text-emerald-900 mb-1 flex items-center gap-1">
                  <User size={12} /> Nom *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={fields.lastName}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 border ${errors.lastName ? 'border-red-400' : 'border-emerald-200'} rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs`}
                  placeholder="Nom"
                  disabled={submitted}
                />
                {errors.lastName && <p className="text-red-600 text-[10px] mt-0.5">{errors.lastName}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-emerald-900 mb-1 flex items-center gap-1">
                  <Mail size={12} /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={fields.email}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 border ${errors.email ? 'border-red-400' : 'border-emerald-200'} rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs`}
                  placeholder="exemple@email.com"
                  disabled={submitted}
                />
                {errors.email && <p className="text-red-600 text-[10px] mt-0.5">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-emerald-900 mb-1 flex items-center gap-1">
                  <Phone size={12} /> Tél.
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={fields.phone}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border border-emerald-200 rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs"
                  placeholder="06 XX XX XX XX"
                  disabled={submitted}
                />
              </div>
            </div>
            <div>
              <label htmlFor="school" className="block text-xs font-medium text-emerald-900 mb-1 flex items-center gap-1">
                <School size={12} /> École/Univ. *
              </label>
              <input
                type="text"
                id="school"
                name="school"
                required
                value={fields.school}
                onChange={handleChange}
                className={`w-full px-2 py-1 border ${errors.school ? 'border-red-400' : 'border-emerald-200'} rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs`}
                placeholder="Établissement"
                disabled={submitted}
              />
              {errors.school && <p className="text-red-600 text-[10px] mt-0.5">{errors.school}</p>}
            </div>
            <div>
              <label htmlFor="cne" className="block text-xs font-medium text-emerald-900 mb-1 flex items-center gap-1">
                <GraduationCap size={12} /> CNE *
              </label>
              <input
                type="text"
                id="cne"
                name="cne"
                required
                value={fields.cne}
                onChange={handleChange}
                className={`w-full px-2 py-1 border ${errors.cne ? 'border-red-400' : 'border-emerald-200'} rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs`}
                placeholder="CNE"
                disabled={submitted}
              />
              {errors.cne && <p className="text-red-600 text-[10px] mt-0.5">{errors.cne}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="cycle" className="block text-xs font-medium text-emerald-900 mb-1">
                  Cycle *
                </label>
                <select
                  id="cycle"
                  name="cycle"
                  required
                  value={fields.cycle}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 border ${errors.cycle ? 'border-red-400' : 'border-emerald-200'} rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs`}
                  disabled={submitted}
                >
                  {cycleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.cycle && <p className="text-red-600 text-[10px] mt-0.5">{errors.cycle}</p>}
              </div>
              <div>
                <label htmlFor="level" className="block text-xs font-medium text-emerald-900 mb-1">
                  Niveau *
                </label>
                <select
                  id="level"
                  name="level"
                  required
                  value={fields.level}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 border ${errors.level ? 'border-red-400' : 'border-emerald-200'} rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs`}
                  disabled={submitted}
                >
                  {levelOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.level && <p className="text-red-600 text-[10px] mt-0.5">{errors.level}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="schoolYear" className="block text-xs font-medium text-emerald-900 mb-1">
                Année scolaire *
              </label>
              <input
                type="text"
                id="schoolYear"
                name="schoolYear"
                required
                value={fields.schoolYear}
                onChange={handleChange}
                className={`w-full px-2 py-1 border ${errors.schoolYear ? 'border-red-400' : 'border-emerald-200'} rounded focus:ring-emerald-700 focus:border-emerald-700 bg-emerald-50 text-xs`}
                placeholder="ex: 2023/2024"
                disabled={submitted}
              />
              {errors.schoolYear && <p className="text-red-600 text-[10px] mt-0.5">{errors.schoolYear}</p>}
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={fields.newsletter}
                onChange={handleChange}
                className="accent-emerald-700 w-3 h-3"
                disabled={submitted}
              />
              <label htmlFor="newsletter" className="text-emerald-800 text-xs flex items-center gap-1 cursor-pointer">
                <Newspaper size={10} /> Newsletter
              </label>
            </div>
            {errors.form && (
              <div className="text-red-700 mt-2 bg-red-50 border border-red-200 rounded py-2 px-3 text-center font-medium text-xs">
                {errors.form}
              </div>
            )}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-emerald-800 to-emerald-500 text-white py-2 px-2 rounded font-medium hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1 text-xs shadow mt-1 ${submitted ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={submitted || isSubmitting}
            >
              {isSubmitting ? "Envoi..." : "S'inscrire"}
            </button>
            {submitted && (
              <div className="text-emerald-800 mt-2 bg-emerald-50 border border-emerald-200 rounded py-2 text-center font-semibold text-xs">
                Merci, votre inscription a bien été prise en compte.<br />
                <span className="block text-emerald-700 text-[10px] mt-1">Vous recevrez un email de confirmation.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}