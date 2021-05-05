const { DattoRMMClient } = require("./datto-rmm");

const { DRMM_API_URL, DRMM_API_KEY, DRMM_API_SECRET_KEY } = process.env;

async function pollForCriticalAlerts() {
    const client = new DattoRMMClient(
        DRMM_API_URL,
        DRMM_API_KEY,
        DRMM_API_SECRET_KEY
    );

    const alerts = await client.getCriticalAlerts();
    if (alerts.length) {
        debug(`${alerts.length} critical alert(s) found`);
        gpio.startBlink();
    } else {
        debug("no critical alerts found");
        gpio.stopBlink();
    }
}

module.exports = {
    pollForCriticalAlerts,
};
