import { Calendar, MapPin, Globe, DollarSign, Edit, Tag, Building, AlertCircle, Bell, Users, Clock } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { statusOptions } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ShareButton from "@/components/ui/ShareButton";
import ExportButton from "@/components/ui/ExportButton";

export default async function EventDetailsPage(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const eventId = parseInt(params.eventId, 10);

  let event = null;
  if (eventId && !isNaN(eventId)) {
    event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        media: true,
      }
    });
    if (!event) {
      return (
        <div className="container py-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Événement introuvable</h2>
          <p className="text-gray-600 mb-6">L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link href="/admin/events" className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 py-3 font-semibold transition">
            Retour à la liste des événements
          </Link>
        </div>
      );
    }
  } else {
    return (
      <div className="container py-12 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Événement introuvable</h2>
        <p className="text-gray-600 mb-6">L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/admin/events" className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 py-3 font-semibold transition">
          Retour à la liste des événements
        </Link>
      </div>
    );
  }

  const statusOption = statusOptions.find((s) => s.value === event.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header avec navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/admin/events"
              className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux événements
            </Link>
            <div className="flex gap-2">
              <ShareButton
                title={event.title}
                description={event.shortDescription || ''}
                size="md"
              />
              <ExportButton
                data={[{
                  titre: event.title,
                  type: event.eventType,
                  statut: event.status,
                  dateDebut: event.startDate.toISOString(),
                  dateFin: event.endDate.toISOString(),
                  lieu: event.location,
                  participants: `${event.currentParticipants}/${event.maxParticipants || 'illimité'}`,
                }]}
                filename={`evenement-${event.slug}`}
                variant="full"
                size="md"
              />
              <Link
                href={`/admin/events/event/${eventId}/edit`}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold rounded-lg px-4 py-2.5 hover:bg-emerald-700 transition shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Link>
            </div>
          </div>

          {/* Titre et badges */}
          <div className="bg-white  shadow-sm border border-gray-200 p-6">
            <div className="flex flex-wrap items-start gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-900 flex-1">{event.title}</h1>
              <div className="flex gap-2 items-center">
                <span className={`px-3 py-1.5  text-sm font-medium ${statusOption?.color} shadow-sm`}>
                  {statusOption?.label}
                </span>
                {event.isFeatured && (
                  <span className="px-3 py-1.5  text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm">
                    ⭐ Événement vedette
                  </span>
                )}
              </div>
            </div>

            {/* Informations clés en cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold text-sm">Dates</span>
                </div>
                <p className="text-sm text-blue-900 font-medium">
                  {event.startDate ? new Date(event.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </p>
                <p className="text-xs text-blue-700">
                  {event.startDate ? new Date(event.startDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}
                  {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  {event.isVirtual ? <Globe className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                  <span className="font-semibold text-sm">Lieu</span>
                </div>
                <p className="text-sm text-purple-900 font-medium">
                  {event.isVirtual ? "Événement virtuel" : (event.location || "Non défini")}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold text-sm">Tarif</span>
                </div>
                <p className="text-sm text-amber-900 font-medium">
                  {event.isFree ? "Gratuit" : `${event.price} ${event.currency}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image principale */}
        {event.featuredImage && (
          <div className="mb-8  overflow-hidden shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.featuredImage}
              alt={event.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        {/* Galerie photos */}
        {event.media && event.media.length > 1 && (
          <div className="mb-8 bg-white  shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Galerie photos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {event.media
                .filter((m: any) => m.fileUrl !== event.featuredImage)
                .map((media: any) => (
                  <img
                    key={media.id}
                    src={media.fileUrl}
                    alt={media.altText || event.title}
                    className="rounded-lg w-full h-32 object-cover border border-gray-200 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                  />
                ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-8 bg-white  shadow-sm border border-gray-200 p-8">
          {event.shortDescription && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
              <p className="text-lg text-emerald-900 font-medium">{event.shortDescription}</p>
            </div>
          )}
          {event.description && (
            <div className="prose max-w-none prose-emerald">
              <MarkdownRenderer content={event.description} />
            </div>
          )}
        </div>

        {/* Informations détaillées en onglets visuels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Détails de l'événement */}
          <div className="bg-white  shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-900">
              <Tag className="w-5 h-5 text-emerald-600" />
              Détails de l'événement
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mt-0.5">
                  <Building className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Organisateur</p>
                  <p className="text-gray-900 font-semibold">{event.organizerName || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mt-0.5">
                  <Tag className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Type d'événement</p>
                  <p className="text-gray-900 font-semibold capitalize">{event.eventType || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Créé le</p>
                  <p className="text-gray-900">{event.createdAt ? new Date(event.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p>
                </div>
              </div>
              {event.virtualLink && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-blue-600 mt-0.5">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Lien virtuel</p>
                    <a href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium underline break-all">
                      Rejoindre l'événement
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

         
        </div>

        {/* Sections additionnelles */}
        {(event.agenda || event.speakers || event.sponsors) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {event.agenda && (
              <div className="bg-white  shadow-sm border border-gray-200 p-6">
                <h4 className="font-bold text-lg mb-3 text-gray-900">📋 Agenda</h4>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{event.agenda}</div>
              </div>
            )}
            {event.speakers && (
              <div className="bg-white  shadow-sm border border-gray-200 p-6">
                <h4 className="font-bold text-lg mb-3 text-gray-900">🎤 Intervenants</h4>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{event.speakers}</div>
              </div>
            )}
            {event.sponsors && (
              <div className="bg-white  shadow-sm border border-gray-200 p-6">
                <h4 className="font-bold text-lg mb-3 text-gray-900">🤝 Sponsors</h4>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{event.sponsors}</div>
              </div>
            )}
          </div>
        )}

        {/* Pré-requis et à apporter */}
        {(event.requirements || event.whatToBring) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {event.requirements && (
              <div className="bg-blue-50  border border-blue-200 p-6">
                <h4 className="font-bold text-lg mb-3 text-blue-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Pré-requis
                </h4>
                <p className="text-blue-800">{event.requirements}</p>
              </div>
            )}
            {event.whatToBring && (
              <div className="bg-amber-50  border border-amber-200 p-6">
                <h4 className="font-bold text-lg mb-3 text-amber-900 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  À apporter
                </h4>
                <p className="text-amber-800">{event.whatToBring}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}