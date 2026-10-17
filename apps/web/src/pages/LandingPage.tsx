import { Link } from 'react-router-dom';
import { Hero, Icon, SectionHeader, ServiceCard, Button, type IconName } from '../design-system/ui';

const CATEGORIES: { to: string; label: string; icon: IconName }[] = [
  { to: '/motos',                    label: 'Motos',        icon: 'moto' },
  { to: '/shop?category=motocarros', label: 'Motocarros',   icon: 'motocarro' },
  { to: '/repuestos',                label: 'Repuestos',    icon: 'nut' },
  { to: '/accesorios',               label: 'Accesorios',   icon: 'tag' },
  { to: '/shop?category=helmets',    label: 'Cascos',       icon: 'shield' },
  { to: '/shop?category=lubricants', label: 'Lubricantes',  icon: 'oil' },
];

const SERVICES: { icon: IconName; title: string; description: string; meta: string }[] = [
  { icon: 'wrench',  title: 'Servicio técnico',  description: 'Diagnóstico y reparación especializada para todas las marcas.', meta: 'Diagnóstico incluido' },
  { icon: 'toolbox', title: 'Mantenimiento',     description: 'Planes preventivos: frenos, cadena, filtros y ajuste general.', meta: 'Desde 2 horas' },
  { icon: 'oil',     title: 'Cambio de aceite',  description: 'Aceite y filtro con repuestos originales.', meta: 'Mientras esperas' },
];

const FEATURES: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'map-pin', title: 'Envío a todo Colombia', desc: 'Repuestos y accesorios hasta tu puerta.' },
  { icon: 'wrench',  title: 'Taller especializado',  desc: 'Mecánicos expertos en todas las marcas.' },
  { icon: 'shield',  title: 'Garantía oficial',      desc: 'Distribuidores Honda, Yamaha y Suzuki.' },
];

export default function LandingPage() {
  return (
    <main>
      <Hero
        eyebrow="Mocana Motors · Bucaramanga"
        title="Rueda con Mocana"
        body="Venta de motos y motocarros, servicio técnico, taller y repuestos en un solo lugar."
        primary={{ label: 'Ver motos', to: '/motos', icon: 'arrow-right' }}
        secondary={{ label: 'Agendar servicio', to: '/service', icon: 'calendar' }}
      />

      {/* ── Categorías ── */}
      <section className="py-12 desktop:py-16">
        <div className="page flex flex-col gap-6">
          <SectionHeader eyebrow="Tienda" title="¿Qué necesitas?" actionLabel="Ver todo" to="/shop" />
          <ul className="grid grid-cols-3 tablet:grid-cols-6 gap-3">
            {CATEGORIES.map((c) => (
              <li key={c.to}>
                <Link
                  to={c.to}
                  className="flex flex-col items-center justify-center gap-2 min-h-[96px] p-3 rounded-lg bg-surface-raised border border-line text-ink hover:border-line-strong"
                >
                  <span className="w-12 h-12 rounded-md bg-brand-soft text-brand-ink flex items-center justify-center">
                    <Icon name={c.icon} size={26} />
                  </span>
                  <span className="t-label text-center">{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Taller ── */}
      <section className="bg-asphalt py-12 desktop:py-16">
        <div className="page flex flex-col gap-6">
          <SectionHeader tone="dark" eyebrow="Servicio técnico" title="Taller y mantenimiento" actionLabel="Agendar" to="/service" />
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <ServiceCard key={s.title} tone="dark" {...s} actionLabel="Agendar servicio" to="/service" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Banda de ofertas ── */}
      <section className="page py-12 desktop:py-16">
        <div className="rounded-xl bg-brand-strong text-brand-on p-6 desktop:p-10 flex flex-col desktop:flex-row desktop:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="mm-eyebrow !text-brand-on">Repuestos originales</p>
            <h2 className="t-display-md">Busca por referencia</h2>
            <p className="t-body-sm max-w-md">Encuentra el repuesto exacto con la referencia del fabricante o el modelo de tu moto.</p>
          </div>
          <Button variant="light" to="/repuestos" iconStart="search" className="shrink-0">Buscar repuestos</Button>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className="bg-surface-raised border-t border-line py-12 desktop:py-16">
        <div className="page grid grid-cols-1 tablet:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-md bg-brand-soft text-brand-ink flex items-center justify-center shrink-0">
                <Icon name={f.icon} size={24} />
              </span>
              <div>
                <p className="t-title text-ink">{f.title}</p>
                <p className="t-body-sm text-ink-muted mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
