const { zohoRequest } = require('./zohoService');

async function searchContacts(query, module = 'Contacts') {
  return zohoRequest('GET', `/crm/v7/${module}/search?word=${encodeURIComponent(query)}&per_page=10`);
}

async function createContact(user) {
  return zohoRequest('POST', '/crm/v7/Contacts', {
    data: [{
      First_Name:  user.first_name,
      Last_Name:   user.last_name || '-',
      Email:       user.email,
      Phone:       user.phone,
      Lead_Source: 'Mocana Motors Web',
    }],
  });
}

async function updateContact(contactId, fields) {
  return zohoRequest('PUT', `/crm/v7/Contacts/${contactId}`, { data: [fields] });
}

module.exports = { searchContacts, createContact, updateContact };
