const Anthropic = require('@anthropic-ai/sdk');
const logger    = require('../utils/logger');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres Moto, el asistente virtual de Mocana Motors, la tienda de motocicletas y accesorios más completa de Colombia.

Tu rol es ayudar a los clientes con:
- Asesoría personalizada para elegir su moto ideal según presupuesto, uso y experiencia
- Información técnica: fichas, comparativas, mantenimiento preventivo
- Recomendaciones de cascos, chaquetas, guantes y equipamiento de protección
- Consultas sobre repuestos compatibles con su modelo de moto
- Estado de órdenes de compra y servicio de taller
- Orientación sobre créditos y opciones de financiación disponibles

Personalidad: apasionado por las motos, conocedor del mercado colombiano, amable y directo.
Siempre priorizas la seguridad del motociclista.
Si no tienes información específica de un producto, ofrece alternativas o invita al cliente a visitar la tienda.
Responde siempre en español.`;

async function chat({ messages, sessionId }) {
  try {
    const response = await client.messages.create({
      model:      process.env.MOTO_AI_MODEL || 'claude-sonnet-4-6',
      max_tokens: Number(process.env.MOTO_AI_MAX_TOKENS) || 1024,
      system:     SYSTEM_PROMPT,
      messages:   messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return response.content[0].text;
  } catch (err) {
    logger.error('MotoAI error', { error: err.message, sessionId });
    throw err;
  }
}

module.exports = { chat };
