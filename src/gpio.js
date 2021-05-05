const debug = require("debug")("app:gpio");
const rpio = require("rpio");

const LED_PIN = parseInt(process.env.LED_PIN);
const LED_OFF = rpio.HIGH;
const LED_ON = rpio.LOW;

const BLINK_SPEED = 500;
let blinkTimeout = null;
let blinkState = LED_OFF;
let closing = false;

function blink() {
    if (blinkState === LED_OFF) blinkState = LED_ON;
    else blinkState = LED_OFF;

    rpio.write(LED_PIN, blinkState);
}

function startBlink() {
    if (blinkTimeout !== null || closing) return;

    debug("starting blinking");
    blinkTimeout = setInterval(blink, BLINK_SPEED);
}

function stopBlink() {
    if (blinkTimeout === null || closing) return;

    debug("stopping blinking");
    clearTimeout(blinkTimeout);
    blinkState = LED_OFF;
    blinkTimeout = null;
    rpio.write(LED_PIN, LED_OFF);
}

function close() {
    closing = true;
    stopBlink();
}

rpio.init({ mapping: "gpio" });
rpio.open(LED_PIN, rpio.OUTPUT, LED_OFF);

module.exports = {
    startBlink,
    stopBlink,
    close,
};
