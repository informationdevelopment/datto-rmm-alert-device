const debug = require("debug")("app:speaker");
const { exec } = require("child_process");

function playAlertSound() {
    const audioPath = path.join(__dirname, "../alarms/alarm-1.mp3");
    exec(`omxplayer ${audioPath}`);
}

module.exports = {
    playAlertSound,
};
