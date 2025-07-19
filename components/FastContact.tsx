export default function FastContact() {
  return (
    <main className="pt-20">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-green-700/80 max-w-3xl mx-auto">
            Rejoignez notre communauté et participez à la prochaine édition du Forum GENI INSEA
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-2xl font-bold text-green-900 mb-6">Envoyez-nous un message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Prénom"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Nom"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Organisation"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <textarea
                    rows={5}
                    placeholder="Votre message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-3 bg-green-800 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-green-900 mb-6">Informations de contact</h2>
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="font-bold text-green-900 mb-2">Adresse</h3>
                    <p className="text-green-700">
                      INSEA - Institut National de Statistique et d'Économie Appliquée<br />
                      Rabat, Maroc
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="font-bold text-green-900 mb-2">Email</h3>
                    <p className="text-green-700">contact@forumgeni-insea.ma</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="font-bold text-green-900 mb-2">Téléphone</h3>
                    <p className="text-green-700">+212 5 37 77 XX XX</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="font-bold text-green-900 mb-2">Réseaux sociaux</h3>
                    <div className="flex gap-4">
                      <a href="#" className="text-green-700 hover:text-green-900">LinkedIn</a>
                      <a href="#" className="text-green-700 hover:text-green-900">Facebook</a>
                      <a href="#" className="text-green-700 hover:text-green-900">Instagram</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
