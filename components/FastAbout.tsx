export default function FastAbout() {
  return (
    <main className="pt-20">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">
            À Propos du Forum GENI INSEA
          </h1>
          <p className="text-xl text-emerald-900/80 max-w-3xl mx-auto">
            Depuis 2002, nous connectons l'excellence académique de l'INSEA avec les leaders du monde professionnel
          </p>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8 text-center">Notre Histoire</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-emerald-900/80 mb-4">
                  Fondé en 2002 par des étudiants visionnaires de l'INSEA, le Forum GENI INSEA 
                  est né d'une ambition simple : créer un pont durable entre l'excellence académique 
                  et l'innovation entrepreneuriale.
                </p>
                <p className="text-emerald-900/80">
                  Au fil des années, nous avons rassemblé plus de 500 experts, entrepreneurs et 
                  décideurs qui partagent notre vision d'un écosystème économique marocain dynamique 
                  et inclusif.
                </p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">Chiffres Clés</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-emerald-900">Année de création</span>
                    <span className="font-bold text-emerald-900">2002</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-900">Participants totaux</span>
                    <span className="font-bold text-emerald-900">5000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-900">Partenaires</span>
                    <span className="font-bold text-emerald-900">85+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-900">Événements organisés</span>
                    <span className="font-bold text-emerald-900">127+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8">Notre Mission</h2>
            <p className="text-xl text-emerald-900/80 mb-12">
              Faciliter l'insertion professionnelle des étudiants de l'INSEA et créer des synergies 
              durables entre le monde académique et entrepreneurial.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Excellence</h3>
                <p className="text-emerald-900/80">
                  Promouvoir l'excellence académique et professionnelle
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Innovation</h3>
                <p className="text-emerald-900/80">
                  Encourager l'innovation et l'entrepreneuriat
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Leadership</h3>
                <p className="text-emerald-900/80">
                  Former les leaders de demain
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
