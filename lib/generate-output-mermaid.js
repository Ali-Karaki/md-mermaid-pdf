'use strict';

/**
 * md-to-pdf generateOutput with: after scripts, await mermaid.run() before pdf.
 */

const fs = require('fs');
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


	const mermaidConfig = config.mermaidConfig ?? {};
	const mermaidResult = await page.evaluate(
		async (userConfig) => {
			const m = globalThis.mermaid;
			if (!m) return { error: null, count: 0 };
			m.initialize({
				startOnLoad: false,
				theme: 'neutral',
				securityLevel: 'loose',
				...userConfig,
			});
			const nodes = document.querySelectorAll('.mermaid');
			try {
				await m.run();
				return { error: null, count: nodes.length };
			} catch (err) {
				return {
					error: err?.message ?? String(err),
					count: nodes.length,
				};
			}
		},
		mermaidConfig,
	);

	const onMermaidError = config.onMermaidError;
	if (mermaidResult?.error) {
		const msg = mermaidResult.count > 1
			? `Mermaid parse error (one of ${mermaidResult.count} diagrams): ${mermaidResult.error}`
			: `Mermaid parse error: ${mermaidResult.error}`;
		if (typeof onMermaidError === 'function') {
			const action = await onMermaidError(new Error(mermaidResult.error), { diagramCount: mermaidResult.count });
			if (action === 'skip') {
				/* continue */
			} else {
				throw new Error(msg);
			}
		} else if (config.failOnMermaidError) {
			throw new Error(msg);
		}
	}

	if (config.debug && mermaidResult?.error) {
		console.error('[md-mermaid-pdf] Mermaid error:', mermaidResult.error);
	}

	const mermaidWaitUntil = config.mermaidWaitUntil ?? 'networkidle0';
	await Promise.all([
		page.waitForNavigation({ waitUntil: mermaidWaitUntil }),
		page.evaluate(() => history.pushState(undefined, '', '#')),
	]);

const exportOpts =
		typeof config.mermaidExportImages === 'string'
			? { dir: config.mermaidExportImages, format: 'png' }
			: config.mermaidExportImages;
	if (exportOpts?.dir) {
		const outDir = path.isAbsolute(exportOpts.dir)
			? exportOpts.dir
			: path.resolve(config.basedir || process.cwd(), exportOpts.dir);
		fs.mkdirSync(outDir, { recursive: true });
		const format = exportOpts.format === 'svg' ? 'svg' : 'png';
		const handles = await page.$$('.mermaid');
		for (let i = 0; i < handles.length; i++) {
			const name = `mermaid-${i}.${format}`;
			const filepath = path.join(outDir, name);
			if (format === 'svg') {
				const svg = await handles[i].evaluate((el) => {
					const svgEl = el.querySelector('svg');
					return svgEl ? svgEl.outerHTML : '';
				});
				if (svg) fs.writeFileSync(filepath, svg, 'utf8');
			} else {
				await handles[i].screenshot({ path: filepath });
			}
		}

	}
	
	if (typeof config.beforeRender === 'function') {
		await config.beforeRender(page);

	}

	let outputFileContent = '';
	if (config.devtools) {
		await new Promise((resolve) => page.on('close', resolve));
	} else if (config.as_html) {
		outputFileContent = await page.content();
	} else {
		await page.emulateMediaType(config.page_media_type);
		outputFileContent = await page.pdf(config.pdf_options);
	}

	if (typeof config.afterRender === 'function') {
		await config.afterRender(page);
	}

	if (config.debug) {
		const html = await page.content();
		const debugPath = path.join(config.basedir || process.cwd(), '.md-mermaid-pdf-debug.html');
		fs.writeFileSync(debugPath, html, 'utf8');
		console.error('[md-mermaid-pdf] Debug HTML written to', debugPath);
	}

	await page.close();
	return config.devtools ? undefined : { filename: config.dest, content: outputFileContent };
}

module.exports = { generateOutput };
