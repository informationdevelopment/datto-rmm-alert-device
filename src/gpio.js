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
}

rpio.init({ mapping: 'gpio' });
rpio.write(LED_PIN, rpio.OUTPUT, rpio.LOW);

process.on('SIGINT', () => {
    stopBlink();
    rpio.write(LED_PIN, rpio.LOW);
});

module.exports = {
    startBlink,
    stopBlink,
};
