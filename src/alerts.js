const debug = require("debug")("app:alerts");
const { DattoRMMClient } = require("./datto-rmm");
const gpio = require("./gpio");
const { readStore, writeStore } = require("./persistence");
const { playAlertSound } = require("./speaker");

const { DRMM_API_URL, DRMM_API_KEY, DRMM_API_SECRET_KEY } = process.env;
let alerts = [];
let store = readStore();

async function pollForCriticalAlerts() {
    const client = new DattoRMMClient(
        DRMM_API_URL,
        DRMM_API_KEY,
        DRMM_API_SECRET_KEY
    );

    const previousAlertCount = alerts.length;
    alerts = (await client.getCriticalAlerts()).map((alert) => alert.alertUid);

    if (alerts.length > 0) {
        debug(`${alerts.length} critical alert(s) found`);

        if (previousAlertCount === 0) {
            gpio.startBlink();
            playAlertSound();
        }
    } else {
        debug("no critical alerts found");
        gpio.stopBlink();
    }

    store.ignoredAlerts = store.ignoredAlerts.filter((uid) =>
        alerts.includes(uid)
    );
    writeStore(store);
}

function ignoreCurrentAlerts() {
    store.ignoredAlerts = [...alerts];
    writeStore(store);
}

gpio.addButtonHandler(ignoreCurrentAlerts);

module.exports = {
    pollForCriticalAlerts,
};
