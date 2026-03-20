#!/usr/bin/env node
/**
 * Maintainer script: generates examples/sample.pdf and optionally rasterizes
 * the first page to PNG for README assets.
 *
 * For PNG output, install poppler: https://poppler.freedesktop.org/
 *   - macOS: brew install poppler
 *   - Ubuntu: apt install poppler-utils
 *   - Windows: choco install poppler
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sampleMd = path.join(root, 'examples', 'sample.md');
const samplePdf = path.join(root, 'examples', 'sample.pdf');
const assetsDir = path.join(root, 'assets');

async function run(cmd, args, opts = {}) {
	return new Promise((resolve, reject) => {
		const proc = spawn(cmd, args, { stdio: 'inherit', ...opts });
		proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
	});
}

async function hasCommand(cmd) {
	return new Promise((resolve) => {
		const proc = spawn(cmd, ['--version'], { stdio: 'ignore' });
		proc.on('error', () => resolve(false));
		proc.on('close', (code) => resolve(code === 0));
	});
}

async function main() {
	const { mdToPdf } = await import('../lib/index.js');
	const mdContent = fs.readFileSync(sampleMd, 'utf8');

	console.log('Generating examples/sample.pdf...');
	await mdToPdf(
		{ content: mdContent },
		{ dest: samplePdf, basedir: path.dirname(sampleMd) },
	);
	console.log('Wrote', samplePdf);

	if (await hasCommand('pdftoppm')) {
		await fs.promises.mkdir(assetsDir, { recursive: true });
		const outBase = path.join(assetsDir, 'readme-sample');
		await run('pdftoppm', ['-png', '-f', '1', '-singlefile', samplePdf, outBase]);
		const pngPath = outBase + '.png';
		if (fs.existsSync(pngPath)) {
			console.log('Wrote', pngPath);
		}
	} else {
		console.log('pdftoppm not found — install poppler for PNG output');
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
