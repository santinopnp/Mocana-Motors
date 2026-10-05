# Mocana Motors 🏍️

Plataforma de e-commerce y gestión para tienda de motocicletas y accesorios para motociclistas.

## Stack

- **Backend**: Node.js + Express + PostgreSQL + Redis + BullMQ
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **IA**: Asistente Moto (Claude API) — asesoría de motos, accesorios y soporte técnico
- **ERP**: Zoho CRM + Books + Desk + Campaigns
- **Pagos**: Stripe + Wompi (Colombia)
- **MCP Server**: Herramientas Claude para gestión integral del negocio

## Estructura

```
mocana-motors/
├── apps/
│   ├── backend/          # API Express
│   └── web/              # Tienda React
├── mcp-server/           # Claude MCP tools
├── docker-compose.yml
└── .env.example
```

## Inicio rápido

```bash
# Clonar y configurar variables
cp .env.example .env
# Editar .env con tus credenciales

# Levantar todo con Docker
docker-compose up

# O en desarrollo local
cd apps/backend && npm install && npm run dev
cd apps/web && npm install && npm run dev
```

## MCP Server

Ver `mcp-server/README.md` para configurar el servidor MCP de Claude.

## Licencia

Privado — Mocana Motors © 2024
