import { Calendar, MapPin, Users, Globe, DollarSign } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { statusOptions } from "@/lib/utils";

export default async function EventDetailsPage(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const eventId = Number(params.eventId);

  let event = null;
  if (eventId) {
    event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    if (!event) {
      return (
        <div className="container py-12 text-center text-red-600">
          Événement introuvable.
        </div>
      );
    }
  } else {
    return (
      <div className="container py-12 text-center text-red-600">
        Événement introuvable.
      </div>
    );
  }

  const statusOption = statusOptions.find((s) => s.value === event.status);

  return (
    <div className="space-y-6 py-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusOption?.color}`}
        >
          {statusOption?.label}
        </span>
        {event.isFeatured && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⭐ Vedette
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Date inconnue"}
        </span>
        <span className="flex items-center gap-1">
          {event.isVirtual ? (
            <>
              <Globe className="w-4 h-4" />
              Virtuel
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              {event.location || "Lieu non défini"}
            </>
          )}
        </span>
        {typeof event.currentParticipants === "number" && (
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {event.currentParticipants}
            {event.maxParticipants ? `/${event.maxParticipants}` : ""} inscrits
          </span>
        )}
        {!event.isFree && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {event.price} {event.currency}
          </span>
        )}
      </div>

      {/* Image */}
      {event.featuredImage && (
        <div className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.featuredImage}
            alt={event.title}
            className="rounded-lg w-full max-h-96 object-cover shadow border"
          />
        </div>
      )}

      {/* Descriptions */}
      {event.shortDescription && (
        <p className="text-lg mb-2 text-gray-700">{event.shortDescription}</p>
      )}
      {event.description && (
        <div className="prose max-w-none mb-8">{event.description}</div>
      )}

    

      {/* Registration/card */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-lg mb-4">Participer / S'inscrire</h3>
        <ul className="space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Statut:</span> {event.status}
          </li>
          {event.registrationStart && (
            <li>
              <span className="font-medium">Début des inscriptions :</span>{" "}
              {new Date(event.registrationStart).toLocaleString("fr-FR")}
            </li>
          )}
          {event.registrationEnd && (
            <li>
              <span className="font-medium">Fin des inscriptions :</span>{" "}
              {new Date(event.registrationEnd).toLocaleString("fr-FR")}
            </li>
          )}
          {event.maxParticipants && (
            <li>
              <span className="font-medium">Participants maxi :</span> {event.maxParticipants}
            </li>
          )}
          {event.virtualLink && (
            <li>
              <span className="font-medium">Lien virtuel:</span>{" "}
              <a
                href={event.virtualLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline"
              >
                {event.virtualLink}
              </a>
            </li>
          )}
        </ul>
      </div>

      <div className="mt-8">
        <Link
          href="/admin/events"
          className="inline-block bg-emerald-600 text-white rounded-lg px-6 py-3 font-medium shadow hover:bg-emerald-700 transition"
        >
          Retour à la liste des événements
        </Link>
      </div>
    </div>
  );
}

