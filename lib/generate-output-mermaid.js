'use strict';

/**
 * md-to-pdf generateOutput with: after scripts, await mermaid.run() before pdf.
 */

const path = require('path');
const { mdToPdfLib } = require('./paths');
const { isHttpUrl } = require(mdToPdfLib('is-http-url.js'));

/**
 * @param {string} html
 * @param {string} relativePath
 * @param {import('md-to-pdf/dist/lib/config').Config} config
 * @param {import('puppeteer').Browser} browserRef
 */
async function generateOutput(html, relativePath, config, browserRef) {
	if (!browserRef) {
		throw new Error('md-mermaid-pdf: browser instance is required');
	}

	const page = await browserRef.newPage();
	const mermaidRenderTimeoutMs = config.mermaidRenderTimeoutMs ?? 30000;
	page.setDefaultTimeout(mermaidRenderTimeoutMs);

	const urlPathname = path
		.join(relativePath, 'index.html')
		.split(path.sep)
		.join(path.posix.sep);

	await page.goto(`http://localhost:${config.port}/${urlPathname}`);
	await page.setContent(html);

	for (const stylesheet of config.stylesheet) {
		await page.addStyleTag(isHttpUrl(stylesheet) ? { url: stylesheet } : { path: stylesheet });
	}
	if (config.css) {
		await page.addStyleTag({ content: config.css });
	}
	for (const scriptTagOptions of config.script) {
		await page.addScriptTag(scriptTagOptions);
	}

	await page.evaluate(async () => {
		const m = globalThis.mermaid;
		if (!m) return;
		m.initialize({
			startOnLoad: false,
			theme: 'neutral',
			securityLevel: 'loose',
		});
		await m.run();
	});

	const mermaidWaitUntil = config.mermaidWaitUntil ?? 'networkidle0';
	await Promise.all([
		page.waitForNavigation({ waitUntil: mermaidWaitUntil }),
		page.evaluate(() => history.pushState(undefined, '', '#')),
	]);

	let outputFileContent = '';
	if (config.devtools) {
		await new Promise((resolve) => page.on('close', resolve));
	} else if (config.as_html) {
		outputFileContent = await page.content();
	} else {
		await page.emulateMediaType(config.page_media_type);
		outputFileContent = await page.pdf(config.pdf_options);
	}
	await page.close();
	return config.devtools ? undefined : { filename: config.dest, content: outputFileContent };
}

module.exports = { generateOutput };
