'use strict';

const path = require('path');
const fg = require('fast-glob');
const fs = require('fs');

const GLOB_CHARS = /[*?[\]{}]/;

function hasGlobMagic(str) {
	return typeof str === 'string' && GLOB_CHARS.test(str);
}

/**
 * Expand glob patterns and directories to concrete .md file paths.
 * Only includes .md files; literal non-.md paths are skipped.
 * @param {string[]} patternsOrPaths - Input patterns (e.g. "docs/**\/*.md") or literal paths
 * @param {{ cwd?: string }} [options]
 * @returns {Promise<string[]>} Resolved, sorted, deduplicated paths
 */
async function expandPaths(patternsOrPaths, options = {}) {
	const cwd = options.cwd ?? process.cwd();
	const resolved = new Set();

	for (const arg of patternsOrPaths) {
		const resolvedArg = path.isAbsolute(arg) ? arg : path.resolve(cwd, arg);
		const stat = await fs.promises.stat(resolvedArg).catch(() => null);

		if (stat?.isDirectory()) {
			const files = await fg('**/*.md', { cwd: resolvedArg, absolute: true });
			files.forEach((p) => resolved.add(p));
		} else if (hasGlobMagic(arg)) {
			const files = await fg(arg, { cwd, absolute: true, onlyFiles: true });
			files.filter((p) => p.toLowerCase().endsWith('.md')).forEach((p) => resolved.add(p));
		} else if (resolvedArg.toLowerCase().endsWith('.md')) {
			resolved.add(resolvedArg);
		}
	}

	return [...resolved].sort();
}

module.exports = { expandPaths, hasGlobMagic };
