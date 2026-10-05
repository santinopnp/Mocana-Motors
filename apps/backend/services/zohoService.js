const axios  = require('axios');
const logger = require('../utils/logger');

let accessToken     = null;
let tokenExpiresAt  = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt - 60000) return accessToken;

  const { data } = await axios.post(
    `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
    new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      client_id:     process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type:    'refresh_token',
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  accessToken    = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  logger.info('Zoho token renovado');
  return accessToken;
}

async function zohoRequest(method, path, payload) {
  const token = await getAccessToken();
  const { data } = await axios({
    method,
    url: `${process.env.ZOHO_API_DOMAIN}${path}`,
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    data: payload,
  });
  return data;
}

module.exports = { zohoRequest };
