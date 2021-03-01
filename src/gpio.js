const debug = require('debug')('app:gpio');
const rpio = require('rpio');

const LED_PIN = parseInt(process.env.LED_PIN);
const LED_OFF = rpio.HIGH;

const BLINK_SPEED = 500;
let blinkTimeout, blinkCounter = 0;

function startBlink() {
    debug('starting blinking');
    blinkTimeout = setInterval(() => rpio.write(LED_PIN, ++blinkCounter % 2), BLINK_SPEED);
}

function stopBlink() {
    debug('stopping blinking');
    clearTimeout(blinkTimeout);
    rpio.write(LED_PIN, LED_OFF);
}

rpio.init({ mapping: 'gpio' });
rpio.open(LED_PIN, rpio.OUTPUT, LED_OFF);

module.exports = {
    startBlink,
    stopBlink,
};
