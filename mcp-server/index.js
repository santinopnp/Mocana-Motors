#!/usr/bin/env node
/**
 * Mocana Motors MCP Server
 * Permite a Claude gestionar toda la operación de Mocana Motors:
 * ventas, taller, inventario, clientes, finanzas y soporte.
 */
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const axios = require('axios');

const API_BASE    = process.env.MOCANA_API_URL    || 'http://localhost:3000/api';
const ADMIN_TOKEN = process.env.MOCANA_ADMIN_TOKEN || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' },
  timeout: 15000,
});

const server = new Server(
  { name: 'mocana-motors-admin', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// ── Tool definitions ──────────────────────────────────────────────────────────

server.setRequestHandler('tools/list', async () => ({
  tools: [

    // ── DASHBOARD ──────────────────────────────────────────────────────────
    {
      name: 'get_dashboard',
      description: 'Resumen ejecutivo del negocio: ventas del día y mes, órdenes pendientes, órdenes de taller activas, alertas de inventario bajo, top productos vendidos y motos más pedidas.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },

    // ── ÓRDENES DE VENTA ───────────────────────────────────────────────────
    {
      name: 'list_orders',
      description: 'Lista órdenes de venta con filtros. Estados: pending (pendiente de confirmación), confirmed (confirmada), processing (preparando), shipped (enviada), delivered (entregada), cancelled (cancelada), refunded (reembolsada).',
      inputSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
          },
          limit: { type: 'number', default: 20 },
          page:  { type: 'number', default: 1 },
        },
      },
    },
    {
      name: 'update_order_status',
      description: 'Actualiza el estado de una orden de venta. Para envíos agrega tracking_number. Para cancelaciones agrega el motivo en notes.',
      inputSchema: {
        type: 'object',
        properties: {
          order_id:       { type: 'string', description: 'ID de la orden' },
          status:         { type: 'string', enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] },
          tracking_number: { type: 'string', description: 'Número de guía de envío (opcional)' },
          notes:          { type: 'string', description: 'Notas internas o motivo de cancelación' },
        },
        required: ['order_id', 'status'],
      },
    },

    // ── TALLER / SERVICIO ──────────────────────────────────────────────────
    {
      name: 'list_service_orders',
      description: 'Lista órdenes del taller de servicio. Estados: scheduled (agendada), in_progress (en proceso), waiting_parts (esperando repuestos), ready (lista para entregar), delivered (entregada), cancelled (cancelada).',
      inputSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['scheduled', 'in_progress', 'waiting_parts', 'ready', 'delivered', 'cancelled'],
          },
          mechanic_id: { type: 'string', description: 'Filtrar por mecánico asignado' },
          limit: { type: 'number', default: 20 },
          page:  { type: 'number', default: 1 },
        },
      },
    },
    {
      name: 'create_service_order',
      description: 'Crea una nueva orden de servicio en el taller. Para cambio de aceite, mantenimiento, reparación, revisión técnica, personalización, etc.',
      inputSchema: {
        type: 'object',
        properties: {
          customer_id:   { type: 'string', description: 'ID del cliente' },
          moto_plate:    { type: 'string', description: 'Placa de la moto (ej: ABC123)' },
          moto_brand:    { type: 'string', description: 'Marca de la moto (ej: Honda, Yamaha, Suzuki)' },
          moto_model:    { type: 'string', description: 'Modelo (ej: CB190R, FZ25)' },
          moto_year:     { type: 'number', description: 'Año del vehículo' },
          service_type:  {
            type: 'string',
            enum: ['oil_change', 'maintenance', 'repair', 'technical_inspection', 'customization', 'other'],
          },
          description:   { type: 'string', description: 'Descripción del trabajo a realizar' },
          scheduled_at:  { type: 'string', description: 'Fecha y hora agendada ISO 8601' },
          mechanic_id:   { type: 'string', description: 'ID del mecánico asignado (opcional)' },
          estimated_cost: { type: 'number', description: 'Costo estimado en COP' },
        },
        required: ['customer_id', 'moto_plate', 'service_type', 'description'],
      },
    },
    {
      name: 'update_service_order',
      description: 'Actualiza el estado o detalles de una orden de taller. Cuando pasa a "ready" se notifica automáticamente al cliente.',
      inputSchema: {
        type: 'object',
        properties: {
          service_order_id: { type: 'string', description: 'ID de la orden de servicio' },
          status: {
            type: 'string',
            enum: ['scheduled', 'in_progress', 'waiting_parts', 'ready', 'delivered', 'cancelled'],
          },
          mechanic_notes:  { type: 'string', description: 'Notas técnicas del mecánico' },
          parts_used:      {
            type: 'array',
            items: { type: 'object', properties: { sku: { type: 'string' }, qty: { type: 'number' } } },
            description: 'Repuestos utilizados (deduce del inventario)',
          },
          final_cost:      { type: 'number', description: 'Costo final real del servicio' },
        },
        required: ['service_order_id', 'status'],
      },
    },

    // ── INVENTARIO / PRODUCTOS ─────────────────────────────────────────────
    {
      name: 'list_products',
      description: 'Lista motos, repuestos y accesorios con stock. Categorías: motorcycles (motos), helmets (cascos), gear (ropa/equipamiento), parts (repuestos), accessories (accesorios), tools (herramientas), lubricants (lubricantes).',
      inputSchema: {
        type: 'object',
        properties: {
          category:   {
            type: 'string',
            enum: ['motorcycles', 'helmets', 'gear', 'parts', 'accessories', 'tools', 'lubricants'],
          },
          brand:      { type: 'string', description: 'Filtrar por marca (Honda, Yamaha, Suzuki, KTM, etc.)' },
          low_stock:  { type: 'boolean', description: 'Solo productos con stock crítico (< 3 unidades)' },
          search:     { type: 'string', description: 'Buscar por nombre, SKU o referencia' },
          limit:      { type: 'number', default: 50 },
        },
      },
    },
    {
      name: 'update_inventory',
      description: 'Actualiza el stock de una referencia. Registra el movimiento: recepción de mercancía, ajuste de conteo, merma, devolución.',
      inputSchema: {
        type: 'object',
        properties: {
          variant_id: { type: 'string', description: 'ID de la variante o referencia' },
          quantity:   { type: 'number', description: 'Nueva cantidad en stock' },
          reason:     {
            type: 'string',
            enum: ['reception', 'count_adjustment', 'shrinkage', 'return', 'transfer'],
            description: 'Motivo del ajuste',
          },
          notes:      { type: 'string', description: 'Notas adicionales (proveedor, lote, etc.)' },
        },
        required: ['variant_id', 'quantity'],
      },
    },
    {
      name: 'update_product_price',
      description: 'Actualiza el precio de venta y precio comparativo (tachado) de una referencia.',
      inputSchema: {
        type: 'object',
        properties: {
          variant_id:    { type: 'string' },
          price:         { type: 'number', description: 'Precio de venta en COP' },
          compare_price: { type: 'number', description: 'Precio tachado (precio original antes de descuento)' },
        },
        required: ['variant_id', 'price'],
      },
    },

    // ── CLIENTES ───────────────────────────────────────────────────────────
    {
      name: 'list_customers',
      description: 'Lista clientes con su historial de compras, motos registradas y valor de lifetime. Permite buscar por nombre, email, teléfono o placa de moto.',
      inputSchema: {
        type: 'object',
        properties: {
          search: { type: 'string', description: 'Buscar por nombre, email, teléfono o placa de moto' },
          limit:  { type: 'number', default: 20 },
        },
      },
    },
    {
      name: 'get_customer',
      description: 'Perfil completo de un cliente: datos de contacto, motos registradas, historial de compras, órdenes de taller, facturas y notas.',
      inputSchema: {
        type: 'object',
        properties: {
          customer_id: { type: 'string', description: 'ID del cliente' },
        },
        required: ['customer_id'],
      },
    },

    // ── FINANZAS / ZOHO BOOKS ──────────────────────────────────────────────
    {
      name: 'get_revenue_report',
      description: 'Reporte de ingresos desde Zoho Books: ventas totales, facturas emitidas, cartera vencida, pagos recibidos por período.',
      inputSchema: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            enum: ['today', 'this_week', 'this_month', 'last_month', 'this_year'],
            default: 'this_month',
          },
        },
      },
    },

    // ── SOPORTE / ZOHO DESK ────────────────────────────────────────────────
    {
      name: 'list_support_tickets',
      description: 'Lista tickets de soporte al cliente desde Zoho Desk. Incluye consultas sobre motos, garantías, devoluciones y servicio técnico.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['open', 'on_hold', 'pending', 'closed'], default: 'open' },
          limit:  { type: 'number', default: 10 },
        },
      },
    },
    {
      name: 'reply_support_ticket',
      description: 'Responde un ticket de soporte al cliente desde Zoho Desk.',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'string', description: 'ID del ticket en Zoho Desk' },
          message:   { type: 'string', description: 'Respuesta al cliente' },
          is_public: { type: 'boolean', default: true, description: 'true = visible al cliente, false = nota interna' },
        },
        required: ['ticket_id', 'message'],
      },
    },

    // ── MARKETING / CUPONES ────────────────────────────────────────────────
    {
      name: 'create_coupon',
      description: 'Crea un cupón de descuento para campañas de marketing. Puede aplicarse a toda la tienda, a una categoría específica o a motos de una marca.',
      inputSchema: {
        type: 'object',
        properties: {
          code:             { type: 'string', description: 'Código del cupón (ej: MOTO20, VERANO10)' },
          discount_percent: { type: 'number', description: 'Porcentaje de descuento 1–100' },
          applies_to:       {
            type: 'string',
            enum: ['all', 'motorcycles', 'helmets', 'gear', 'parts', 'accessories'],
            default: 'all',
          },
          expires_at:  { type: 'string', description: 'Fecha de expiración ISO 8601 (opcional)' },
          usage_limit: { type: 'number', description: 'Máximo de usos total (opcional)' },
          min_purchase: { type: 'number', description: 'Compra mínima en COP para aplicar (opcional)' },
        },
        required: ['code', 'discount_percent'],
      },
    },
    {
      name: 'get_campaigns_stats',
      description: 'Estadísticas de campañas de email marketing desde Zoho Campaigns: aperturas, clics, conversiones.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 5, description: 'Número de campañas recientes a mostrar' },
        },
      },
    },

    // ── ZOHO CRM ───────────────────────────────────────────────────────────
    {
      name: 'search_crm',
      description: 'Busca clientes y prospectos en Zoho CRM por nombre, email, teléfono o empresa.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Término de búsqueda' },
          module: {
            type: 'string',
            enum: ['Contacts', 'Leads', 'Accounts'],
            default: 'Contacts',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'update_crm_contact',
      description: 'Actualiza datos de un contacto en Zoho CRM (email, teléfono, dirección, notas, estado del lead).',
      inputSchema: {
        type: 'object',
        properties: {
          contact_id: { type: 'string', description: 'ID del contacto en Zoho CRM' },
          fields: {
            type: 'object',
            description: 'Campos a actualizar: { email, phone, city, notes, lead_status, etc. }',
          },
        },
        required: ['contact_id', 'fields'],
      },
    },

    // ── COMUNICACIÓN ───────────────────────────────────────────────────────
    {
      name: 'send_customer_dm',
      description: 'Envía un mensaje directo a un cliente por email o WhatsApp (según preferencia configurada). Útil para avisos de taller, seguimiento de compra o campañas personalizadas.',
      inputSchema: {
        type: 'object',
        properties: {
          customer_id: { type: 'string', description: 'ID del cliente' },
          channel:     { type: 'string', enum: ['email', 'whatsapp'], default: 'email' },
          subject:     { type: 'string', description: 'Asunto (requerido para email)' },
          message:     { type: 'string', description: 'Cuerpo del mensaje' },
        },
        required: ['customer_id', 'message'],
      },
    },

  ],
}));

