#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { mdToPdf } = require('../lib/index.js');

async function convert(inputPath, outputPath) {
	const basedir = path.dirname(inputPath);
	await mdToPdf(
		{ path: inputPath },
		{ dest: path.resolve(outputPath), basedir },
	);
	console.error('wrote', path.resolve(outputPath));
}

async function main() {
	const rawArgs = process.argv.slice(2);
	const watch = rawArgs.includes('--watch');
	const args = rawArgs.filter((a) => a !== '--watch');

	if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
		console.error(`Usage: md-mermaid-pdf <input.md> [output.pdf] [--watch]
       md-mermaid-pdf <input1.md> [input2.md ...]

If output.pdf is omitted, writes alongside the markdown file.
--watch  Rebuild on file change (single file only).
With multiple inputs, each writes to its own .pdf alongside.`);
		process.exit(args.length === 0 ? 1 : 0);
	}

	if (args.length === 1 || (args.length === 2 && args[1].toLowerCase().endsWith('.pdf'))) {
		const inputPath = path.resolve(args[0]);
		const outputPath =
			args[1] ??
			path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}.pdf`);

		await convert(inputPath, outputPath);

		if (watch) {
			fs.watch(inputPath, async () => {
				try {
					await convert(inputPath, outputPath);
				} catch (err) {
					console.error(err);
				}
			});
			console.error('Watching', inputPath, '...');
		}
	} else {
		const { mdToPdfBatch } = require('../lib/index.js');
		const paths = args.map((a) => path.resolve(a));
		await mdToPdfBatch(paths, {});
		for (const p of paths) {
			const out = path.join(path.dirname(p), `${path.basename(p, path.extname(p))}.pdf`);
			console.error('wrote', out);
		}
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
