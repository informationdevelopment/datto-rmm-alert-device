const debug = require('debug')('app:datto-rmm');
const fetch = require('node-fetch');

class DattoRMMClient {
    #accessToken;

    constructor(url, key, secretKey) {
        debug('initializing Datto RMM client');

        this.url = url;
        this.username = key;
        this.password = secretKey;
    }

    async #getAccessToken() {
        debug('obtaining new access token');

        const encodedCredential = Buffer.from('public-client:public', 'utf-8').toString('base64');
        const body = new URLSearchParams({
            grant_type: 'password',
            username: this.username,
            password: this.password,
        });

        const res = await fetch(`${this.url}/auth/oauth/token`, {
            method: 'POST',
            headers: { Authorization: `Basic ${encodedCredential}` },
            body,
        });
        return (await res.json()).access_token;
    }

    async #makeAuthRequest(endpoint) {
        const sendRequest = () => {
            const url = `${this.url}/api${endpoint}`;
            debug(`sending authenticated request to ${url}`);
            return fetch(url, {
                headers: { Authorization: `Bearer ${this.#accessToken}` },
            });
        };

        let response;
        for (let i = 0; i < 2; i++) {
            if (!this.#accessToken || i > 0) {
                this.#accessToken = await this.#getAccessToken();
            }

            response = await sendRequest();
            if (response.status != 401) return response;
            debug('401 Unauthorized: token expired.');
        }

        return response;
    }

    async getCriticalAlerts() {
        debug('getting critical alerts');

        const res = await this.#makeAuthRequest('/v2/account/alerts/open?muted=false');
        const data = await res.json();
        return data.alerts.filter(alert => alert.priority.toLowerCase() == 'critical');
    }
}

module.exports = { DattoRMMClient };
