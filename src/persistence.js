const fs = require("fs");
const path = require("path");
const debug = require("debug")("app:persistence");

const STORE_PATH = "/var/opt/datto-rmm-alert-device/store.json";

function readStore() {
    debug("reading store");

    if (!fs.existsSync(STORE_PATH)) return { ignoredAlerts: [] };
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
}

function writeStore(data) {
    debug("writing store");

    const dirname = path.dirname(STORE_PATH);

    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(STORE_PATH, JSON.stringify(data), "utf8");
}

module.exports = {
    readStore,
    writeStore,
};
