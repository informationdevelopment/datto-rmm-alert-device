const debug = require("debug")("app:gpio");
const rpio = require("rpio");

const LED_PIN = parseInt(process.env.LED_PIN);
const LED_OFF = rpio.HIGH;
const LED_ON = rpio.LOW;

const BLINK_SPEED = 500;
let blinkTimeout = null;
let blinkState = LED_OFF;

function startBlink() {
    if (blinkTimeout !== null) return;

    debug("starting blinking");
    blinkTimeout = setInterval(() => {
        if (blinkState === LED_OFF) blinkState = LED_ON;
        else blinkState = LED_OFF;

        rpio.write(LED_PIN, blinkState);
    }, BLINK_SPEED);
}

function stopBlink() {
    if (blinkTimeout === null) return;

    debug("stopping blinking");
    clearTimeout(blinkTimeout);
    blinkState = LED_OFF;
    blinkTimeout = null;
    rpio.write(LED_PIN, LED_OFF);
}

rpio.init({ mapping: "gpio" });
rpio.open(LED_PIN, rpio.OUTPUT, LED_OFF);

module.exports = {
    startBlink,
    stopBlink,
};
