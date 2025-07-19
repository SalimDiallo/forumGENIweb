export default function FastGallery() {
  const events = [
    { id: 1, title: "Forum GENI INSEA 2024", category: "Forum", year: "2024" },
    { id: 2, title: "Atelier Innovation", category: "Atelier", year: "2024" },
    { id: 3, title: "Conférence IA", category: "Conférence", year: "2024" },
    { id: 4, title: "Networking Alumni", category: "Networking", year: "2023" },
    { id: 5, title: "Forum GENI INSEA 2023", category: "Forum", year: "2023" },
    { id: 6, title: "Journée Carrière", category: "Carrière", year: "2023" },
  ];

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Galerie Photos
          </h1>
          <p className="text-xl text-green-700/80 max-w-3xl mx-auto">
            Revivez les moments forts de nos événements et découvrez l'ambiance unique du Forum GENI INSEA
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold mb-2">{event.title}</div>
                    <div className="text-white/80">{event.year}</div>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full mb-2">
                    {event.category}
                  </span>
                  <h3 className="font-bold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">Voir les photos de cet événement</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-4">
            Participez à nos prochains événements
          </h2>
          <p className="text-xl text-green-700/80 mb-8">
            Rejoignez-nous pour créer de nouveaux souvenirs
          </p>
          <a
            href="/events"
            className="inline-block px-8 py-3 bg-green-800 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Voir les événements à venir
          </a>
        </div>
      </section>
    </main>
  );
}
