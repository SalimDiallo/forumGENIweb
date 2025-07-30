'use client';

import React, { useState } from 'react';
import { UserPlus, Calendar, MapPin, Users, Send, Star, Clock, Euro, CheckCircle, Sparkles, Award } from 'lucide-react';

const EventRegistration = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [formStep, setFormStep] = useState(1);
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
      description: '17ème édition de notre forum annuel',
      attendees: '500+',
      category: 'Forum',
      featured: true,
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'forum-2025',
      name: 'Forum GENI Entreprises 2025',
      date: '3-5 mai 2025',
      location: 'INSEA Rabat',
      price: 'Gratuit',
      description: '17ème édition de notre forum annuel',
      attendees: '500+',
      category: 'Forum',
      featured: true,
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'forum-2025',
      name: 'Forum GENI Entreprises 2025',
      date: '3-5 mai 2025',
      location: 'INSEA Rabat',
      price: 'Gratuit',
      description: '17ème édition de notre forum annuel',
      attendees: '500+',
      category: 'Forum',
      featured: true,
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'forum-2025',
      name: 'Forum GENI Entreprises 2025',
      date: '3-5 mai 2025',
      location: 'INSEA Rabat',
      price: 'Gratuit',
      description: '17ème édition de notre forum annuel',
      attendees: '500+',
      category: 'Forum',
      featured: true,
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'forum-2025',
      name: 'Forum GENI Entreprises 2025',
      date: '3-5 mai 2025',
      location: 'INSEA Rabat',
      price: 'Gratuit',
      description: '17ème édition de notre forum annuel',
      attendees: '500+',
      category: 'Forum',
      featured: true,
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'forum-2025',
      name: 'Forum GENI Entreprises 2025',
      date: '3-5 mai 2025',
      location: 'INSEA Rabat',
      price: 'Gratuit',
      description: '17ème édition de notre forum annuel',
      attendees: '500+',
      category: 'Forum',
      featured: true,
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'ai-workshop',
      name: 'Atelier Intelligence Artificielle',
      date: '15 mars 2025',
      location: 'INSEA Rabat',
      price: '200 DH',
      description: 'Workshop pratique sur l\'IA en entreprise',
      attendees: '50',
      category: 'Workshop',
      featured: false,
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'networking-casa',
      name: 'Soirée Networking Casablanca',
      date: '28 février 2025',
      location: 'Casablanca',
      price: '150 DH',
      description: 'Rencontrez notre communauté d\'entrepreneurs',
      attendees: '100',
      category: 'Networking',
      featured: false,
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Inscription:', { event: selectedEvent, ...formData });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const nextStep = () => setFormStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setFormStep(prev => Math.max(prev - 1, 1));

  const selectedEventData = upcomingEvents.find(event => event.id === selectedEvent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-100 text-sm font-medium mb-6">
              <Sparkles size={16} />
              Événements Premium GENI
              <Sparkles size={16} />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
             Participer
              <span className="block bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
               à un evenement
              </span>
            </h1>
            
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez des événements exclusifs, rencontrez des leaders d'industrie et développez votre réseau professionnel
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 text-emerald-200">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="font-medium">1000+ Participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} />
                <span className="font-medium">17 Années d'Excellence</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} />
                <span className="font-medium">Événements Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Event Selection */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 p-8 mb-8 border border-emerald-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Choisissez Votre Événement
              </h2>
              <p className="text-gray-600">Sélectionnez l'événement qui correspond à vos objectifs professionnels</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className={`group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                    selectedEvent === event.id
                      ? 'ring-4 ring-emerald-400 shadow-2xl shadow-emerald-200'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {event.featured && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star size={12} />
                        POPULAIRE
                      </div>
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-90`}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  <div className="relative z-10 p-6 text-white h-full flex flex-col">
                    <div className="mb-4">
                      <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-3">
                        {event.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2 leading-tight">{event.name}</h3>
                      <p className="text-white/90 text-sm leading-relaxed">{event.description}</p>
                    </div>
                    
                    <div className="space-y-2 mb-4 flex-grow">
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Calendar size={16} />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <MapPin size={16} />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Users size={16} />
                        {event.attendees} participants
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <span className="font-bold text-lg">{event.price}</span>
                      </div>
                      {selectedEvent === event.id && (
                        <div className="bg-white text-emerald-600 p-2 rounded-full">
                          <CheckCircle size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          {selectedEvent && (
            <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 overflow-hidden border border-emerald-100">
              {/* Event Summary Header */}
              <div className={`bg-gradient-to-r ${selectedEventData?.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Inscription - {selectedEventData?.name}</h3>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {selectedEventData?.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {selectedEventData?.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{selectedEventData?.price}</div>
                    <div className="text-white/80 text-sm">{selectedEventData?.attendees} participants</div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-center gap-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        formStep >= step 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {formStep > step ? <CheckCircle size={20} /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-1 mx-2 transition-all ${
                          formStep > step ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2 font-medium text-gray-600">
                  {formStep === 1 && "Informations personnelles"}
                  {formStep === 2 && "Informations professionnelles"}
                  {formStep === 3 && "Finalisation"}
                </div>
              </div>

              <div className="p-8">
                {/* Step 1: Personal Information */}
                {formStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="text-center mb-6">
                      <UserPlus className="mx-auto text-emerald-600 mb-3" size={32} />
                      <h4 className="text-xl font-bold text-gray-900">Vos Informations Personnelles</h4>
                      <p className="text-gray-600">Commençons par faire connaissance</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="+212 6XX XX XX XX"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Information */}
                {formStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="text-center mb-6">
                      <Users className="mx-auto text-emerald-600 mb-3" size={32} />
                      <h4 className="text-xl font-bold text-gray-900">Votre Profil Professionnel</h4>
                      <p className="text-gray-600">Aidez-nous à personnaliser votre expérience</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Organisation/Entreprise
                        </label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Poste/Fonction
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="Votre fonction"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Niveau d'expérience
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      >
                        <option value="">Sélectionnez votre niveau</option>
                        <option value="student">Étudiant</option>
                        <option value="junior">Junior (0-2 ans)</option>
                        <option value="intermediate">Intermédiaire (2-5 ans)</option>
                        <option value="senior">Senior (5+ ans)</option>
                        <option value="executive">Dirigeant</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Vos attentes pour cet événement
                      </label>
                      <textarea
                        name="expectations"
                        rows={4}
                        value={formData.expectations}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                        placeholder="Qu'espérez-vous obtenir de cet événement ? Vos objectifs de networking, d'apprentissage..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Final Details */}
                {formStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="text-center mb-6">
                      <CheckCircle className="mx-auto text-emerald-600 mb-3" size={32} />
                      <h4 className="text-xl font-bold text-gray-900">Derniers Détails</h4>
                      <p className="text-gray-600">Plus que quelques informations pour finaliser</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Restrictions alimentaires ou besoins spéciaux
                      </label>
                      <input
                        type="text"
                        name="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Végétarien, allergies, besoins d'accessibilité..."
                      />
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleChange}
                          className="mt-1 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <label className="font-medium text-emerald-900 block mb-1">
                            Newsletter GENI
                          </label>
                          <p className="text-sm text-emerald-700">
                            Recevez nos actualités, événements exclusifs et opportunités de networking directement dans votre boîte mail.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h5 className="font-bold text-gray-900 mb-4">Récapitulatif de votre inscription</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Événement:</span>
                          <span className="font-medium">{selectedEventData?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{selectedEventData?.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lieu:</span>
                          <span className="font-medium">{selectedEventData?.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tarif:</span>
                          <span className="font-bold text-emerald-600">{selectedEventData?.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  {formStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Précédent
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {formStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium transform hover:scale-105"
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium transform hover:scale-105 flex items-center gap-2 shadow-lg"
                    >
                      <Send size={20} />
                      Confirmer mon inscription
                    </button>
                  )}
                </div>

                {formStep === 3 && (
                  <p className="text-center text-sm text-gray-600 mt-4">
                    🎉 Vous recevrez un email de confirmation avec tous les détails dans quelques minutes.
                  </p>
                )}
              </div>
            
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;