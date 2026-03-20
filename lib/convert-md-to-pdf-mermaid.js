'use strict';

/**
 * Same as md-to-pdf convertMdToPdf but uses generate-output-mermaid.
 */

const fs = require('fs');
const grayMatter = require('gray-matter');
const path = require('path');
const { generateOutput } = require('./generate-output-mermaid.js');
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
		config = {
			...config,
			...frontMatterConfig,
			pdf_options: { ...config.pdf_options, ...frontMatterConfig.pdf_options },
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

	const html = getHtml(md, config);
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
		} else {
			await fs.promises.writeFile(output.filename, output.content);
		}
	}
	return output;
}

module.exports = { convertMdToPdfMermaid, getDir };
