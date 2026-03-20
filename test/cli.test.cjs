'use strict';

/**
 * CLI tests: flag parsing, expandPaths, stdout mode.
 * Uses mermaidSource: bundled for speed (no network).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { test } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('child_process');
const { expandPaths, hasGlobMagic } = require('../lib/expand-paths.js');

test('hasGlobMagic detects glob patterns', () => {
	assert.equal(hasGlobMagic('docs/*.md'), true);
	assert.equal(hasGlobMagic('**/*.md'), true);
	assert.equal(hasGlobMagic('a[bc].md'), true);
	assert.equal(hasGlobMagic('simple.md'), false);
	assert.equal(hasGlobMagic('path/to/file.md'), false);
});

test('expandPaths expands glob and resolves literal .md', async () => {
	const fixtures = path.join(__dirname, '..', 'examples');
	const got = await expandPaths(['sample.md', 'docs/getting-started.md'], {
		cwd: fixtures,
	});
	assert.ok(Array.isArray(got));
	assert.ok(got.length >= 2);
	assert.ok(got.some((p) => p.endsWith('sample.md')));
	assert.ok(got.some((p) => p.endsWith('getting-started.md')));
});

test('expandPaths with directory returns .md files', async () => {
	const fixtures = path.join(__dirname, '..', 'examples');
	const got = await expandPaths([fixtures], { cwd: fixtures });
	assert.ok(Array.isArray(got));
	assert.ok(got.length >= 1);
	got.forEach((p) => assert.ok(p.endsWith('.md'), `expected .md path: ${p}`));
});

test('expandPaths with glob pattern', async () => {
	const fixtures = path.join(__dirname, '..', 'examples');
	const got = await expandPaths(['**/*.md'], { cwd: fixtures });
	assert.ok(Array.isArray(got));
	assert.ok(got.length >= 2);
	got.forEach((p) => assert.ok(p.endsWith('.md')));
});

test('expandPaths skips non-.md literal files', async () => {
	const cwd = path.join(__dirname, '..');
	const got = await expandPaths(['package.json', 'examples/sample.md'], { cwd });
	assert.ok(got.length === 1);
	assert.ok(got[0].endsWith('sample.md'));
});

test('CLI --help exits 0', async () => {
	const bin = path.join(__dirname, '..', 'bin', 'cli.js');
	const proc = spawn(process.execPath, [bin, '--help'], {
		stdio: ['ignore', 'pipe', 'pipe'],
	});
	const [code] = await new Promise((resolve) => {
		proc.on('close', (c) => resolve([c]));
	});
	assert.equal(code, 0);
});

test('CLI --theme flag runs without error', async () => {
	const bin = path.join(__dirname, '..', 'bin', 'cli.js');
	const sample = path.join(__dirname, '..', 'examples', 'sample.md');
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mmdp-cli-'));
	const out = path.join(tmp, 'theme-test.pdf');
	const proc = spawn(process.execPath, [
		bin,
		sample,
		'-o', out,
		'--theme', 'forest',
		'--mermaid-source', 'bundled',
	], {
		stdio: ['ignore', 'pipe', 'pipe'],
		env: { ...process.env, CI: '1' },
	});
	const [code] = await new Promise((resolve) => proc.on('close', (c) => resolve([c])));
	assert.equal(code, 0);
	assert.ok(fs.existsSync(out));
	fs.rmSync(tmp, { recursive: true, force: true });
});

test('CLI stdout mode produces PDF bytes', async () => {
	const bin = path.join(__dirname, '..', 'bin', 'cli.js');
	const sample = path.join(__dirname, '..', 'examples', 'sample.md');
	const proc = spawn(process.execPath, [
		bin,
		sample,
		'-o',
		'-',
		'--mermaid-source',
		'bundled',
	], {
		stdio: ['ignore', 'pipe', 'pipe'],
		env: { ...process.env, CI: '1' },
	});

	let stdout = Buffer.alloc(0);
	proc.stdout.on('data', (chunk) => {
		stdout = Buffer.concat([stdout, chunk]);
	});

	const [code] = await new Promise((resolve) => {
		proc.on('close', (c) => resolve([c]));
	});

	assert.equal(code, 0);
	assert.ok(stdout.length > 100);
	assert.ok(stdout.toString('utf8', 0, 5) === '%PDF-');
});
