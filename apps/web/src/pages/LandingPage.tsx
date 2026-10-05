import { Link } from 'react-router-dom';
import { ArrowRightIcon, WrenchScrewdriverIcon, ShieldCheckIcon, TruckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  { slug: 'motorcycles', label: 'Motos',        emoji: '🏍️', bg: 'bg-orange-50',  text: 'text-orange-700' },
  { slug: 'helmets',     label: 'Cascos',        emoji: '🪖', bg: 'bg-blue-50',    text: 'text-blue-700' },
  { slug: 'gear',        label: 'Equipamiento',  emoji: '🧤', bg: 'bg-green-50',   text: 'text-green-700' },
  { slug: 'parts',       label: 'Repuestos',     emoji: '⚙️', bg: 'bg-purple-50',  text: 'text-purple-700' },
  { slug: 'accessories', label: 'Accesorios',    emoji: '🔦', bg: 'bg-yellow-50',  text: 'text-yellow-700' },
  { slug: 'lubricants',  label: 'Lubricantes',   emoji: '🛢️', bg: 'bg-gray-50',    text: 'text-gray-700' },
];

const FEATURES = [
  { icon: <TruckIcon className="h-6 w-6" />, title: 'Envío a todo Colombia', desc: 'Rápido y seguro a tu puerta.' },
  { icon: <WrenchScrewdriverIcon className="h-6 w-6" />, title: 'Taller certificado', desc: 'Mecánicos expertos en todas las marcas.' },
  { icon: <ShieldCheckIcon className="h-6 w-6" />, title: 'Garantía oficial', desc: 'Distribuidores Honda, Yamaha, Suzuki.' },
];

export default function LandingPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative bg-dark-900 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f97316 0, #f97316 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-32">
          <span className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            🏍️ Mocana Motors — Colombia
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.05] mb-5">
            Vive la<br />
            <span className="text-brand-500">carretera.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-md mb-8 leading-relaxed">
            Motos, accesorios y servicio técnico especializado. Todo para el motociclista colombiano.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/shop?category=motorcycles" className="btn-primary gap-2 text-sm">
              Ver motos <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/service" className="btn-secondary border-gray-700 text-gray-300 hover:text-white gap-2 text-sm">
              <WrenchScrewdriverIcon className="h-4 w-4" /> Agendar taller
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categorías ── */}
      <section className="py-8 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="px-5 flex items-center justify-between mb-5">
            <h2 className="text-xl font-black">¿Qué necesitas?</h2>
            <Link to="/shop" className="text-brand-500 text-sm font-semibold flex items-center gap-1">
              Ver todo <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-6 gap-3 overflow-x-auto px-5 pb-2 scrollbar-none -mx-0">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className={`shrink-0 w-24 md:w-auto flex flex-col items-center gap-2 p-4 rounded-2xl ${cat.bg} transition-transform active:scale-95`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className={`text-xs font-semibold text-center leading-tight ${cat.text}`}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo banner ── */}
      <section className="px-5 max-w-7xl mx-auto mb-8 md:mb-14">
        <div className="bg-gradient-to-r from-dark-900 to-gray-800 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 text-9xl flex items-center justify-end pr-4 pointer-events-none select-none">🏍️</div>
          <div>
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-2">Taller</p>
            <h3 className="text-white text-2xl md:text-3xl font-black mb-1">Tu moto merece lo mejor</h3>
            <p className="text-gray-400 text-sm">Diagnóstico gratuito con cada revisión.</p>
          </div>
          <Link to="/service" className="btn-primary shrink-0 text-sm gap-2">
            <WrenchScrewdriverIcon className="h-4 w-4" /> Agendar servicio
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white border-t border-gray-100 py-10 md:py-16 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
