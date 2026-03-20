#!/usr/bin/env node
'use strict';

const path = require('path');
const { mdToPdf } = require('../lib/index.js');

async function main() {
	const args = process.argv.slice(2);
	if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
		console.error(`Usage: md-mermaid-pdf <input.md> [output.pdf]
       md-mermaid-pdf <input1.md> [input2.md ...]

If output.pdf is omitted, writes alongside the markdown file.
With multiple inputs, each writes to its own .pdf alongside.`);

		process.exit(args.length === 0 ? 1 : 0);
	}

	if (args.length === 1 || (args.length === 2 && args[1].toLowerCase().endsWith('.pdf'))) {
		const inputPath = path.resolve(args[0]);
		const outputPath =
			args[1] ??
			path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}.pdf`);
		const basedir = path.dirname(inputPath);

		await mdToPdf(
			{ path: inputPath },
			{ dest: path.resolve(outputPath), basedir },
		);

		console.error('wrote', path.resolve(outputPath));
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
