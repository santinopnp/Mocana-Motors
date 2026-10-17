import { Link } from 'react-router-dom';
import Icon, { IconName } from '../components/Icon';

const LINES: { to: string; icon: IconName; title: string; desc: string; cta: string }[] = [
  { to: '/shop?category=motorcycles', icon: 'moto',    title: 'Motos y motocarros',     desc: 'Nuevas, con crédito o de contado. Te ayudamos a escoger.',          cta: 'Cotizar' },
  { to: '/service',                   icon: 'wrench',  title: 'Servicio técnico',       desc: 'Diagnóstico y reparación por mecánicos especializados.',            cta: 'Agendar servicio' },
  { to: '/service',                   icon: 'toolbox', title: 'Taller y mantenimiento', desc: 'Cambio de aceite, revisión técnica y planes por kilometraje.',      cta: 'Ver planes' },
  { to: '/shop?category=parts',       icon: 'nut',     title: 'Repuestos y accesorios', desc: 'Busca por referencia o por tu moto. Cascos, llantas y lubricantes.', cta: 'Buscar repuesto' },
];

const SERVICES = ['Cambio de aceite', 'Mantenimiento preventivo', 'Revisión técnica'];

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-asphalt text-white">
        <div className="max-w-content mx-auto px-4 md:px-10 pt-8 pb-12 lg:pt-14 lg:pb-[72px] flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-12">
          <div className="flex-1 flex flex-col gap-5 lg:gap-6">
            <span className="eyebrow text-chrome">Bucaramanga · Motos, taller y repuestos</span>
            <h1 className="display text-[44px] lg:text-[64px]">Tu moto, en buenas manos</h1>
            <p className="text-chrome text-lg leading-7 max-w-[480px]">
              Vendemos motos y motocarros, las reparamos y tenemos el repuesto que buscas. Agenda tu servicio en dos minutos desde el celular.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/shop?category=motorcycles" className="btn-primary gap-2.5 text-[17px]">
                Ver motos <Icon name="arrow-right" size={20} />
              </Link>
              <Link to="/service" className="btn-on-dark gap-2.5 text-[17px]">
                <Icon name="wrench" size={20} /> Agendar servicio
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-chrome text-[15px]">
              <span className="flex items-center gap-2"><Icon name="shield" size={20} /> Garantía en cada servicio</span>
              <span className="flex items-center gap-2"><Icon name="clock" size={20} /> Lunes a sábado</span>
            </div>
          </div>
          {/* Reemplazar por foto real del taller o de la moto en la calle */}
          <div className="flex-1 aspect-[4/3] rounded-lg bg-asphalt-raised flex items-center justify-center">
            <img src="/brand/mocana-emblem-dark.svg" alt="" width={200} height={106} className="w-1/2 h-auto" />
          </div>
        </div>
      </section>

      {/* Líneas de negocio */}
      <section className="max-w-content mx-auto px-4 md:px-10 pt-12 lg:pt-16 flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="eyebrow text-brand-600">Lo que hacemos</span>
          <h2 className="display text-[32px] lg:text-[44px]">Todo en un lugar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {LINES.map((l) => (
            <Link key={l.title} to={l.to} className="bg-surface-raised rounded-lg p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-12 h-12 rounded-md bg-asphalt text-white flex items-center justify-center"><Icon name={l.icon} size={26} /></span>
              <span className="text-xl font-bold">{l.title}</span>
              <span className="text-ink-3">{l.desc}</span>
              <span className="mt-auto text-brand-600 font-semibold">{l.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Taller */}
      <section className="max-w-content mx-auto px-4 md:px-10 pt-12 lg:pt-16">
        <div className="bg-asphalt text-white rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:items-center">
          <div className="flex-1 flex flex-col gap-3">
            <span className="eyebrow text-chrome">Taller</span>
            <h2 className="display text-[28px] lg:text-[40px]">Taller y mantenimiento</h2>
            <p className="text-chrome max-w-[460px]">Te avisamos cuando tu moto esté lista para entregar. Diagnóstico sin costo con cada revisión.</p>
          </div>
          <ul className="flex-1 flex flex-col gap-2">
            {SERVICES.map((s) => (
              <li key={s} className="bg-asphalt-raised rounded-md px-4 py-3.5 font-semibold">{s}</li>
            ))}
            <li className="pt-2">
              <Link to="/service" className="btn-on-dark inline-flex">Agendar servicio</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
