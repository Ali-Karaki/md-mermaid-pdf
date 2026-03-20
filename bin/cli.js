#!/usr/bin/env node
'use strict';

const path = require('path');
const { mdToPdf } = require('../lib/index.js');

async function main() {
	const args = process.argv.slice(2);
	if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
		console.error(`Usage: md-mermaid-pdf <input.md> [output.pdf]

If output.pdf is omitted, writes alongside the markdown file.`);

		process.exit(args.length === 0 ? 1 : 0);
	}

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
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