// ── Tool handlers ─────────────────────────────────────────────────────────────

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {

      // ── DASHBOARD ────────────────────────────────────────────────────────
      case 'get_dashboard': {
        const { data } = await api.get('/admin/dashboard');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // ── ÓRDENES DE VENTA ─────────────────────────────────────────────────
      case 'list_orders': {
        const params = new URLSearchParams();
        if (args.status) params.set('status', args.status);
        if (args.limit)  params.set('limit', String(args.limit));
        if (args.page)   params.set('page', String(args.page));
        const { data } = await api.get(`/admin/orders?${params}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'update_order_status': {
        const { data } = await api.patch(`/admin/orders/${args.order_id}/status`, {
          status:          args.status,
          tracking_number: args.tracking_number,
          notes:           args.notes,
        });
        return { content: [{ type: 'text', text: `Orden actualizada a "${args.status}". ${JSON.stringify(data)}` }] };
      }

      // ── TALLER ───────────────────────────────────────────────────────────
      case 'list_service_orders': {
        const params = new URLSearchParams();
        if (args.status)      params.set('status', args.status);
        if (args.mechanic_id) params.set('mechanic_id', args.mechanic_id);
        if (args.limit)       params.set('limit', String(args.limit));
        if (args.page)        params.set('page', String(args.page));
        const { data } = await api.get(`/admin/service-orders?${params}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'create_service_order': {
        const { data } = await api.post('/admin/service-orders', {
          customer_id:    args.customer_id,
          moto_plate:     args.moto_plate,
          moto_brand:     args.moto_brand,
          moto_model:     args.moto_model,
          moto_year:      args.moto_year,
          service_type:   args.service_type,
          description:    args.description,
          scheduled_at:   args.scheduled_at,
          mechanic_id:    args.mechanic_id,
          estimated_cost: args.estimated_cost,
        });
        return { content: [{ type: 'text', text: `Orden de servicio creada. ID: ${data.id} | Orden: ${data.service_number}` }] };
      }

      case 'update_service_order': {
        const { data } = await api.patch(`/admin/service-orders/${args.service_order_id}`, {
          status:         args.status,
          mechanic_notes: args.mechanic_notes,
          parts_used:     args.parts_used,
          final_cost:     args.final_cost,
        });
        return { content: [{ type: 'text', text: `Orden de servicio actualizada a "${args.status}". ${JSON.stringify(data)}` }] };
      }

      // ── INVENTARIO ───────────────────────────────────────────────────────
      case 'list_products': {
        const params = new URLSearchParams();
        if (args.category) params.set('category', args.category);
        if (args.brand)    params.set('brand', args.brand);
        if (args.search)   params.set('search', args.search);
        if (args.limit)    params.set('limit', String(args.limit));
        const { data } = await api.get(`/admin/products?${params}`);
        const products = args.low_stock
          ? (data.products || data).filter((p) => (p.total_stock ?? p.stock ?? 0) < 3)
          : (data.products || data);
        return { content: [{ type: 'text', text: JSON.stringify({ products, total: products?.length }, null, 2) }] };
      }

      case 'update_inventory': {
        const { data } = await api.patch(`/admin/products/variants/${args.variant_id}/inventory`, {
          quantity: args.quantity,
          reason:   args.reason || 'count_adjustment',
          notes:    args.notes,
        });
        return { content: [{ type: 'text', text: `Stock actualizado a ${args.quantity} unidades. ${JSON.stringify(data)}` }] };
      }

      case 'update_product_price': {
        const { data } = await api.patch(`/admin/products/variants/${args.variant_id}/price`, {
          price:         args.price,
          compare_price: args.compare_price,
        });
        return { content: [{ type: 'text', text: `Precio actualizado a $${args.price.toLocaleString('es-CO')} COP. ${JSON.stringify(data)}` }] };
      }

      // ── CLIENTES ─────────────────────────────────────────────────────────
      case 'list_customers': {
        const params = new URLSearchParams();
        if (args.search) params.set('search', args.search);
        if (args.limit)  params.set('limit', String(args.limit));
        const { data } = await api.get(`/admin/customers?${params}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'get_customer': {
        const { data } = await api.get(`/admin/customers/${args.customer_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // ── FINANZAS ─────────────────────────────────────────────────────────
      case 'get_revenue_report': {
        const { data } = await api.get(`/admin/zoho/revenue?period=${args.period || 'this_month'}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // ── SOPORTE ──────────────────────────────────────────────────────────
      case 'list_support_tickets': {
        const { data } = await api.get(
          `/admin/support/tickets?status=${args.status || 'open'}&limit=${args.limit || 10}`
        );
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'reply_support_ticket': {
        const { data } = await api.post(`/admin/support/tickets/${args.ticket_id}/reply`, {
          message:   args.message,
          is_public: args.is_public !== false,
        });
        return { content: [{ type: 'text', text: `Respuesta enviada al ticket ${args.ticket_id}. ${JSON.stringify(data)}` }] };
      }

      // ── CUPONES ──────────────────────────────────────────────────────────
      case 'create_coupon': {
        const { Pool } = require('pg');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const result = await pool.query(
          `INSERT INTO coupons (code, discount_percent, applies_to, expires_at, usage_limit, min_purchase, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *`,
          [
            args.code.toUpperCase(),
            args.discount_percent,
            args.applies_to || 'all',
            args.expires_at  || null,
            args.usage_limit || null,
            args.min_purchase || null,
          ]
        );
        await pool.end();
        return {
          content: [{
            type: 'text',
            text: `Cupón "${args.code.toUpperCase()}" creado: ${args.discount_percent}% de descuento${args.applies_to && args.applies_to !== 'all' ? ` en categoría "${args.applies_to}"` : ''}.`,
          }],
        };
      }

      // ── CAMPAÑAS ─────────────────────────────────────────────────────────
      case 'get_campaigns_stats': {
        const { data } = await api.get(`/admin/zoho/campaigns?limit=${args.limit || 5}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // ── ZOHO CRM ─────────────────────────────────────────────────────────
      case 'search_crm': {
        const { data } = await api.get(
          `/admin/zoho/crm/search?q=${encodeURIComponent(args.query)}&module=${args.module || 'Contacts'}`
        );
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'update_crm_contact': {
        const { data } = await api.patch(`/admin/zoho/crm/contacts/${args.contact_id}`, args.fields);
        return { content: [{ type: 'text', text: `Contacto ${args.contact_id} actualizado. ${JSON.stringify(data)}` }] };
      }

      // ── COMUNICACIÓN ─────────────────────────────────────────────────────
      case 'send_customer_dm': {
        const { data } = await api.post('/admin/customers/dm', {
          customer_id: args.customer_id,
          channel:     args.channel || 'email',
          subject:     args.subject,
          message:     args.message,
        });
        return { content: [{ type: 'text', text: `Mensaje enviado al cliente ${args.customer_id} por ${args.channel || 'email'}. ${JSON.stringify(data)}` }] };
      }

      default:
        return { content: [{ type: 'text', text: `Herramienta desconocida: ${name}` }], isError: true };
    }
  } catch (err) {
    const msg = err.response?.data?.error || err.message;
    return { content: [{ type: 'text', text: `Error en ${name}: ${msg}` }], isError: true };
  }
});

// ── Boot ──────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Mocana Motors MCP Server iniciado');
}

main().catch(console.error);
