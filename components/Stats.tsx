import { Users, Building, Calendar, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    number: 5000,
    label: "Participants",
    suffix: "+"
  },
  {
    icon: Building,
    number: 85,
    label: "Partenaires"
  },
  {
    icon: Calendar,
    number: 127,
    label: "Événements"
  },
  {
    icon: Award,
    number: 23,
    label: "Années d'Excellence"
  }
];

const Stats = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        {/* En-tête épuré */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
           Des résultats qui parlent
          </h2>
          <p className="text-md text-slate-500 max-w-xl mx-auto font-normal">
            L’impact concret de l’engagement associatif pour amplifier les opportunités et la réussite professionnelle.
          </p>
        </div>
        {/* Statistiques sobres */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-3"
            >
              <div className="mb-2 flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-200">
                <stat.icon size={28} className="text-emerald-700" />
              </div>
              <div className="text-3xl font-bold text-slate-900 tabular-nums">
                {stat.number.toLocaleString()}<span className="text-emerald-600 font-semibold">{stat.suffix}</span>
              </div>
              <div className="text-slate-700 text-sm font-medium text-center tracking-tight">
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