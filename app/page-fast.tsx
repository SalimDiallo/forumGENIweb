import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Hero Section Simplified */}
      <section className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-green-900 to-green-700">
        <div className="container mx-auto px-4 pt-28 pb-16 text-center">
          <div className="inline-flex items-center p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <span className="px-3 py-1 text-sm font-medium bg-green-800 text-white rounded-full">
              Depuis 2002
            </span>
            <span className="px-3 text-white font-medium">
              Association professionnelle de l'INSEA
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="block">Forum GENI INSEA</span>
            <span className="text-green-200">Expertise • Innovation • Leadership</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            La convergence entre l'excellence académique de l'INSEA et les leaders du monde professionnel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Link href="/events" className="flex-1">
              <button className="w-full py-4 bg-white text-green-800 font-medium rounded-xl hover:bg-green-50 transition-colors">
                Participer au Forum 2025
              </button>
            </Link>
            <Link href="/events" className="flex-1">
              <button className="w-full py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-colors">
                Découvrir nos événements
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-800">5000+</div>
              <div className="text-gray-600">Participants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-800">85+</div>
              <div className="text-gray-600">Partenaires</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-800">127+</div>
              <div className="text-gray-600">Événements</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-800">23</div>
              <div className="text-gray-600">Années</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">
            Découvrez nos sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/about" className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-green-900 mb-2">À Propos</h3>
                <p className="text-gray-600">Découvrez notre histoire et mission</p>
              </div>
            </Link>
            <Link href="/events" className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-green-900 mb-2">Événements</h3>
                <p className="text-gray-600">Participez à nos événements</p>
              </div>
            </Link>
            <Link href="/contact" className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-green-900 mb-2">Contact</h3>
                <p className="text-gray-600">Rejoignez notre communauté</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
