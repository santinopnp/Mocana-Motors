import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders]             = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/orders').then(({ data }) => setOrders(data)).catch(() => {});
    axios.get('/api/service-orders').then(({ data }) => setServiceOrders(data)).catch(() => {});
  }, [user, navigate]);

  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    scheduled: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    ready: 'bg-green-100 text-green-700',
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Mi cuenta</h1>
          <p className="text-gray-500">{user.first_name} {user.last_name} · {user.email}</p>
        </div>
        <button onClick={logout} className="btn-secondary text-sm">Cerrar sesión</button>
      </div>

      {/* Órdenes de compra */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Mis pedidos</h2>
        {orders.length === 0 ? <p className="text-gray-400 text-sm">Aún no tienes pedidos.</p> : (
          <div className="space-y-3">
            {orders.map((o: any) => (
              <div key={o.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-semibold">{o.order_number}</p>
                  <p className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString('es-CO')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{fmt(o.total)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Órdenes de taller */}
      <section>
        <h2 className="text-xl font-bold mb-4">Mi historial de taller</h2>
        {serviceOrders.length === 0 ? <p className="text-gray-400 text-sm">Aún no tienes servicios de taller.</p> : (
          <div className="space-y-3">
            {serviceOrders.map((so: any) => (
              <div key={so.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-semibold">{so.service_number}</p>
                  <p className="text-sm text-gray-500">{so.moto_plate} · {so.service_type}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[so.status] || 'bg-gray-100 text-gray-600'}`}>{so.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
