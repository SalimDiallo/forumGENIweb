'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Calendar, MapPin, Users, Send, CheckCircle } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';
import { EventsType } from '@/app/(sections)/events/events.query';

const EventRegistration = ({ events }: {events:EventsType}) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [formStep, setFormStep] = useState(1);
  const [search, setSearch] = useState('');
  const [registrationType, setRegistrationType] = useState<'particulier' | 'entreprise'>('particulier');
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

  // Filtrer les événements publiés et à venir
  const upcomingEvents = events
    .filter(event => 
      // event.status === 'published'
      //  && 
      new Date(event.startDate) > new Date()
    )
    .map(event => ({
      id: event.slug,
      name: event.title,
      date: formatDate(new Date(event.startDate)),
      location: event.location || (event.isVirtual ? 'En ligne' : 'Lieu à préciser'),
      price: event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`,
      description: event.shortDescription || event.description?.substring(0, 100) + '...',
      attendees: `${event.currentParticipants}${event.maxParticipants ? `/${event.maxParticipants}` : '+'}`,
      category: getEventTypeLabel(event.eventType),
      originalEvent: event
    }));

  // Fonction pour formater la date
  function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Fonction pour obtenir le libellé du type d'événement
  function getEventTypeLabel(eventType: string): string {
    const typeLabels: { [key: string]: string } = {
      forum: 'Forum',
      workshop: 'Workshop',
      conference: 'Conférence',
      networking: 'Networking',
      webinar: 'Webinaire',
      other: 'Autre'
    };
    return typeLabels[eventType] || 'Événement';
  }

  const filteredEvents = upcomingEvents.filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase()) ||
    event.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const nextStep = () => setFormStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setFormStep(prev => Math.max(prev - 1, 1));

  const selectedEventData = upcomingEvents.find(event => event.id === selectedEvent);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Inscription à un événement
          </h1>
          <p className="text-gray-600 mb-4">
            Découvrez nos événements et inscrivez-vous en quelques clics.
          </p>
          <div className="text-sm text-gray-500">
            {upcomingEvents.length} événement(s) à venir
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Event Selection */}
          <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Choisissez votre événement
                </h2>
                <p className="text-gray-600 text-sm">Filtrez et sélectionnez un événement</p>
              </div>
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
            </div>
            
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Aucun événement à venir</p>
                <p className="text-sm">Revenez bientôt pour découvrir nos prochains événements</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun événement trouvé avec ces critères de recherche.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    className={`cursor-pointer border rounded-lg p-4 transition-all ${
                      selectedEvent === event.id
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{event.category}</span>
                      {selectedEvent === event.id && (
                        <CheckCircle size={18} className="text-emerald-600" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                      <Calendar size={16} />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin size={16} />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                      <Users size={14} />
                      {event.attendees} participants
                    </div>
                    <div className="mt-2 text-emerald-700 font-bold">{event.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rest of the component remains the same */}
          {selectedEvent && (
            <div className="bg-white rounded-xl shadow border border-gray-100 mb-8">
              {/* Event Summary Header */}
              <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold mb-1">Inscription - {selectedEventData?.name}</h3>
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
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
                  <div className="text-lg font-bold text-emerald-700">{selectedEventData?.price}</div>
                  <div className="text-gray-500 text-xs">{selectedEventData?.attendees} participants</div>
                </div>
              </div>

              {/* Registration Type */}
              {formStep === 1 && (
                <div className="px-6 pt-6 pb-2 flex flex-col md:flex-row gap-4 items-center justify-center">
                  <span className="font-medium text-gray-700 mb-2 md:mb-0">Je m'inscris en tant que :</span>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setRegistrationType('particulier')}
                      className={`px-4 py-2 rounded-lg border font-medium transition ${
                        registrationType === 'particulier'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Particulier
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegistrationType('entreprise')}
                      className={`px-4 py-2 rounded-lg border font-medium transition ${
                        registrationType === 'entreprise'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Entreprise
                    </button>
                  </div>
                </div>
              )}

              {/* Progress Steps */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-center gap-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        formStep >= step 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {formStep > step ? <CheckCircle size={16} /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-10 h-1 mx-1 transition-all ${
                          formStep > step ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2 font-medium text-gray-600 text-sm">
                  {formStep === 1 && "Informations principales"}
                  {formStep === 2 && (registrationType === 'entreprise' ? "Informations entreprise" : "Informations complémentaires")}
                  {formStep === 3 && "Finalisation"}
                </div>
              </div>

              <div className="p-6">
                {/* Step 1: Main Information */}
                {formStep === 1 && (
                  <div className="space-y-6">
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                          placeholder="+212 6XX XX XX XX"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Entreprise or Complementary Info */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    {registrationType === 'entreprise' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-900">
                              Organisation/Entreprise *
                            </label>
                            <input
                              type="text"
                              name="organization"
                              required
                              value={formData.organization}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                              placeholder="Nom de l'entreprise"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-900">
                              Poste/Fonction *
                            </label>
                            <input
                              type="text"
                              name="position"
                              required
                              value={formData.position}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
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
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                          >
                            <option value="">Sélectionnez votre niveau</option>
                            <option value="student">Étudiant</option>
                            <option value="junior">Junior (0-2 ans)</option>
                            <option value="intermediate">Intermédiaire (2-5 ans)</option>
                            <option value="senior">Senior (5+ ans)</option>
                            <option value="executive">Dirigeant</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-900">
                            Vos attentes pour cet événement
                          </label>
                          <textarea
                            name="expectations"
                            rows={3}
                            value={formData.expectations}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition resize-none"
                            placeholder="Qu'espérez-vous obtenir de cet événement ?"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Final Details */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">
                        Restrictions alimentaires ou besoins spéciaux
                      </label>
                      <input
                        type="text"
                        name="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                        placeholder="Végétarien, allergies, besoins d'accessibilité..."
                      />
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                        className="mt-1 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-600"
                      />
                      <div>
                        <label className="font-medium text-gray-900 block mb-1">
                          Recevoir la newsletter GENI
                        </label>
                        <p className="text-sm text-gray-700">
                          Recevez nos actualités et événements par email.
                        </p>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h5 className="font-bold text-gray-900 mb-2">Récapitulatif</h5>
                      <div className="space-y-1 text-sm">
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
                          <span className="font-bold text-emerald-700">{selectedEventData?.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type d'inscription:</span>
                          <span className="font-medium capitalize">{registrationType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Registration submission */}
                    <div className="mt-6">
                      <RegistrationForm 
                        eventSlug={selectedEvent} 
                        formData={formData}
                        registrationType={registrationType}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  {formStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
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
                      className="px-7 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                    >
                      Suivant
                    </button>
                  ) : (
                    <div />
                  )}
                </div>

                {formStep === 3 && (
                  <p className="text-center text-sm text-gray-600 mt-4">
                    🎉 Vous recevrez un email de confirmation avec tous les détails.
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