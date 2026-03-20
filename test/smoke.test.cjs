'use strict';

/**
 * Smoke test: mdToPdf produces a valid PDF from markdown with a mermaid block.
 * Requires network (Mermaid CDN). Run with: npm test
 */

const path = require('path');
const { test } = require('node:test');
const assert = require('node:assert');
const { mdToPdf } = require('../lib/index.js');

const SAMPLE_MD = `# Sample

A simple flowchart:

\`\`\`mermaid
flowchart LR
  A --> B
  B --> C
\`\`\`
`;

test('mdToPdf produces PDF buffer from content with mermaid block', async () => {
	const config = {
		dest: '',
		basedir: path.join(__dirname, '..'),
	};
	if (process.env.CI) {
		config.launch_options = {
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		};
	}
	const result = await mdToPdf({ content: SAMPLE_MD }, config);

	assert.ok(result, 'mdToPdf should return a result');
	assert.ok(
		Buffer.isBuffer(result.content) || result.content instanceof Uint8Array,
		'result.content should be a Buffer or Uint8Array',
	);
	assert.ok(result.content.length > 100, 'PDF should have reasonable size');
	const head = Buffer.isBuffer(result.content)
		? result.content.toString('utf8', 0, 5)
		: Buffer.from(result.content).toString('utf8', 0, 5);
	assert.ok(head === '%PDF-', 'content should start with PDF magic bytes');
});

const PLAIN_MD = `# Plain

No mermaid here. Just text.
`;

test('mdToPdf produces PDF from content without mermaid (skips Mermaid script)', async () => {
	const config = {
		dest: '',
		basedir: path.join(__dirname, '..'),
	};
	if (process.env.CI) {
		config.launch_options = {
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		};
	}
	const result = await mdToPdf({ content: PLAIN_MD }, config);

	assert.ok(result, 'mdToPdf should return a result');
	assert.ok(
		Buffer.isBuffer(result.content) || result.content instanceof Uint8Array,
		'result.content should be a Buffer or Uint8Array',
	);
	const head1 = Buffer.isBuffer(result.content)
		? result.content.toString('utf8', 0, 5)
		: Buffer.from(result.content).toString('utf8', 0, 5);
	assert.ok(head1 === '%PDF-', 'content should start with PDF magic bytes');
});

test('mdToPdf with mermaidSource bundled (no network)', async () => {
	const config = {
		dest: '',
		basedir: path.join(__dirname, '..'),
		mermaidSource: 'bundled',
	};
	if (process.env.CI) {
		config.launch_options = {
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		};
	}
	const result = await mdToPdf({ content: SAMPLE_MD }, config);

	assert.ok(result, 'mdToPdf should return a result');
	assert.ok(
		Buffer.isBuffer(result.content) || result.content instanceof Uint8Array,
		'result.content should be a Buffer or Uint8Array',
	);
	const head = Buffer.isBuffer(result.content)
		? result.content.toString('utf8', 0, 5)
		: Buffer.from(result.content).toString('utf8', 0, 5);
	assert.ok(head === '%PDF-', 'content should start with PDF magic bytes');
});
