#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { mdToPdf } = require('../lib/index.js');
const { expandPaths } = require('../lib/expand-paths.js');

function parseFlags(rawArgs) {
	const flags = {
		watch: false,
		concat: false,
		slides: false,
		theme: null,
		mermaidSource: null,
		documentTheme: null,
		output: null,
	};
	const positionals = [];
	let i = 0;
	while (i < rawArgs.length) {
		const arg = rawArgs[i];
		if (arg === '--watch') {
			flags.watch = true;
			i += 1;
		} else if (arg === '--concat') {
			flags.concat = true;
			i += 1;
		} else if (arg === '--slides') {
			flags.slides = true;
			i += 1;
		} else if (arg === '--theme' && rawArgs[i + 1]) {
			flags.theme = rawArgs[i + 1];
			i += 2;
		} else if ((arg === '--mermaid-source' || arg === '-m') && rawArgs[i + 1]) {
			flags.mermaidSource = rawArgs[i + 1];
			i += 2;
		} else if ((arg === '-o' || arg === '--output') && rawArgs[i + 1]) {
			flags.output = rawArgs[i + 1];
			i += 2;
		} else if (arg === '--document-theme' && rawArgs[i + 1]) {
			flags.documentTheme = rawArgs[i + 1];
			i += 2;
		} else if (arg === '-h' || arg === '--help') {
			flags.help = true;
			i += 1;
		} else if (!arg.startsWith('-')) {
			positionals.push(arg);
			i += 1;
		} else {
			i += 1;
		}
	}
	return { flags, positionals };
}

function buildConfig(flags, overrides = {}) {
	const config = { ...overrides };
	if (flags.slides) {
		config.preset = 'preset' in config ? config.preset : 'slides';
	}
	if (flags.theme) {
		config.mermaidConfig = {
			...(config.mermaidConfig || {}),
			theme: flags.theme,
		};
	}
	if (flags.mermaidSource) {
		config.mermaidSource = flags.mermaidSource;
	}
	if (flags.documentTheme) {
		config.documentTheme = flags.documentTheme;
	}
	if (process.env.CI) {
		config.launch_options = {
			...(config.launch_options || {}),
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		};
	}
	return config;
}

async function main() {
	const { flags, positionals } = parseFlags(process.argv.slice(2));
	const stdoutMode = flags.output === '-';
	const cwd = process.cwd();

	if (flags.help || positionals.length === 0) {
		console.error(`Usage: md-mermaid-pdf <input.md> [output.pdf] [options]
       md-mermaid-pdf <input1.md> [input2.md ...]
       md-mermaid-pdf --concat a.md b.md -o book.pdf
       md-mermaid-pdf "docs/**/*.md"
       md-mermaid-pdf doc.md -o -  # write PDF to stdout

If output.pdf is omitted, writes alongside the markdown file.

Options:
  --watch              Rebuild on file change (single file only)
  --concat             Concatenate files into one PDF; -o output.pdf required
  --slides             Use slides preset (landscape, --- as page breaks)
  --theme <name>       Mermaid theme (e.g. dark, neutral, default, forest)
  --document-theme     light | dark (PDF page background)
  --mermaid-source <x> cdn | bundled | auto
  -o, --output <path>  Output path; use - for stdout`);
		process.exit(flags.help ? 0 : 1);
	}

	const singleWithExplicitOutput =
		positionals.length === 2 && positionals[1].toLowerCase().endsWith('.pdf');
	const inputPositionals = singleWithExplicitOutput ? [positionals[0]] : positionals;
	const outputPathFromPos = singleWithExplicitOutput ? positionals[1] : null;

	const expanded = await expandPaths(inputPositionals, { cwd });
	if (expanded.length === 0) {
		console.error('No .md files found for the given paths');
		process.exit(1);
	}

	const baseConfig = buildConfig(flags);

	if (flags.concat) {
		if (!flags.output || flags.output === '-') {
			console.error('--concat requires -o output.pdf (stdout not supported for concat)');
			process.exit(1);
		}
		const { mdToPdfFromFiles } = require('../lib/index.js');
		const basedir = path.dirname(expanded[0]);
		await mdToPdfFromFiles(
			expanded,
			{ dest: path.resolve(flags.output), basedir, ...baseConfig },
			{},
		);
		console.error('wrote', path.resolve(flags.output));
		return;
	}

	if (expanded.length === 1) {
		const inputPath = expanded[0];
		const explicitOutput = outputPathFromPos ?? flags.output;
		const outPath =
			explicitOutput && explicitOutput !== '-'
				? path.resolve(explicitOutput)
				: path.join(
						path.dirname(inputPath),
						`${path.basename(inputPath, path.extname(inputPath))}.pdf`,
					);

		const dest = stdoutMode ? '' : outPath;
		const config = {
			...baseConfig,
			dest,
			basedir: path.dirname(inputPath),
		};

		const result = await mdToPdf({ path: inputPath }, config);

		if (stdoutMode) {
			process.stdout.write(result.content);
		} else {
			await fs.promises.writeFile(outPath, result.content);
			console.error('wrote', path.resolve(outPath));
		}

		if (flags.watch && !stdoutMode) {
			fs.watch(inputPath, async () => {
				try {
					const r = await mdToPdf({ path: inputPath }, config);
					await fs.promises.writeFile(outPath, r.content);
					console.error('wrote', path.resolve(outPath));
				} catch (err) {
					console.error(err);
				}
			});
			console.error('Watching', inputPath, '...');
		}
		return;
	}

	// Batch mode
	const { mdToPdfBatch } = require('../lib/index.js');
	await mdToPdfBatch(expanded, baseConfig, {});
	for (const p of expanded) {
		const out = path.join(path.dirname(p), `${path.basename(p, path.extname(p))}.pdf`);
		console.error('wrote', out);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
