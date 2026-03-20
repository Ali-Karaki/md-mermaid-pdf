'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { generateTocMarkdown, maybePrependToc } = require('../lib/toc.js');

test('generateTocMarkdown extracts headings and creates links', () => {
	const md = `# Intro
Some text.
## Section One
Content.
### Subsection
More.`;
	const toc = generateTocMarkdown(md);
	assert.ok(toc.includes('[Intro](#intro)'));
	assert.ok(toc.includes('[Section One](#section-one)'));
	assert.ok(toc.includes('[Subsection](#subsection)'));
});

test('maybePrependToc returns unchanged md when toc is false', () => {
	const md = '# Hello';
	assert.strictEqual(maybePrependToc(md, false), md);
});

test('maybePrependToc prepends TOC when toc is true', () => {
	const md = '# Hello\n\nWorld.';
	const result = maybePrependToc(md, true);
	assert.ok(result.startsWith('## Table of Contents'));
	assert.ok(result.includes('[Hello](#hello)'));
	assert.ok(result.includes('---'));
	assert.ok(result.includes('# Hello'));
});
