const fetch = require('node-fetch');

class DattoRMMClient {
    #accessToken;

    constructor(url, key, secretKey) {
        this.url = url;
        this.username = key;
        this.password = secretKey;
    }

    async #getAccessToken() {
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

    async getOpenAlerts() {
        if (!this.#accessToken) {
            this.#accessToken = await this.#getAccessToken();
        }

        const res = await fetch(`${this.url}/api/v2/account/alerts/open?muted=false`, {
            headers: { Authorization: `Bearer ${this.#accessToken}` },
        });
        const data = await res.json();
        return data;
    }
}

module.exports = { DattoRMMClient };
