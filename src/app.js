const debug = require("debug")("app");
const gpio = require("./gpio");
const { pollForCriticalAlerts } = require("./alerts");

async function pollLoop() {
    try {
        await pollForCriticalAlerts();
    } catch (err) {
        console.error(err);
        exit();
    }
}

const POLL_INTERVAL = 60 * 1000;
const pollToken = setInterval(pollLoop, POLL_INTERVAL);
pollLoop();

function exit() {
    debug("exiting");
    clearInterval(pollToken);
    gpio.close();
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);
