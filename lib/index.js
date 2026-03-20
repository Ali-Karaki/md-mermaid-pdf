'use strict';

const crypto = require('crypto');
const fs = require('fs');
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

const { cdnPreflight } = require('./cdn-preflight.js');
const { composeMarkdown } = require('./compose-md.js');
const { convertMdToPdfMermaid, getDir } = require('./convert-md-to-pdf-mermaid.js');
const { createMermaidMarkedRenderer } = require('./create-mermaid-renderer.js');
const { generateOutput } = require('./generate-output-mermaid.js');

/** Pinned default; override via `config.script` (merged after this URL). */
const DEFAULT_MERMAID_CDN_URL =
	'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';

const MERMAID_FENCE = /```\s*mermaid\b/im;

function hasMermaidBlock(md) {
	return typeof md === 'string' && MERMAID_FENCE.test(md);
}

async function getMarkdownContent(input) {
	if ('content' in input) return input.content;
	return fs.promises.readFile(input.path, 'utf8');
}

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
	const preset = userConfig.preset;
	const documentTheme = userConfig.documentTheme;
	const mermaidConfig = userConfig.mermaidConfig;
	const mermaidSource = userConfig.mermaidSource ?? 'cdn';
	const config = { ...userConfig };
	delete config.mermaidCdnUrl;
	delete config.preset;
	delete config.documentTheme;
	delete config.mermaidWaitUntil;
	delete config.mermaidRenderTimeoutMs;
	delete config.mermaidConfig;
	delete config.mermaidSource;
	delete config.onMermaidError;

	if (!config.port) {
		config.port = await getPort();
	}
	if (!config.basedir) {
		config.basedir = 'path' in input ? getDir(input.path) : process.cwd();
	}
	if (!config.dest) {
		config.dest = '';
	}

	const mdContent = await getMarkdownContent(input);
	const needsMermaid = hasMermaidBlock(mdContent);
	let mermaidScript;
	if (!needsMermaid) {
		mermaidScript = [];
	} else if (mermaidSource === 'bundled') {
		mermaidScript = [{ path: require.resolve('mermaid/dist/mermaid.min.js') }];
	} else {
		const useCdn = mermaidSource === 'cdn' || mermaidSource === 'auto';
		const cdnOk = useCdn && (await cdnPreflight(mermaidCdnUrl));
		if (cdnOk) {
			mermaidScript = [{ url: mermaidCdnUrl }];
		} else {
			if (useCdn && mermaidSource === 'cdn') {
				console.warn('[md-mermaid-pdf] CDN unreachable, using bundled Mermaid');
			}
			mermaidScript = [{ path: require.resolve('mermaid/dist/mermaid.min.js') }];
		}
	}
	const extraScripts = config.script
		? Array.isArray(config.script)
			? config.script
			: [config.script]
		: [];

	const mermaidRenderer = createMermaidMarkedRenderer();

	const presetStylesheet =
		preset === 'github' || preset === 'minimal' || preset === 'slides'
			? [path.join(__dirname, '..', 'presets', `${preset}.css`)]
			: [];
	const documentThemeStylesheet =
		documentTheme === 'dark'
			? [path.join(__dirname, '..', 'presets', 'document-dark.css')]
			: [];

	const slidesPdfOptions =
		preset === 'slides'
			? { format: 'a4', printBackground: true, margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }, landscape: true }
			: {};

	const mergedConfig = {
		...defaultConfig,
		...config,
		mermaidWaitUntil: userConfig.mermaidWaitUntil,
		mermaidRenderTimeoutMs: userConfig.mermaidRenderTimeoutMs,
		mermaidConfig,
		onMermaidError: userConfig.onMermaidError,
		pdf_options: {
			...defaultConfig.pdf_options,
			...slidesPdfOptions,
			...config.pdf_options,
		},
		marked_options: {
			...defaultConfig.marked_options,
			...config.marked_options,
			renderer: mermaidRenderer,
		},
		script: [...mermaidScript, ...extraScripts],
		stylesheet: [
			...(Array.isArray(config.stylesheet)
				? config.stylesheet
				: config.stylesheet
					? [config.stylesheet]
					: defaultConfig.stylesheet ?? []),
			...presetStylesheet,
			...documentThemeStylesheet,
		],
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

/**
 * Zero-config convenience wrapper: path-only input with sensible defaults.
 * Sets basedir from input dir, dest beside input, mermaidSource: 'auto'.
 * @param {string} inputPath - Path to .md file
 * @param {Record<string, unknown>} [partialConfig] - Override any mdToPdf option
 * @returns {Promise<{ filename?: string, content: Buffer } | undefined>}
 */
async function mdToPdfAuto(inputPath, partialConfig = {}) {
	const resolved = path.resolve(inputPath);
	const dir = path.dirname(resolved);
	const base = path.basename(resolved, path.extname(resolved));
	const dest = path.join(dir, `${base}.pdf`);
	return mdToPdf(
		{ path: resolved },
		{
			dest,
			basedir: dir,
			mermaidSource: 'auto',
			...partialConfig,
		},
	);
}

/**
 * Concatenate multiple markdown files and convert to a single PDF.
 * Only the first file's front matter is used; subsequent files have front matter stripped.
 * @param {string[]} paths - Paths to .md files (order preserved)
 * @param {Record<string, unknown>} [userConfig] - Same options as mdToPdf; dest required for output path
 * @param {{ separator?: string }} [options] - separator between files (default '\n\n---\n\n')
 * @returns {Promise<{ filename?: string, content: Buffer } | undefined>}
 */
async function mdToPdfFromFiles(paths, userConfig = {}, options = {}) {
	const basedir = userConfig.basedir ?? process.cwd();
	const resolved = paths.map((p) => (path.isAbsolute(p) ? p : path.resolve(basedir, p)));
	const merged = await composeMarkdown(resolved, {
		basedir,
		separator: options.separator,
	});
	return mdToPdf({ content: merged }, { ...userConfig, basedir });
}

async function getInputHash(filePath) {
	const content = await fs.promises.readFile(filePath, 'utf8');
	return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Convert multiple markdown files to PDF.
 * @param {string[]} paths - Paths to .md files
 * @param {Record<string, unknown>} [userConfig] - Same options as mdToPdf
 * @param {{ concurrency?: number, incremental?: boolean, cacheDir?: string }} [options]
 *   - concurrency (default 1)
 *   - incremental: skip files whose input hash matches cache and output exists
 *   - cacheDir: dir for hash cache (default '.md-mermaid-pdf-cache')
 * @returns {Promise<Array<{ filename?: string, content: Buffer } | undefined>>}
 */
async function mdToPdfBatch(paths, userConfig = {}, options = {}) {
	const concurrency = options.concurrency ?? 1;
	const incremental = options.incremental ?? false;
	const cacheDir = options.cacheDir ?? '.md-mermaid-pdf-cache';
	const results = new Array(paths.length);
	let idx = 0;

	let cache = {};
	if (incremental) {
		try {
			const cachePath = path.resolve(cacheDir, 'batch-hash.json');
			await fs.promises.mkdir(cacheDir, { recursive: true });
			const raw = await fs.promises.readFile(cachePath, 'utf8').catch(() => '{}');
			cache = JSON.parse(raw);
		} catch (_) {
			/* ignore */
		}
	}

	async function worker() {
		while (idx < paths.length) {
			const i = idx++;
			const p = path.resolve(paths[i]);
			const outPath = path.join(
				path.dirname(p),
				`${path.basename(p, path.extname(p))}.pdf`,
			);

			if (incremental) {
				const hash = await getInputHash(p);
				if (cache[p] === hash) {
					try {
						await fs.promises.access(outPath);
						results[i] = { filename: outPath, content: await fs.promises.readFile(outPath) };
						continue;
					} catch (_) {
						/* output missing, fall through */
					}
				}
			}

			results[i] = await mdToPdf({ path: p }, userConfig);

			if (incremental && results[i]) {
				const hash = await getInputHash(p);
				cache[p] = hash;
			}
		}
	}

	const workers = Array.from({ length: Math.min(concurrency, paths.length) }, () => worker());
	await Promise.all(workers);

	if (incremental && Object.keys(cache).length > 0) {
		try {
			const cachePath = path.resolve(cacheDir, 'batch-hash.json');
			await fs.promises.writeFile(cachePath, JSON.stringify(cache, null, 0), 'utf8');
		} catch (_) {
			/* ignore */
		}
	}

	return results;
}

module.exports = {
	mdToPdf,
	mdToPdfAuto,
	mdToPdfFromFiles,
	mdToPdfBatch,
	default: mdToPdf,
	DEFAULT_MERMAID_CDN_URL,
	createMermaidMarkedRenderer,
	convertMdToPdfMermaid,
	generateOutputMermaid: generateOutput,
};
