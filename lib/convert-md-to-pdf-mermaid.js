'use strict';

/**
 * Same as md-to-pdf convertMdToPdf but uses generate-output-mermaid.
 */

const crypto = require('crypto');
const fs = require('fs');
const grayMatter = require('gray-matter');
const path = require('path');
const { generateOutput } = require('./generate-output-mermaid.js');
const { autofixMermaid } = require('./mermaid-autofix.js');
const { maybePrependToc } = require('./toc.js');
const { mdToPdfLib } = require('./paths');
const { getHtml } = require(mdToPdfLib('get-html.js'));
const { getOutputFilePath } = require(mdToPdfLib('get-output-file-path.js'));
const { getMarginObject, getDir } = require(mdToPdfLib('helpers.js'));
const { readFile } = require(mdToPdfLib('read-file.js'));

async function convertMdToPdfMermaid(input, config, { args = {}, browser } = {}) {
	const mdFileContent =
		'content' in input
			? input.content
			: await readFile(input.path, args['--md-file-encoding'] ?? config.md_file_encoding);
	const { content: md, data: frontMatterConfig } = grayMatter(
		mdFileContent,
		args['--gray-matter-options'] ? JSON.parse(args['--gray-matter-options']) : config.gray_matter_options,
	);

	if (frontMatterConfig instanceof Error) {
		console.warn('Warning: the front-matter was ignored because it could not be parsed:\n', frontMatterConfig);
	} else {
		const fm = frontMatterConfig.md_mermaid_pdf
			? frontMatterConfig.md_mermaid_pdf
			: frontMatterConfig;
		config = {
			...config,
			...fm,
			pdf_options: { ...config.pdf_options, ...fm.pdf_options },
		};
	}

	const { headerTemplate, footerTemplate, displayHeaderFooter } = config.pdf_options;
	if ((headerTemplate || footerTemplate) && displayHeaderFooter === undefined) {
		config.pdf_options.displayHeaderFooter = true;
	}

	const arrayOptions = ['body_class', 'script', 'stylesheet'];
	for (const option of arrayOptions) {
		if (!Array.isArray(config[option])) {
			config[option] = [config[option]].filter(Boolean);
		}
	}

	const jsonArgs = new Set(['--marked-options', '--pdf-options', '--launch-options']);
	for (const [argKey, argValue] of Object.entries(args)) {
		const key = argKey.slice(2).replace(/-/g, '_');
		config[key] = jsonArgs.has(argKey) ? JSON.parse(argValue) : argValue;
	}

	if (typeof config.pdf_options.margin === 'string') {
		config.pdf_options.margin = getMarginObject(config.pdf_options.margin);
	}

	if (config.dest === undefined) {
		config.dest =
			'path' in input ? getOutputFilePath(input.path, config.as_html ? 'html' : 'pdf') : 'stdout';
	}

	const highlightStylesheet = path.resolve(
		path.dirname(require.resolve('highlight.js')),
		'..',
		'styles',
		`${config.highlight_style}.css`,
	);
	config.stylesheet = [...new Set([...config.stylesheet, highlightStylesheet])];

	const mdFixed = config.mermaidAutofix ? autofixMermaid(md, { log: !config.debug }) : md;
	const mdWithToc = maybePrependToc(mdFixed, config.toc);

	const outputPath =
		config.dest && config.dest !== 'stdout' && config.dest !== ''
			? path.isAbsolute(config.dest)
				? config.dest
				: path.resolve(config.basedir || process.cwd(), config.dest)
			: null;

	const outputCacheOpt = config.outputCache;
	const cacheDir =
		outputCacheOpt && outputPath
			? path.resolve(
					config.basedir || process.cwd(),
					typeof outputCacheOpt === 'object' && outputCacheOpt.dir
						? outputCacheOpt.dir
						: '.md-mermaid-pdf-cache',
				)
			: null;

	const outputCacheKey =
		cacheDir &&
		JSON.stringify({
			preset: config.preset,
			toc: config.toc,
			documentTheme: config.documentTheme,
			mermaidConfig: config.mermaidConfig,
		});
	const inputHash =
		cacheDir && outputCacheKey
			? crypto.createHash('sha256').update(mdWithToc + outputCacheKey).digest('hex')
			: null;

	if (cacheDir && outputPath && inputHash) {
		const cacheFile = path.join(cacheDir, 'output-cache.json');
		let cache = {};
		try {
			await fs.promises.mkdir(cacheDir, { recursive: true });
			const raw = await fs.promises.readFile(cacheFile, 'utf8').catch(() => '{}');
			cache = JSON.parse(raw);
		} catch (_) {}
		if (cache[outputPath] === inputHash) {
			try {
				const content = await fs.promises.readFile(outputPath);
				return { filename: outputPath, content };
			} catch (_) {}
		}
	}

	const html = getHtml(mdWithToc, config);
	const relativePath = 'path' in input ? path.relative(config.basedir, input.path) : '.';
	const output = await generateOutput(html, relativePath, config, browser);

	if (!output) {
		if (config.devtools) {
			throw new Error('No file is generated with --devtools.');
		}
		throw new Error(`Failed to create ${config.as_html ? 'HTML' : 'PDF'}.`);
	}

	if (output.filename) {
		if (output.filename === 'stdout') {
			process.stdout.write(output.content);
			if (config.hashOutput) {
				const h = crypto.createHash('sha256').update(output.content).digest('hex');
				console.error(`[md-mermaid-pdf] PDF hash: ${h}`);
			}
		} else {
			await fs.promises.writeFile(output.filename, output.content);
			if (cacheDir && outputPath && inputHash) {
				const cacheFile = path.join(cacheDir, 'output-cache.json');
				let cache = {};
				try {
					const raw = await fs.promises.readFile(cacheFile, 'utf8').catch(() => '{}');
					cache = JSON.parse(raw);
				} catch (_) {}
				cache[outputPath] = inputHash;
				await fs.promises.writeFile(cacheFile, JSON.stringify(cache, null, 0), 'utf8');
			}
			if (config.hashOutput) {
				const h = crypto.createHash('sha256').update(output.content).digest('hex');
				const hashPath = output.filename + '.sha256';
				await fs.promises.writeFile(hashPath, h + '  ' + path.basename(output.filename) + '\n', 'utf8');
			}
		}
	}
	return output;
}

module.exports = { convertMdToPdfMermaid, getDir };
