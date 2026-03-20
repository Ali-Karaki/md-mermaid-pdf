'use strict';

const https = require('https');
const { URL } = require('url');

/**
 * Preflight check: can we fetch the CDN URL?
 * @param {string} url - Mermaid CDN URL
 * @param {{ timeout?: number }} [options] - timeout in ms (default 5000)
 * @returns {Promise<boolean>}
 */
function cdnPreflight(url, options = {}) {
	const timeout = options.timeout ?? 5000;
	return new Promise((resolve) => {
		const parsed = new URL(url);
		const req = https.get(
			url,
			{
				headers: { 'User-Agent': 'md-mermaid-pdf/1.0' },
				timeout,
			},
			(res) => {
				res.destroy();
				resolve(res.statusCode >= 200 && res.statusCode < 400);
			},
		);
		req.on('error', () => resolve(false));
		req.on('timeout', () => {
			req.destroy();
			resolve(false);
		});
		req.setTimeout(timeout);
	});
}

module.exports = { cdnPreflight };
