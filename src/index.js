const { DattoRMMClient } = require('./datto-rmm.js');
const gpio = require('./gpio.js');

const POLL_INTERVAL = 60 * 1000;

const {
    DRMM_API_URL,
    DRMM_API_KEY,
    DRMM_API_SECRET_KEY,
} = process.env;

const client = new DattoRMMClient(DRMM_API_URL, DRMM_API_KEY, DRMM_API_SECRET_KEY);

async function pollForCriticalAlerts() {
    const alerts = await client.getCriticalAlerts();
    if (alerts.length) {
        gpio.startBlink();
    } else {
        gpio.stopBlink();
    }
}

function exit() {
    console.log('exiting :(');
    gpio.stopBlink();
    process.exit();
}

pollForCriticalAlerts();
setInterval(pollForCriticalAlerts, POLL_INTERVAL);
process.on('SIGINT', exit);
