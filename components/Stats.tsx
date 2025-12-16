import { Users, Building, Calendar, Award, TrendingUp, Sparkles } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: <Users size={28} />,
      number: 5000,
      label: "Participants",
      suffix: "+"
    },
    {
      icon: <Building size={28} />,
      number: 85,
      label: "Partenaires"
    },
    {
      icon: <Calendar size={28} />,
      number: 127,
      label: "Événements"
    },
    {
      icon: <Award size={28} />,
      number: 23,
      label: "Années d'Excellence"
    }
  ];

  const additionalStats = [
    { value: "95%", label: "Taux de satisfaction", icon: <Sparkles size={20} /> },
    { value: "78%", label: "Trouvent un emploi en 6 mois", icon: <TrendingUp size={20} /> },
    { value: "42", label: "Start-ups créées", icon: <Award size={20} /> }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-2 rounded-lg mb-6">
            <Sparkles size={18} />
            <span className="font-medium">Notre Impact</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Des Résultats qui Parlent
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            23 années d'engagement pour connecter l'académique et le professionnel
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800">
                  {stat.icon}
                </div>
              </div>

              <div className="text-4xl font-bold text-slate-900 mb-2">
                {stat.number.toLocaleString()}{stat.suffix}
              </div>

              <div className="text-slate-900 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;