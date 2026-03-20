'use strict';

const path = require('path');
const { test } = require('node:test');
const assert = require('node:assert');
const { mdToPdf } = require('../lib/index.js');

const INVALID_MERMAID = `# Doc

\`\`\`mermaid
flowchart LR
  A -x B
\`\`\`
`;

test('failOnMermaidError throws on invalid Mermaid syntax', async () => {
	const config = {
		dest: '',
		basedir: path.join(__dirname, '..'),
		failOnMermaidError: true,
	};
	if (process.env.CI) {
		config.launch_options = {
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		};
	}
	await assert.rejects(
		() => mdToPdf({ content: INVALID_MERMAID }, config),
		/Mermaid parse error/,
	);
});
