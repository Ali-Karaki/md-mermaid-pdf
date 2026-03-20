'use strict';

const path = require('path');
const getPort = require('get-port');
const puppeteer = require('puppeteer');
const { defaultConfig } = require(path.join(
	path.dirname(require.resolve('md-to-pdf/package.json')),
	'dist/lib/config',
));
const { serveDirectory, closeServer } = require(path.join(
	path.dirname(require.resolve('md-to-pdf/package.json')),
	'dist/lib/serve-dir',
));

const { convertMdToPdfMermaid, getDir } = require('./convert-md-to-pdf-mermaid.js');
const { createMermaidMarkedRenderer } = require('./create-mermaid-renderer.js');
const { generateOutput } = require('./generate-output-mermaid.js');

/** Pinned default; override via `config.script` (merged after this URL). */
const DEFAULT_MERMAID_CDN_URL =
	'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';

/**
 * Drop-in alternative to md-to-pdf’s `mdToPdf`: loads Mermaid from CDN, runs `mermaid.run()` before printing.
 * @param {{ content: string } | { path: string }} input
 * @param {Record<string, unknown>} [config] same options as md-to-pdf, plus optional `mermaidCdnUrl`
 * @returns {Promise<{ filename?: string, content: Buffer } | undefined>}
 */
async function mdToPdf(input, userConfig = {}) {
	if (!('content' in input) && !('path' in input)) {
		throw new Error('The input is missing one of the properties "content" or "path".');
	}

	const mermaidCdnUrl = userConfig.mermaidCdnUrl ?? DEFAULT_MERMAID_CDN_URL;
	const config = { ...userConfig };
	delete config.mermaidCdnUrl;
	delete config.mermaidWaitUntil;
	delete config.mermaidRenderTimeoutMs;

	if (!config.port) {
		config.port = await getPort();
	}
	if (!config.basedir) {
		config.basedir = 'path' in input ? getDir(input.path) : process.cwd();
	}
	if (!config.dest) {
		config.dest = '';
	}

	const mermaidScript = [{ url: mermaidCdnUrl }];
	const extraScripts = config.script
		? Array.isArray(config.script)
			? config.script
			: [config.script]
		: [];

	const mermaidRenderer = createMermaidMarkedRenderer();

	const mergedConfig = {
		...defaultConfig,
		...config,
		mermaidWaitUntil: userConfig.mermaidWaitUntil,
		mermaidRenderTimeoutMs: userConfig.mermaidRenderTimeoutMs,
		pdf_options: {
			...defaultConfig.pdf_options,
			...config.pdf_options,
		},
		marked_options: {
			...defaultConfig.marked_options,
			...config.marked_options,
			renderer: mermaidRenderer,
		},
		script: [...mermaidScript, ...extraScripts],
	};

	const server = await serveDirectory(mergedConfig);
	const browser = await puppeteer.launch({
		devtools: mergedConfig.devtools,
		...mergedConfig.launch_options,
	});

	try {
		return await convertMdToPdfMermaid(input, mergedConfig, { browser });
	} finally {
		await browser.close();
		await closeServer(server);
	}
}

module.exports = {
	mdToPdf,
	default: mdToPdf,
	DEFAULT_MERMAID_CDN_URL,
	createMermaidMarkedRenderer,
	convertMdToPdfMermaid,
	generateOutputMermaid: generateOutput,
};
