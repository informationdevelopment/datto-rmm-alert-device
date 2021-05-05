const debug = require("debug")("app");
const gpio = require("./gpio");
const { pollForCriticalAlerts } = require("./alerts");

const POLL_INTERVAL = 60 * 1000;

pollForCriticalAlerts();
const pollToken = setInterval(pollForCriticalAlerts, POLL_INTERVAL);

function exit() {
    debug("exiting");
    clearInterval(pollToken);
    gpio.close();
}

process.on("SIGINT", exit);
