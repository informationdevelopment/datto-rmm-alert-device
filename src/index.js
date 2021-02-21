const {
    DRMM_API_URL,
    DRMM_API_KEY,
    DRMM_API_SECRET_KEY,
} = process.env;

const { DattoRMMClient } = require('./datto-rmm.js');
const client = new DattoRMMClient(DRMM_API_URL, DRMM_API_KEY, DRMM_API_SECRET_KEY);
client.getOpenAlerts().then(result => console.log(result));
