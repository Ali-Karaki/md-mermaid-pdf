'use strict';

const fs = require('fs').promises;
const path = require('path');
const grayMatter = require('gray-matter');

const DEFAULT_SEPARATOR = '\n\n---\n\n';

/**
 * Read and concatenate multiple markdown files into one string.
 * Only the first file's front matter is preserved; subsequent files have front matter stripped.
 * @param {string[]} paths - Resolved paths to .md files
 * @param {{ basedir?: string, separator?: string }} [options]
 * @returns {Promise<string>}
 */
async function composeMarkdown(paths, options = {}) {
	const basedir = options.basedir || process.cwd();
	const separator = options.separator ?? DEFAULT_SEPARATOR;

	const parts = [];
	for (let i = 0; i < paths.length; i++) {
		const p = path.isAbsolute(paths[i]) ? paths[i] : path.resolve(basedir, paths[i]);
		const raw = await fs.readFile(p, 'utf8');
		if (i === 0) {
			parts.push(raw);
		} else {
			const { content } = grayMatter(raw);
			parts.push(content.trim());
		}
	}
	return parts.join(separator);
}

module.exports = { composeMarkdown };
