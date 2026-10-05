const nodemailer = require('nodemailer');
const logger     = require('../utils/logger');

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

async function send({ to, subject, html }) {
  try {
    await getTransporter().sendMail({
      from:    `"${process.env.EMAIL_FROM_NAME || 'Mocana Motors'}" <${process.env.EMAIL_FROM || 'noreply@mocanamotors.com'}>`,
      to, subject, html,
    });
  } catch (err) {
    logger.error('Error enviando email', { to, subject, error: err.message });
  }
}

async function sendOrderShipped({ email, orderNumber, trackingNumber }) {
  await send({
    to: email,
    subject: `Tu pedido ${orderNumber} fue enviado 🏍️`,
    html: `<p>¡Tu pedido <strong>${orderNumber}</strong> está en camino!</p>
           <p>Número de guía: <strong>${trackingNumber}</strong></p>
           <p>Gracias por comprar en <strong>Mocana Motors</strong>.</p>`,
  });
}

async function sendServiceConfirmation({ email, serviceNumber, serviceType, scheduledAt, motoPlate }) {
  await send({
    to: email,
    subject: `Orden de servicio confirmada: ${serviceNumber}`,
    html: `<p>Tu orden de servicio <strong>${serviceNumber}</strong> ha sido confirmada.</p>
           <p>Moto: <strong>${motoPlate}</strong> | Servicio: <strong>${serviceType}</strong></p>
           ${scheduledAt ? `<p>Fecha agendada: <strong>${new Date(scheduledAt).toLocaleString('es-CO')}</strong></p>` : ''}
           <p>Mocana Motors — Taller</p>`,
  });
}

async function sendServiceReady({ email, serviceNumber, motoPlate }) {
  await send({
    to: email,
    subject: `Tu moto está lista: ${serviceNumber} 🏍️✅`,
    html: `<p>¡Tu moto <strong>${motoPlate}</strong> está lista para recoger!</p>
           <p>Orden de servicio: <strong>${serviceNumber}</strong></p>
           <p>Pasa por el taller en horario de atención.</p>
           <p>Mocana Motors — Taller</p>`,
  });
}

async function sendWelcome({ email, firstName }) {
  await send({
    to: email,
    subject: '¡Bienvenido a Mocana Motors! 🏍️',
    html: `<p>Hola <strong>${firstName}</strong>, gracias por registrarte en Mocana Motors.</p>
           <p>Encuentra las mejores motos y accesorios en nuestra tienda.</p>`,
  });
}

module.exports = { send, sendOrderShipped, sendServiceConfirmation, sendServiceReady, sendWelcome };
