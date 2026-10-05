import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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

  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n || 0);

  if (loading) return <div className="flex items-center justify-center py-32 text-gray-400">Cargando…</div>;
  if (!data)   return null;

  const pendingOrders   = data.orders?.find((o: any) => o.status === 'pending')?.count || 0;
  const activeServices  = data.service_orders?.find((s: any) => s.status === 'in_progress')?.count || 0;
  const readyServices   = data.service_orders?.find((s: any) => s.status === 'ready')?.count || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8">Dashboard Admin</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Ventas del mes',      value: fmt(data.monthly_revenue), sub: 'últimos 30 días', color: 'text-green-600' },
          { label: 'Clientes totales',    value: data.total_customers, sub: 'registrados', color: 'text-blue-600' },
          { label: 'Órdenes pendientes',  value: pendingOrders, sub: 'por confirmar', color: 'text-yellow-600' },
          { label: 'Taller activo',       value: activeServices, sub: `${readyServices} listas p/ entregar`, color: 'text-purple-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="card">
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className={`text-3xl font-black mt-1 ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top productos */}
        <div className="card">
          <h2 className="font-bold mb-4">Top productos vendidos</h2>
          {data.top_products?.length === 0
            ? <p className="text-gray-400 text-sm">Sin datos aún</p>
            : (
              <div className="space-y-3">
                {data.top_products?.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{p.brand} {p.name}</span>
                    <span className="font-semibold text-gray-900">{p.sold} vendidas</span>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Stock bajo */}
        <div className="card">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            Inventario crítico
            {data.low_stock_alerts?.length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">{data.low_stock_alerts.length}</span>
            )}
          </h2>
          {data.low_stock_alerts?.length === 0
            ? <p className="text-gray-400 text-sm">Todo el inventario está bien ✅</p>
            : (
              <div className="space-y-2">
                {data.low_stock_alerts?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.brand} {item.name}</span>
                    <span className={`font-bold ${item.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>{item.stock} u.</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
