import { Link } from 'react-router-dom';
import { ArrowRightIcon, WrenchScrewdriverIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';

const FEATURES = [
  { icon: <TruckIcon className="h-7 w-7 text-brand-500" />, title: 'Envío a todo Colombia', desc: 'Accesorios y repuestos a la puerta de tu casa.' },
  { icon: <WrenchScrewdriverIcon className="h-7 w-7 text-brand-500" />, title: 'Taller especializado', desc: 'Mecánicos certificados en todas las marcas.' },
  { icon: <ShieldCheckIcon className="h-7 w-7 text-brand-500" />, title: 'Garantía oficial', desc: 'Distribuidores autorizados Honda, Yamaha y Suzuki.' },
];

const CATEGORIES = [
  { slug: 'motorcycles', label: 'Motocicletas', emoji: '🏍️', desc: '184cc — 250cc' },
  { slug: 'helmets',     label: 'Cascos',        emoji: '🪖', desc: 'ECE y DOT certificados' },
  { slug: 'gear',        label: 'Equipamiento',  emoji: '🧤', desc: 'Chaquetas, guantes, botas' },
  { slug: 'parts',       label: 'Repuestos',     emoji: '⚙️', desc: 'Originales y alternativos' },
];

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-dark-900 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-brand-500 font-semibold uppercase tracking-widest text-sm mb-4">Mocana Motors</p>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Vive la<br />
            <span className="text-brand-500">carretera</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Motos, accesorios y servicio técnico especializado. Todo para el motociclista colombiano.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop?category=motorcycles" className="btn-primary flex items-center justify-center gap-2">
              Ver motos <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/service" className="btn-secondary border-gray-600 text-gray-300 flex items-center justify-center gap-2">
              <WrenchScrewdriverIcon className="h-4 w-4" /> Agendar taller
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">¿Qué necesitas hoy?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/shop?category=${cat.slug}`}
              className="group card text-center hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="text-5xl mb-3">{cat.emoji}</div>
              <h3 className="font-bold text-gray-900 group-hover:text-brand-600">{cat.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">{f.icon}</div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Taller */}
      <section className="bg-brand-500 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-black mb-4">Tu moto merece lo mejor</h2>
        <p className="text-brand-100 mb-8 max-w-md mx-auto">Agenda tu servicio en el taller Mocana Motors. Diagnóstico gratuito con cada revisión.</p>
        <Link to="/service" className="bg-white text-brand-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block">
          Agendar servicio
        </Link>
      </section>
    </main>
  );
}
