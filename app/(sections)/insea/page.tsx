'use client';

import PageHero from '@/components/PageHero';
import { motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Brain,
  Calculator,
  Calendar,
  Code,
  ExternalLink,
  Globe,
  GraduationCap,
  LineChart,
  MapPin,
  Users
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-emerald-100 flex items-center justify-center min-h-[400px]">
      <div className="text-emerald-800 font-medium">Chargement de la carte...</div>
    </div>
  )
});

export default function InseaPage() {
  const filieres = [
    {
      title: "Actuariat - Finance",
      icon: <Calculator className="w-8 h-8" />,
      description: "Formation spécialisée en mathématiques de l'assurance, finance quantitative et gestion des risques.",
      niveau: "Accès en 1ère et 2ème année",
      ficheUrl: "https://insea.ac.ma/files/AF_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Data Science",
      icon: <BarChart3 className="w-8 h-8" />,
      description: "Formation d'excellence en analyse de données, machine learning et modélisation statistique.",
      niveau: "Accès en 1ère et 2ème année",
      ficheUrl: "https://insea.ac.ma/files/DS_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Data and Software Engineering",
      icon: <Code className="w-8 h-8" />,
      description: "Formation complète en développement logiciel, architecture des systèmes et ingénierie des données.",
      niveau: "Accès en 1ère et 2ème année",
      ficheUrl: "https://insea.ac.ma/files/DSE_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Biostatistique, Démographie et Big Data",
      icon: <Users className="w-8 h-8" />,
      description: "Formation en biostatistique, analyse démographique et exploitation des grandes bases de données.",
      niveau: "Accès en 1ère année",
      ficheUrl: "https://insea.ac.ma/files/BSD_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Économie Appliquée, Statistique et Big Data",
      icon: <LineChart className="w-8 h-8" />,
      description: "Formation en économétrie, analyse économique et traitement de données massives.",
      niveau: "Accès en 1ère année / Statistique-Économie appliquée en 2ème année",
      ficheUrl: "https://insea.ac.ma/files/EASBD_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Sciences de la Décision et Recherche Opérationnelle",
      icon: <Brain className="w-8 h-8" />,
      description: "Formation en optimisation, aide à la décision et modélisation des systèmes complexes.",
      niveau: "Accès en 1ère année / Recherche Opérationnelle et Aide à la Décision en 2ème année",
      ficheUrl: "https://insea.ac.ma/files/SDRO_fiche_description_2022.pdf",
      color: "from-emerald-500 to-emerald-600"
    },
    // {
    //   title: "Statistique - Démographie",
    //   icon: <BarChart3 className="w-8 h-8" />,
    //   description: "Formation spécialisée en statistique appliquée et analyse démographique.",
    //   niveau: "Accès en 2ème année",
    //   ficheUrl: "https://insea.ac.ma/files/Filire_SD_19_24.pdf",
    //   color: "from-emerald-500 to-emerald-600"
    // }
  ];

  const chiffresClés = [
    { label: "Création", value: "1961", icon: <Calendar className="w-6 h-6" /> },
    { label: "Lauréats (1961-2011)", value: "4943", icon: <GraduationCap className="w-6 h-6" /> },
    { label: "Étudiants marocains", value: "4403", icon: <Users className="w-6 h-6" /> },
    { label: "Étudiants étrangers", value: "540", icon: <Globe className="w-6 h-6" /> }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section avec PageHero */}
      <PageHero
        title="INSEA"
        subtitle="Institut National de Statistique et d'Économie Appliquée — École d'ingénieurs de référence au Maroc"
        image="/insea-building.jpg"
        badge="Grande École d'Ingénieurs"
      />

      {/* Section Logo et présentation rapide */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Logo INSEA avec effet glow */}
            <div className="flex justify-center mb-8">
              <div className="relative p-8 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200 shadow-lg">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur-2xl" />
                <Image
                  src="/INSEA_logo.png"
                  alt="Logo INSEA"
                  width={200}
                  height={200}
                  className="h-28 md:h-36 w-auto relative z-10"
                  priority
                />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-800 font-semibold text-sm tracking-wide">DEPUIS 1961</span>
            </div>

            {/* Titre section */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              École d’excellence dans les domaines statistiques et économiques
            </h2>

            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Premier établissement supérieur au Maroc à former des cadres en informatique et statistique,
              l'INSEA forme des ingénieurs d'État dans les domaines de la data science, de l'actuariat,
              de l'intelligence artificielle et de l'économie appliquée.
            </p>

            {/* CTA */}
            <Link
              href="https://insea.ac.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-300 group"
            >
              <span>Visiter le site officiel</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

   

      {/* Présentation */}
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
              À Propos de l'INSEA
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
                  Créé en <strong className="text-slate-900">1961</strong> sous l'appellation « Centre de formation des ingénieurs des travaux de la statistique »,
                  la dénomination <strong className="text-emerald-700">Institut National de Statistique et d'Économie Appliquée (INSEA)</strong> a été adoptée en
                  <strong> 1967</strong> en application du Décret Royal n° 532-67.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  Jusqu'en <strong>1974</strong>, l'INSEA se limitait à la formation des ingénieurs d'application de la statistique en trois ans et des
                  adjoints techniques en deux ans. Depuis cette date, et compte tenu des besoins importants dans le domaine de l'informatique,
                  l'Institut a introduit un cycle de formation des Ingénieurs Analystes et un cycle de Programmeurs, devenant ainsi le
                  <strong className="text-emerald-700"> premier établissement supérieur au Maroc à former des cadres en informatique</strong>.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  En <strong>1983</strong>, un cycle supérieur de formation d'Analyste Concepteur et un autre de Statisticien-Démographe ont été introduits,
                  avec l'allongement de la durée de formation des ingénieurs d'application à quatre ans pour améliorer le niveau de cette formation.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  En <strong>1995</strong>, l'INSEA a opéré un changement majeur en offrant une formation sur trois ans menant à un
                  <strong className="text-emerald-700"> diplôme d'Ingénieur d'État de l'INSEA</strong>.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  À partir de <strong>2011</strong>, la formation à l'INSEA est organisée en <strong>3 cycles</strong> :
                  Cycle Ingénieur, Cycle du Master, et Cycle de Doctorat.
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

      {/* L'INSEA en chiffres - Détails */}
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
              Durant cinquante ans (1961-2011), l'INSEA a formé <strong className="text-emerald-700">4943 étudiants</strong> dont
              <strong> 4403 étudiants marocains</strong> et <strong>540 étudiants étrangers</strong> provenant de pays africains
              francophones, maghrébins et arabes.
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
                <div className="text-slate-700 font-medium">Ingénieurs d'Application de la Statistique</div>
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
                <div className="text-slate-700 font-medium">Ingénieurs d'État (nouvelle réforme)</div>
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
                <div className="text-slate-700 font-medium">Ingénieurs d'État (ancien régime)</div>
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

      {/* Filières */}
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
              Nos Filières
            </h2>
            <div className="w-16 h-0.5 bg-emerald-600 mx-auto mb-8" />
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              L'INSEA propose 5 filières d'ingénierie de pointe, alliant excellence académique et professionnalisation
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
                      Systèmes d'information et Systèmes Intelligents (M2SI)
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Formation approfondie en systèmes d'information, intelligence artificielle et recherche en informatique.
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

      {/* Activités parascolaires */}
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
              Activités parascolaires
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
                Vie étudiante
              </h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Plusieurs manifestations sont organisées chaque année par les étudiants comme la <strong>semaine culturelle</strong> qui
                  traite un thème précis et pendant laquelle des conférences, projections, ateliers et compétitions sont au rendez-vous.
                </p>
                <p>
                  De même, des <strong>excursions</strong> sont organisées chaque année dans différentes régions du pays par et pour
                  les étudiants de l'institut afin de leur garantir épanouissement et amusement après les dures périodes de préparation.
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
                  L'INSEA construit chaque année un pont entre ses lauréats et le monde des entreprises à travers sa participation
                  du <strong className="text-emerald-700">forum G.E.N.I (Grandes Écoles Nationales d'Ingénieurs)</strong> de Rabat.
                </p>
                <p>
                  Ce forum qui reste le fruit de la collaboration de l'<strong>Institut National des Postes et Télécommunication (INPT)</strong> et
                  l'<strong>École Nationale Supérieure d'Informatique et d'Analyse de Systèmes (ENSIAS)</strong> avec l'INSEA est un événement
                  important pour la valorisation du profil de l'inseaïste auprès des entreprises.
                </p>
                <p>
                  Le forum GENI adopte chaque année un thème qui conjugue le développement du Maroc aux compétences des ingénieurs et
                  reçoit des personnalités éminentes du monde économique, politique et scientifique qui interviennent au fil des
                  différentes conférences et tables rondes organisées à cette occasion.
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
