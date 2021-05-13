const debug = require("debug")("app:gpio");
const rpio = require("rpio");

const LED_PIN = parseInt(process.env.LED_PIN);
const LED_OFF = rpio.HIGH;
const LED_ON = rpio.LOW;

const BUTTON_PIN = parseInt(process.env.BUTTON_PIN);
const buttonHandlers = new Set();

const BLINK_SPEED = 500;
let blinkToken = null;
let blinkState = LED_OFF;
let closing = false;

function blink() {
    if (blinkState === LED_OFF) blinkState = LED_ON;
    else blinkState = LED_OFF;

    rpio.write(LED_PIN, blinkState);
}

function startBlink() {
    if (blinkToken !== null || closing) return;

    debug("starting blinking");
    blinkToken = setInterval(blink, BLINK_SPEED);
}

function stopBlink() {
    if (blinkToken === null) return;

    debug("stopping blinking");
    clearInterval(blinkToken);
    rpio.write(LED_PIN, LED_OFF);
    blinkState = LED_OFF;
    blinkToken = null;
}

function buttonPressed() {
    rpio.msleep(20);
    if (rpio.read(BUTTON_PIN) === rpio.LOW) return;

    debug("button pressed");
    for (const handler of buttonHandlers) {
        handler();
    }
}

function addButtonHandler(handler) {
    buttonHandlers.add(handler);
}

function removeButtonHandler(handler) {
    buttonHandlers.delete(handler);
}

function close() {
    closing = true;
    stopBlink();
    rpio.poll(BUTTON_PIN, null);
    buttonHandlers.clear();
}

rpio.init({ mapping: "gpio" });
rpio.open(LED_PIN, rpio.OUTPUT, LED_OFF);
rpio.open(BUTTON_PIN, rpio.INPUT, rpio.PULL_DOWN);
rpio.poll(BUTTON_PIN, buttonPressed, rpio.POLL_HIGH);

module.exports = {
    startBlink,
    stopBlink,
    addButtonHandler,
    removeButtonHandler,
    close,
};
