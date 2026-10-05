# Mocana Motors MCP Server

Servidor MCP que permite a Claude gestionar integralmente la operación de Mocana Motors desde una sola interfaz.

## Herramientas disponibles

| Herramienta | Descripción |
|---|---|
| `get_dashboard` | Resumen del negocio: ventas del día/mes, órdenes pendientes, alertas de inventario |
| `list_orders` | Lista órdenes de venta con filtros por estado y fecha |
| `update_order_status` | Actualiza estado de una orden (confirmar, enviar, entregar, cancelar) |
| `list_service_orders` | Lista órdenes de taller (servicios, reparaciones) |
| `update_service_order` | Actualiza estado de una orden de servicio |
| `create_service_order` | Crea una nueva orden de servicio en el taller |
| `list_products` | Lista motos, repuestos y accesorios con stock actual |
| `update_inventory` | Actualiza stock de un producto/referencia |
| `update_product_price` | Actualiza precio de una referencia |
| `list_customers` | Lista clientes con historial y valor de vida |
| `get_customer` | Perfil completo de un cliente: compras, motos, servicios |
| `get_revenue_report` | Ingresos desde Zoho Books: ventas, facturas, cartera |
| `list_support_tickets` | Tickets de soporte pendientes desde Zoho Desk |
| `reply_support_ticket` | Responde un ticket de soporte |
| `create_coupon` | Crea cupón de descuento para campañas |
| `get_campaigns_stats` | Estadísticas de campañas de email marketing |
| `search_crm` | Busca clientes/prospectos en Zoho CRM |
| `update_crm_contact` | Actualiza datos de un contacto en Zoho CRM |
| `send_customer_dm` | Envía mensaje directo a un cliente |

## Configuración

### Variables de entorno

```bash
MOCANA_API_URL=https://api.mocanamotors.com  # o http://localhost:3000 en dev
MOCANA_ADMIN_TOKEN=tu_token_admin_aqui
```

### Agregar a Claude Desktop / claude.ai

```json
{
  "mcpServers": {
    "mocana-motors": {
      "command": "node",
      "args": ["/ruta/a/mocana-motors/mcp-server/index.js"],
      "env": {
        "MOCANA_API_URL": "https://api.mocanamotors.com",
        "MOCANA_ADMIN_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```
