const { zohoRequest } = require('./zohoService');

async function getCampaignStats(limit = 5) {
  return zohoRequest('GET', `/campaigns/v1.1/getcampaigns?resfmt=JSON&range=${limit}&status=Sent`);
}

async function addSubscriber(email, firstName, lastName) {
  const listKey = process.env.ZOHO_CAMPAIGNS_LIST_KEY;
  if (!listKey) return null;
  return zohoRequest('POST', `/campaigns/v1.1/json/listsubscribe`, {
    resfmt:      'JSON',
    listkey:     listKey,
    contactinfo: JSON.stringify({ 'Contact Email': email, 'First Name': firstName, 'Last Name': lastName }),
  });
}

module.exports = { getCampaignStats, addSubscriber };
