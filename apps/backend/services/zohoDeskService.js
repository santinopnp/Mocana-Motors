const { zohoRequest } = require('./zohoService');

const ORG = () => process.env.ZOHO_DESK_ORG_ID;

async function listTickets(status = 'open', limit = 10) {
  return zohoRequest('GET', `/desk/v1/tickets?orgId=${ORG()}&status=${status}&limit=${limit}`);
}

async function replyTicket(ticketId, message, isPublic = true) {
  return zohoRequest('POST', `/desk/v1/tickets/${ticketId}/sendReply?orgId=${ORG()}`, {
    content:  message,
    isPublic: isPublic,
    channel:  'EMAIL',
  });
}

async function createTicket({ contactId, subject, description, departmentId }) {
  return zohoRequest('POST', `/desk/v1/tickets?orgId=${ORG()}`, {
    contactId,
    subject,
    description,
    departmentId,
    channel: 'WEB',
  });
}

module.exports = { listTickets, replyTicket, createTicket };
