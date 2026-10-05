import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBagIcon, WrenchScrewdriverIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending:    { label: 'Pendiente',   cls: 'bg-yellow-100 text-yellow-700' },
  confirmed:  { label: 'Confirmado',  cls: 'bg-blue-100   text-blue-700'   },
  processing: { label: 'En proceso',  cls: 'bg-blue-100   text-blue-700'   },
  shipped:    { label: 'Enviado',     cls: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'Entregado',   cls: 'bg-green-100  text-green-700'  },
  cancelled:  { label: 'Cancelado',   cls: 'bg-red-100    text-red-700'    },
  scheduled:  { label: 'Agendado',    cls: 'bg-yellow-100 text-yellow-700' },
  in_progress:{ label: 'En taller',   cls: 'bg-blue-100   text-blue-700'   },
  ready:      { label: 'Listo',       cls: 'bg-green-100  text-green-700'  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABEL[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${s.cls}`}>{s.label}</span>;
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders]             = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [tab, setTab] = useState<'orders' | 'service'>('orders');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/orders').then(({ data }) => setOrders(data)).catch(() => {});
    axios.get('/api/service-orders').then(({ data }) => setServiceOrders(data)).catch(() => {});
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile header */}
      <div className="bg-dark-900 px-5 pt-6 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-black text-xl shrink-0">
            {user.first_name?.[0] || user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">{user.first_name} {user.last_name}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2.5 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
            title="Cerrar sesión"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white">
        {[
          { key: 'orders',  label: 'Mis pedidos',   icon: <ShoppingBagIcon className="h-4 w-4" /> },
          { key: 'service', label: 'Taller',         icon: <WrenchScrewdriverIcon className="h-4 w-4" /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.key
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {tab === 'orders' && (
          orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBagIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aún no tienes pedidos</p>
              <Link to="/shop" className="btn-primary text-sm mt-4 inline-flex">Ver catálogo</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o: any) => (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{o.order_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(o.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-black text-gray-900 text-sm">{fmt(o.total)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'service' && (
          serviceOrders.length === 0 ? (
            <div className="text-center py-16">
              <WrenchScrewdriverIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aún no tienes servicios de taller</p>
              <Link to="/service" className="btn-primary text-sm mt-4 inline-flex">Agendar servicio</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {serviceOrders.map((so: any) => (
                <div key={so.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{so.service_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{so.moto_plate} · {so.service_type}</p>
                  </div>
                  <StatusBadge status={so.status} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
