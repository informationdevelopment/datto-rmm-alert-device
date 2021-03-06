const debug = require("debug")("app:alerts");
const { DattoRMMClient } = require("./datto-rmm");
const gpio = require("./gpio");
const { readStore, writeStore } = require("./persistence");
const { playAlertSound } = require("./speaker");

const { DRMM_API_URL, DRMM_API_KEY, DRMM_API_SECRET_KEY } = process.env;
let alerts = [];
let store = readStore();
let alerting = false;

function startAlert() {
    if (alerting) return;

    alerting = true;
    gpio.startBlink();
    playAlertSound();
}

function stopAlert() {
    alerting = false;
    gpio.stopBlink();
}

async function pollForCriticalAlerts() {
    const client = new DattoRMMClient(
        DRMM_API_URL,
        DRMM_API_KEY,
        DRMM_API_SECRET_KEY
    );

    alerts = (await client.getCriticalAlerts()).map((alert) => alert.alertUid);
    const unignoredAlerts = alerts.some(
        (uid) => !store.ignoredAlerts.includes(uid)
    );

    debug(`${alerts.length} critical alert(s) found`);

    if (unignoredAlerts) {
        startAlert();
    } else {
        stopAlert();
    }

    store.ignoredAlerts = store.ignoredAlerts.filter((uid) =>
        alerts.includes(uid)
    );
    writeStore(store);
}

function ignoreCurrentAlerts() {
    stopAlert();
    store.ignoredAlerts = [...alerts];
    writeStore(store);
}

gpio.addButtonHandler(ignoreCurrentAlerts);

module.exports = {
    pollForCriticalAlerts,
};
