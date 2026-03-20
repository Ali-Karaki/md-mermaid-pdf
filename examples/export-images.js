#!/usr/bin/env node
'use strict';

/**
 * Example: export Mermaid diagrams to SVG alongside the PDF.
 * Run: node examples/export-images.js
 */

const path = require('path');
const { mdToPdf } = require('../lib/index.js');

const inputPath = path.join(__dirname, 'sample.md');
const outputPdf = path.join(__dirname, 'sample.pdf');
const diagramsDir = path.join(__dirname, 'diagrams');

(async () => {
	await mdToPdf(
		{ path: inputPath },
		{
			dest: outputPdf,
			basedir: __dirname,
			mermaidExportImages: { dir: diagramsDir, format: 'svg' },
		},
	);
	console.log('Wrote', outputPdf);
	console.log('Diagrams:', diagramsDir);
})();
