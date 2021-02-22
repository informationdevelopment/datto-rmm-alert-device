const debug = require('debug')('app:gpio');
const rpio = require('rpio');

const LED_PIN = parseInt(process.env.LED_PIN);

const BLINK_SPEED = 500;
let blinkTimeout, blinkCounter = 0;

function startBlink() {
    debug('starting blinking');
    blinkTimeout = setInterval(() => rpio.write(LED_PIN, ++blinkCounter % 2), BLINK_SPEED);
}

function stopBlink() {
    debug('stopping blinking');
    clearTimeout(blinkTimeout);
    rpio.write(LED_PIN, rpio.LOW);
}

rpio.init({ mapping: 'gpio' });
rpio.open(LED_PIN, rpio.OUTPUT, rpio.LOW);

module.exports = {
    startBlink,
    stopBlink,
};
