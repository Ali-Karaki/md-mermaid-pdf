'use strict';

/**
 * Integration tests: hashOutput, outputCache, documentTheme, mermaidAutofix.
 * Uses mermaidSource: bundled for speed (no network).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { test } = require('node:test');
const assert = require('node:assert');
const { mdToPdf } = require('../lib/index.js');

const SAMPLE_MD = `# Test

\`\`\`mermaid
flowchart LR
  A --> B
\`\`\`
`;

function baseConfig(tmp) {
	const cfg = {
		dest: path.join(tmp, 'out.pdf'),
		basedir: tmp,
		mermaidSource: 'bundled',
	};
	if (process.env.CI) {
		cfg.launch_options = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
	}
	return cfg;
}

test('hashOutput writes .sha256 sidecar', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mmdp-test-'));
	try {
		const result = await mdToPdf(
			{ content: SAMPLE_MD },
			{ ...baseConfig(tmp), hashOutput: true },
		);
		assert.ok(result);
		const sidecar = path.join(tmp, 'out.pdf.sha256');
		assert.ok(fs.existsSync(sidecar));
		const content = fs.readFileSync(sidecar, 'utf8');
		assert.ok(/^[a-f0-9]{64}\s+out\.pdf/.test(content.trim()));
	} finally {
		fs.rmSync(tmp, { recursive: true, force: true });
	}
});

test('outputCache skips conversion on second run', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mmdp-test-'));
	const cacheDir = path.join(tmp, '.cache');
	try {
		const config = { ...baseConfig(tmp), outputCache: { dir: cacheDir } };
		const r1 = await mdToPdf({ content: SAMPLE_MD }, config);
		assert.ok(r1);
		assert.ok(fs.existsSync(path.join(tmp, 'out.pdf')));
		const mtime1 = fs.statSync(path.join(tmp, 'out.pdf')).mtimeMs;

		// Second run: cache hit, should return quickly
		const r2 = await mdToPdf({ content: SAMPLE_MD }, config);
		assert.ok(r2);
		const mtime2 = fs.statSync(path.join(tmp, 'out.pdf')).mtimeMs;
		assert.equal(mtime1, mtime2, 'file should be unchanged (cache hit)');
	} finally {
		fs.rmSync(tmp, { recursive: true, force: true });
	}
});

function assertPdfBuffer(content) {
	const buf = Buffer.isBuffer(content) ? content : Buffer.from(content);
	assert.ok(buf.length > 100);
	assert.ok(buf.toString('utf8', 0, 5) === '%PDF-');
}

test('documentTheme dark applies body styling', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mmdp-test-'));
	const destPath = path.join(tmp, 'out.pdf');
	try {
		const result = await mdToPdf(
			{ content: SAMPLE_MD },
			{ ...baseConfig(tmp), documentTheme: 'dark' },
		);
		assert.ok(result);
		assert.ok(fs.existsSync(destPath));
		const pdf = fs.readFileSync(destPath);
		assertPdfBuffer(pdf);
	} finally {
		fs.rmSync(tmp, { recursive: true, force: true });
	}
});

test('mermaidAutofix does not break valid diagram', async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mmdp-test-'));
	const destPath = path.join(tmp, 'out.pdf');
	try {
		const result = await mdToPdf(
			{ content: SAMPLE_MD },
			{ ...baseConfig(tmp), mermaidAutofix: true },
		);
		assert.ok(result);
		assert.ok(fs.existsSync(destPath));
		const pdf = fs.readFileSync(destPath);
		assertPdfBuffer(pdf);
	} finally {
		fs.rmSync(tmp, { recursive: true, force: true });
	}
});
