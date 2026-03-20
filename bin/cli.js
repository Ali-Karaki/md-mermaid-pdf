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
	const concat = rawArgs.includes('--concat');
	const slides = rawArgs.includes('--slides');
	const oIdx = rawArgs.findIndex((a) => a === '-o' || a === '--output');
	const outputPath = oIdx >= 0 && rawArgs[oIdx + 1] ? rawArgs[oIdx + 1] : null;
	const args = rawArgs.filter((a) => a !== '--watch' && a !== '--concat' && a !== '--slides');
	const oIdxInArgs = args.findIndex((a) => a === '-o' || a === '--output');
	const skip = new Set();
	if (oIdxInArgs >= 0) {
		skip.add(oIdxInArgs);
		skip.add(oIdxInArgs + 1);
	}
	const argsFiltered = args.filter((_, i) => !skip.has(i));

	if (argsFiltered.length === 0 || argsFiltered[0] === '-h' || argsFiltered[0] === '--help') {
		console.error(`Usage: md-mermaid-pdf <input.md> [output.pdf] [--watch]
       md-mermaid-pdf <input1.md> [input2.md ...]
       md-mermaid-pdf --concat a.md b.md -o book.pdf

If output.pdf is omitted, writes alongside the markdown file.
--watch  Rebuild on file change (single file only).
With multiple inputs (no --concat), each writes to its own .pdf alongside.
--concat Concatenate files into one PDF; -o output.pdf required.
--slides Use slides preset (landscape, --- as page breaks).`);
		process.exit(argsFiltered.length === 0 ? 1 : 0);
	}

	if (concat) {
		if (!outputPath || argsFiltered.length === 0) {
			console.error('--concat requires -o output.pdf and at least one input file');
			process.exit(1);
		}
		const { mdToPdfFromFiles } = require('../lib/index.js');
		const paths = argsFiltered.map((a) => path.resolve(a));
		const basedir = path.dirname(paths[0]);
		await mdToPdfFromFiles(paths, { dest: path.resolve(outputPath), basedir }, {});
		console.error('wrote', path.resolve(outputPath));
		return;
	}

	if (argsFiltered.length === 1 || (argsFiltered.length === 2 && argsFiltered[1].toLowerCase().endsWith('.pdf'))) {
		const inputPath = path.resolve(argsFiltered[0]);
		const outPath =
			argsFiltered[1] ??
			outputPath ??
			path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}.pdf`);
		const config = slides ? { preset: 'slides' } : {};
		await mdToPdf(
			{ path: inputPath },
			{ dest: path.resolve(outPath), basedir: path.dirname(inputPath), ...config },
		);
		console.error('wrote', path.resolve(outPath));

		if (watch) {
			fs.watch(inputPath, async () => {
				try {
					await mdToPdf(
						{ path: inputPath },
						{ dest: path.resolve(outPath), basedir: path.dirname(inputPath), ...config },
					);
					console.error('wrote', path.resolve(outPath));
				} catch (err) {
					console.error(err);
				}
			});
			console.error('Watching', inputPath, '...');
		}
	} else {
		const { mdToPdfBatch } = require('../lib/index.js');
		const paths = argsFiltered.map((a) => path.resolve(a));
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
