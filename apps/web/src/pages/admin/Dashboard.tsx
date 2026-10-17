import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Badge, SectionHeader, formatCOP } from '../../design-system/ui';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/login');
      return;
    }
    axios.get('/api/admin/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);


  if (loading) return <div className="flex items-center justify-center py-32 text-ink-muted">Cargando…</div>;
  if (!data)   return null;

  const pendingOrders   = data.orders?.find((o: any) => o.status === 'pending')?.count || 0;
  const activeServices  = data.service_orders?.find((s: any) => s.status === 'in_progress')?.count || 0;
  const readyServices   = data.service_orders?.find((s: any) => s.status === 'ready')?.count || 0;

  return (
    <div className="page py-8">
      <div className="mb-8"><SectionHeader as="h1" eyebrow="Administración" title="Panel" /></div>

      {/* KPIs */}
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Ventas del mes',      value: formatCOP(data.monthly_revenue || 0), sub: 'últimos 30 días', color: 'text-success' },
          { label: 'Clientes totales',    value: data.total_customers, sub: 'registrados', color: 'text-ink' },
          { label: 'Órdenes pendientes',  value: pendingOrders, sub: 'por confirmar', color: 'text-warning' },
          { label: 'Taller activo',       value: activeServices, sub: `${readyServices} listas p/ entregar`, color: 'text-info' },
        ].map((kpi) => (
          <div key={kpi.label} className="card">
            <p className="t-label text-ink-muted">{kpi.label}</p>
            <p className={`text-3xl font-bold tabular-nums mt-1 ${kpi.color}`}>{kpi.value}</p>
            <p className="t-caption text-ink-muted mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8">
        {/* Top productos */}
        <div className="card">
          <h2 className="t-display-sm text-ink mb-4">Más vendidos</h2>
          {data.top_products?.length === 0
            ? <p className="t-body-sm text-ink-muted">Sin datos aún.</p>
            : (
              <div className="space-y-3">
                {data.top_products?.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between t-body-sm">
                    <span className="text-ink-2">{p.brand} {p.name}</span>
                    <span className="font-semibold text-ink tabular-nums">{p.sold} vendidas</span>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Stock bajo */}
        <div className="card">
          <h2 className="t-display-sm text-ink mb-4 flex items-center gap-2">
            Inventario crítico
            {data.low_stock_alerts?.length > 0 && (
              <Badge tone="warning" icon="alert">{data.low_stock_alerts.length}</Badge>
            )}
          </h2>
          {data.low_stock_alerts?.length === 0
            ? <p className="t-body-sm text-success">Todo el inventario está bien.</p>
            : (
              <div className="space-y-2">
                {data.low_stock_alerts?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between t-body-sm">
                    <span className="text-ink-2">{item.brand} {item.name}</span>
                    <Badge tone={item.stock === 0 ? 'neutral' : 'warning'}>{item.stock === 0 ? 'Agotado' : `${item.stock} u.`}</Badge>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
