'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Award,
  Globe,
  Sparkles,
  Target,
  Brain,
  LineChart,
  Code,
  Calculator,
  BarChart3,
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  Star,
  Trophy,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import InteractiveMap from '@/components/InteractiveMap';

export default function InseaPage() {
  const filieres = [
    {
      title: "Actuariat - Finance",
      icon: <Calculator className="w-8 h-8" />,
      description: "Formation specialisee en mathematiques de l'assurance, finance quantitative et gestion des risques.",
      niveau: "Acces en 1ere et 2eme annee",
      ficheUrl: "https://insea.ac.ma/files/AF_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Data Science",
      icon: <BarChart3 className="w-8 h-8" />,
      description: "Formation d'excellence en analyse de donnees, machine learning et modelisation statistique.",
      niveau: "Acces en 1ere et 2eme annee",
      ficheUrl: "https://insea.ac.ma/files/DS_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Data and Software Engineering",
      icon: <Code className="w-8 h-8" />,
      description: "Formation complete en developpement logiciel, architecture des systemes et ingenierie des donnees.",
      niveau: "Acces en 1ere et 2eme annee",
      ficheUrl: "https://insea.ac.ma/files/DSE_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Biostatistique, Demographie et Big Data",
      icon: <Users className="w-8 h-8" />,
      description: "Formation en biostatistique, analyse demographique et exploitation des grandes bases de donnees.",
      niveau: "Acces en 1ere annee",
      ficheUrl: "https://insea.ac.ma/files/BSD_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Economie Appliquee, Statistique et Big Data",
      icon: <LineChart className="w-8 h-8" />,
      description: "Formation en econometrie, analyse economique et traitement de donnees massives.",
      niveau: "Acces en 1ere annee / Statistique-Economie appliquee en 2eme annee",
      ficheUrl: "https://insea.ac.ma/files/EASBD_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Sciences de la Decision et Recherche Operationnelle",
      icon: <Brain className="w-8 h-8" />,
      description: "Formation en optimisation, aide a la decision et modelisation des systemes complexes.",
      niveau: "Acces en 1ere annee / Recherche Operationnelle et Aide a la Decision en 2eme annee",
      ficheUrl: "https://insea.ac.ma/files/SDRO_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Statistique - Demographie",
      icon: <BarChart3 className="w-8 h-8" />,
      description: "Formation specialisee en statistique appliquee et analyse demographique.",
      niveau: "Acces en 2eme annee",
      ficheUrl: "https://insea.ac.ma/files/Filire_SD_19_24.pdf",
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const chiffresClés = [
    { label: "Creation", value: "1961", icon: <Calendar className="w-6 h-6" /> },
    { label: "Laureats (1961-2011)", value: "4943", icon: <GraduationCap className="w-6 h-6" /> },
    { label: "Etudiants marocains", value: "4403", icon: <Users className="w-6 h-6" /> },
    { label: "Etudiants etrangers", value: "540", icon: <Globe className="w-6 h-6" /> }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 pt-20 pb-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/insea-building.jpg"
            alt="Campus INSEA"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/60 via-emerald-700/60 to-green-800/70" />
        </div>

        {/* Decorative overlays */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo INSEA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="relative bg-white/20 rounded-3xl p-6">
                <div className="absolute inset-0 bg-white/40 blur-xl  -z-10" />
                <img
                  src="/INSEA_logo.png"
                  alt="Logo INSEA"
                  className="h-32 md:h-40 w-auto drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.6))'
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', delay: 0.4 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30"
            >
              <GraduationCap className="w-6 h-6 text-white" />
              <span className="text-white font-bold text-sm tracking-wider">GRANDE ECOLE D'INGENIEURS</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Institut National de Statistique
              <br />
              et d'Economie Appliquee
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
              Ecole d'ingenieurs de reference au Maroc en statistique, data science,
              actuariat, intelligence artificielle et economie appliquee
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://insea.ac.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <span>Site Officiel</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="rgb(248, 250, 252)"/>
          </svg>
        </div>
      </section>

  

      {/* Presentation */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              A Propos de l'INSEA
            </h2>
            <div className="w-16 h-0.5 bg-emerald-600 mx-auto mb-8" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="prose prose-lg max-w-none space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  Cree en <strong className="text-slate-900">1961</strong> sous l'appellation « Centre de formation des ingenieurs des travaux de la statistique »,
                  la denomination <strong className="text-emerald-700">Institut National de Statistique et d'Economie Appliquee (INSEA)</strong> a ete adoptee en
                  <strong> 1967</strong> en application du Decret Royal n° 532-67.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  Jusqu'en <strong>1974</strong>, l'INSEA se limitait a la formation des ingenieurs d'application de la statistique en trois ans et des
                  adjoints techniques en deux ans. Depuis cette date, et compte tenu des besoins importants dans le domaine de l'informatique,
                  l'Institut a introduit un cycle de formation des Ingenieurs Analystes et un cycle de Programmeurs, devenant ainsi le
                  <strong className="text-emerald-700"> premier etablissement superieur au Maroc a former des cadres en informatique</strong>.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  En <strong>1983</strong>, un cycle superieur de formation d'Analyste Concepteur et un autre de Statisticien-Demographe ont ete introduits,
                  avec l'allongement de la duree de formation des ingenieurs d'application a quatre ans pour ameliorer le niveau de cette formation.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  En <strong>1995</strong>, l'INSEA a opere un changement majeur en offrant une formation sur trois ans menant a un
                  <strong className="text-emerald-700"> diplome d'Ingenieur d'Etat de l'INSEA</strong>.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  A partir de <strong>2011</strong>, la formation a l'INSEA est organisee en <strong>3 cycles</strong> :
                  Cycle Ingenieur, Cycle du Master, et Cycle de Doctorat.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img
                  src="/INSEA_logo.png"
                  alt="Logo INSEA"
                  className="w-full h-auto object-contain bg-slate-50 p-12"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* L'INSEA en chiffres - Details */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              L'INSEA en chiffres
            </h2>
            <div className="w-16 h-0.5 bg-emerald-600 mx-auto mb-8" />
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Durant cinquante ans (1961-2011), l'INSEA a forme <strong className="text-emerald-700">4943 etudiants</strong> dont
              <strong> 4403 etudiants marocains</strong> et <strong>540 etudiants etrangers</strong> provenant de pays africains
              francophones, maghrebins et arabes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">1542</div>
                <div className="text-sm font-medium text-slate-600 mb-1">31%</div>
                <div className="text-slate-700 font-medium">Ingenieurs d'Application de la Statistique</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">1421</div>
                <div className="text-sm font-medium text-slate-600 mb-1">29%</div>
                <div className="text-slate-700 font-medium">Ingenieurs d'Etat (nouvelle reforme)</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">755</div>
                <div className="text-sm font-medium text-slate-600 mb-1">15%</div>
                <div className="text-slate-700 font-medium">Analystes en informatique</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">611</div>
                <div className="text-sm font-medium text-slate-600 mb-1">12%</div>
                <div className="text-slate-700 font-medium">Adjoints Techniques de la Statistique</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">350</div>
                <div className="text-sm font-medium text-slate-600 mb-1">7%</div>
                <div className="text-slate-700 font-medium">Ingenieurs d'Etat (ancien regime)</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">265</div>
                <div className="text-sm font-medium text-slate-600 mb-1">5%</div>
                <div className="text-slate-700 font-medium">Adjoints Techniques Programmeurs</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filieres */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Nos Filieres
            </h2>
            <div className="w-16 h-0.5 bg-emerald-600 mx-auto mb-8" />
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              L'INSEA propose 5 filieres d'ingenierie de pointe, alliant excellence academique et professionnalisation
            </p>
          </motion.div>

          <div className="space-y-6">
            {filieres.map((filiere, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    {filiere.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                      {filiere.title}
                    </h3>
                    <p className="text-slate-600 mb-3 leading-relaxed text-sm md:text-base">
                      {filiere.description}
                    </p>

                    <Link
                      href={filiere.ficheUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-600 hover:text-emerald-700 rounded-md text-xs md:text-sm font-medium border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                    >
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      Fiche descriptive
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Master Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 pt-12 border-t border-slate-200"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
              Cycle de Master
            </h3>

            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                    <Award className="w-7 h-7" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                      Master de Recherche
                    </h4>
                    <p className="text-lg font-semibold text-emerald-700 mb-3">
                      Systemes d'information et Systemes Intelligents (M2SI)
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Formation approfondie en systemes d'information, intelligence artificielle et recherche en informatique.
                    </p>

                    <Link
                      href="https://insea.ac.ma/files/BrochureMasterM2SI-2025.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-all group shadow-md"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      Brochure du Master
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activites parascolaires */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Activites parascolaires
            </h2>
            <div className="w-16 h-0.5 bg-emerald-600 mx-auto" />
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Semaine culturelle & Excursions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 rounded-xl border border-slate-200 p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Vie etudiante
              </h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Plusieurs manifestations sont organisees chaque annee par les etudiants comme la <strong>semaine culturelle</strong> qui
                  traite un theme precis et pendant laquelle des conferences, projections, ateliers et competitions sont au rendez-vous.
                </p>
                <p>
                  De meme, des <strong>excursions</strong> sont organisees chaque annee dans differentes regions du pays par et pour
                  les etudiants de l'institut afin de leur garantir epanouissement et amusement apres les dures periodes de preparation.
                </p>
              </div>
            </motion.div>

            {/* Forum GENI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Forum G.E.N.I
              </h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  L'INSEA construit chaque annee un pont entre ses laureats et le monde des entreprises a travers sa participation
                  du <strong className="text-emerald-700">forum G.E.N.I (Grandes Ecoles Nationales d'Ingenieurs)</strong> de Rabat.
                </p>
                <p>
                  Ce forum qui reste le fruit de la collaboration de l'<strong>Institut National des Postes et Telecommunication (INPT)</strong> et
                  l'<strong>Ecole Nationale Superieure d'Informatique et d'Analyse de Systemes (ENSIAS)</strong> avec l'INSEA est un evenement
                  important pour la valorisation du profil de l'inseaiste aupres des entreprises.
                </p>
                <p>
                  Le forum GENI adopte chaque annee un theme qui conjugue le developpement du Maroc aux competences des ingenieurs et
                  recoit des personnalites eminentes du monde economique, politique et scientifique qui interviennent au fil des
                  differentes conferences et tables rondes organisees a cette occasion.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Localisation */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Nous Trouver
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-green-600 mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 border border-slate-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Adresse</h3>
                    <p className="text-slate-600">
                      Boulevard Mohamed Belhassan El Ouazzani<br />
                      Madinat Al Irfane, BP 6217<br />
                      Rabat-Instituts, 10001<br />
                      Maroc
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100  flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Site Web</h3>
                    <Link
                      href="https://insea.ac.ma"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                    >
                      www.insea.ac.ma
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 lg:h-full min-h-[400px] overflow-hidden"
            >
              <div className="absolute inset-0">
                <InteractiveMap />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
