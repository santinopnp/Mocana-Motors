import { useEffect, useState } from 'react';
import axios from 'axios';
import { Hero, SectionHeader, ServiceCard } from '../design-system';
import ProductCard, { Product } from '../components/ProductCard';

export default function LandingPage() {
  const [motos, setMotos] = useState<Product[]>([]);

  useEffect(() => {
    axios.get('/api/catalog/products?category=motorcycles&limit=4')
      .then(({ data }) => setMotos(data.products || []))
      .catch(() => setMotos([]));
  }, []);

  return (
    <main>
      <div className="bg-asphalt">
        <div className="max-w-content mx-auto">
          <Hero
            eyebrow="Bucaramanga · Motos, taller y repuestos"
            title="Tu moto, en buenas manos"
            body="Vendemos motos y motocarros, las reparamos y tenemos el repuesto que buscas. Agenda tu servicio en dos minutos desde el celular."
            primary={{ label: 'Ver motos', href: '/shop?category=motorcycles', icon: 'arrow-right' }}
            secondary={{ label: 'Agendar servicio', href: '/service', icon: 'wrench' }}
          />
        </div>
      </div>

      <section className="page pt-12 lg:pt-16 flex flex-col gap-6">
        <SectionHeader eyebrow="Lo que hacemos" title="Todo en un lugar" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <ServiceCard icon="moto" title="Motos y motocarros" description="Nuevas, con crédito o de contado. Te ayudamos a escoger." actionLabel="Cotizar" href="/shop?category=motorcycles" />
          <ServiceCard icon="wrench" title="Servicio técnico" description="Diagnóstico y reparación por mecánicos especializados." actionLabel="Agendar servicio" href="/service" />
          <ServiceCard icon="toolbox" title="Taller y mantenimiento" description="Cambio de aceite, revisión técnica y planes por kilometraje." actionLabel="Ver planes" href="/service" />
          <ServiceCard icon="nut" title="Repuestos y accesorios" description="Busca por referencia o por tu moto. Cascos, llantas y lubricantes." actionLabel="Buscar repuesto" href="/shop?category=parts" />
        </div>
      </section>

      {motos.length > 0 && (
        <section className="page pt-12 lg:pt-16 flex flex-col gap-6">
          <SectionHeader eyebrow="Catálogo" title="Motos nuevas" actionLabel="Ver todas" href="/shop?category=motorcycles" />
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {motos.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="page pt-12 lg:pt-16">
        <div className="bg-asphalt rounded-3xl p-6 lg:p-10 flex flex-col gap-6">
          <SectionHeader tone="dark" eyebrow="Taller" title="Taller y mantenimiento" actionLabel="Agendar servicio" href="/service" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ServiceCard tone="dark" icon="oil" title="Cambio de aceite" description="Aceite y filtro con revisión de niveles." meta="Unos 45 minutos" actionLabel="Agendar" href="/service" />
            <ServiceCard tone="dark" icon="toolbox" title="Mantenimiento preventivo" description="Frenos, cadena, luces y ajuste general según kilometraje." meta="Medio día" actionLabel="Agendar" href="/service" />
            <ServiceCard tone="dark" icon="shield" title="Revisión técnica" description="Diagnóstico sin costo con cada revisión." meta="Unos 30 minutos" actionLabel="Agendar" href="/service" />
          </div>
        </div>
      </section>
    </main>
  );
}
