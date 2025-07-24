export default function FastBlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Blog & Actualités
          </h1>
          <p className="text-xl text-green-700/80 max-w-3xl mx-auto">
            Découvrez les dernières tendances et actualités du monde professionnel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-200 to-green-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Article {i}: Innovation & Technologie
                </h3>
                <p className="text-gray-600 mb-4">
                  Découvrez les dernières tendances en matière d'innovation technologique...
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>15 Jan 2025</span>
                  <span>5 min de lecture</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
