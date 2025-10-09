'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  Heart,
  Eye,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Link2 as LinkIcon,
  ChevronRight
} from 'lucide-react';

// Composant de rendu Markdown amélioré
const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-emerald-900 prose-p:text-gray-700 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:text-emerald-900 prose-strong:text-emerald-900 prose-code:text-emerald-800 prose-code:bg-emerald-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-xl prose-img:shadow-lg">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

const BlogDetailPage = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(342);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Données de l'article (normalement récupérées via props ou API)
  const article = {
    id: 1,
    title: "L'Intelligence Artificielle transforme-t-elle vraiment l'industrie marocaine ?",
    subtitle: "Une analyse approfondie de l'impact de l'IA sur les secteurs clés de l'économie marocaine",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Dr. Amina Benali",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      bio: "Experte en Intelligence Artificielle et transformation digitale",
      role: "Docteur en IA"
    },
    date: "2025-01-15",
    readTime: "8 min",
    category: "Innovation",
    tags: ["IA", "Industrie", "Maroc", "Transformation", "Technologie"],
    views: 2543,
    comments: 28,
    content: `
      <h2>Introduction : L'IA au cœur de la transformation</h2>
      <p>L'intelligence artificielle n'est plus une simple promesse futuriste. Au Maroc, elle devient progressivement un levier stratégique de transformation pour de nombreuses industries. Mais comment cette révolution technologique impacte-t-elle réellement notre tissu économique ?</p>
      
      <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" alt="AI Technology" />
      
      <h2>Les secteurs en première ligne</h2>
      <p>Plusieurs secteurs marocains adoptent l'IA avec enthousiasme :</p>
      
      <h3>1. L'industrie automobile</h3>
      <p>Avec plus de <strong>250 entreprises du secteur automobile</strong>, le Maroc utilise l'IA pour optimiser les chaînes de production et améliorer le contrôle qualité. Des algorithmes de vision par ordinateur détectent désormais les défauts de fabrication avec une précision de 99,7%.</p>
      
      <blockquote>
        "L'IA nous a permis de réduire nos défauts de production de 40% en seulement 18 mois" - Directeur d'une usine automobile à Tanger
      </blockquote>
      
      <h3>2. Le secteur bancaire</h3>
      <p>Les banques marocaines investissent massivement dans l'IA pour :</p>
      <ul>
        <li>Détecter les fraudes en temps réel</li>
        <li>Personnaliser l'expérience client</li>
        <li>Automatiser les processus de crédit</li>
        <li>Optimiser la gestion des risques</li>
      </ul>
      
      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" alt="Data Analytics" />
      
      <h3>3. L'agriculture de précision</h3>
      <p>L'IA révolutionne l'agriculture marocaine avec :</p>
      <pre><code>// Exemple d'algorithme de prédiction des rendements
function predictYield(soilData, weatherData, historicalData) {
  const model = trainAIModel(historicalData);
  return model.predict({
    soil: soilData,
    weather: weatherData,
    season: getCurrentSeason()
  });
}</code></pre>
      
      <h2>Les défis à surmonter</h2>
      <p>Malgré ces avancées prometteuses, plusieurs obstacles persistent :</p>
      
      <ol>
        <li><strong>Le manque de compétences</strong> : Seulement 15% des entreprises disposent de data scientists qualifiés</li>
        <li><strong>L'infrastructure technologique</strong> : Les PME peinent à investir dans les équipements nécessaires</li>
        <li><strong>La réglementation</strong> : Le cadre juridique de l'IA reste flou au Maroc</li>
      </ol>
      
      <h2>Les opportunités pour les entrepreneurs</h2>
      <p>La transformation par l'IA ouvre de nombreuses opportunités :</p>
      
      <table>
        <thead>
          <tr>
            <th>Secteur</th>
            <th>Opportunité</th>
            <th>Investissement estimé</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Healthcare</td>
            <td>Diagnostic assisté par IA</td>
            <td>50K - 200K MAD</td>
          </tr>
          <tr>
            <td>Retail</td>
            <td>Recommandations personnalisées</td>
            <td>30K - 150K MAD</td>
          </tr>
          <tr>
            <td>Logistique</td>
            <td>Optimisation des routes</td>
            <td>100K - 500K MAD</td>
          </tr>
        </tbody>
      </table>
      
      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="Business Growth" />
      
      <h2>Conclusion : Un avenir prometteur</h2>
      <p>L'IA transforme bel et bien l'industrie marocaine. Si les défis restent nombreux, les opportunités sont immenses pour les entrepreneurs qui sauront saisir cette révolution technologique. Le Maroc a tous les atouts pour devenir un hub régional de l'IA en Afrique.</p>
      
      <p><em>Cet article est le premier d'une série consacrée à la transformation digitale au Maroc. Restez connectés pour nos prochaines analyses !</em></p>
    `
  };

  const relatedArticles = [
    {
      id: 2,
      title: "10 conseils pour réussir sa startup au Maroc",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
      readTime: "6 min",
      category: "Entrepreneuriat"
    },
    {
      id: 3,
      title: "Forum 2024 : Retour sur un succès exceptionnel",
      image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=400&q=80",
      readTime: "5 min",
      category: "Événements"
    },
    {
      id: 4,
      title: "Les métiers du futur : Comment préparer sa carrière ?",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      readTime: "7 min",
      category: "Carrières"
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const shareOptions = [
    { icon: Twitter, name: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: Facebook, name: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Linkedin, name: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: LinkIcon, name: 'Copier le lien', color: 'hover:bg-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      {/* Barre de navigation supérieure */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-emerald-100/50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-emerald-800 hover:text-emerald-900 font-semibold group">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Retour aux articles</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isLiked 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{likes}</span>
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-all ${
                  isBookmarked 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-emerald-100 p-2 min-w-[200px]"
                  >
                    {shareOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 ${option.color} hover:text-white transition-all`}
                      >
                        <option.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{option.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Accueil</span>
          <ChevronRight className="w-4 h-4" />
          <span>Blog</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-emerald-700 font-medium">{article.category}</span>
        </div>
      </div>

      {/* En-tête de l'article */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="max-w-4xl mx-auto">
          {/* Catégorie et stats */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-md">
              {article.category}
            </span>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views.toLocaleString()} vues
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {article.comments} commentaires
              </div>
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl md:text-5xl font-bold text-emerald-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          {/* Sous-titre */}
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            {article.subtitle}
          </p>

          {/* Métadonnées auteur */}
          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <img 
                src={article.author.avatar} 
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
              />
              <div>
                <div className="font-semibold text-emerald-900">{article.author.name}</div>
                <div className="text-sm text-gray-600">{article.author.role}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} de lecture
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image principale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-4 mb-12"
      >
        <div className="max-w-5xl mx-auto">
          <img 
            src={article.image}
            alt={article.title}
            className="w-full h-[400px] md:h-[600px] object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-12 mb-12"
          >
            <MarkdownRenderer content={article.content} />
            
            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-emerald-700" />
                <span className="font-semibold text-emerald-900">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-all font-medium text-sm"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio auteur */}
            <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
              <div className="flex gap-4">
                <img 
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-300"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-900 mb-1">{article.author.name}</h3>
                  <p className="text-sm text-gray-700 mb-3">{article.author.bio}</p>
                  <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
                    Voir tous les articles →
                  </button>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Articles connexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Articles connexes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {related.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-emerald-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {related.readTime}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;