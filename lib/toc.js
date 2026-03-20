'use strict';

/**
 * Generate a heading-based table of contents as markdown.
 * Slug matches marked's default: lowercase, spaces to hyphens.
 * @param {string} md
 * @returns {string}
 */
function generateTocMarkdown(md) {
	const headingRe = /^(#{1,6})\s+(.+)$/gm;
	const headings = [];
	let m;
	while ((m = headingRe.exec(md)) !== null) {
		const level = m[1].length;
		const text = m[2].trim();
		const slug = text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]/g, '');
		if (slug) {
			headings.push({ level, text, slug });
		}
	}
	if (headings.length === 0) return '';

	const lines = headings.map((h) => {
		const indent = '  '.repeat(Math.max(0, h.level - 1));
		return `${indent}- [${h.text}](#${h.slug})`;
	});
	return lines.join('\n');
}

/**
 * Prepend TOC to markdown if toc option is true.
 * @param {string} md
 * @param {boolean} [toc]
 * @returns {string}
 */
function maybePrependToc(md, toc) {
	if (!toc) return md;
	const tocMd = generateTocMarkdown(md);
	if (!tocMd) return md;
	return `## Table of Contents\n\n${tocMd}\n\n---\n\n${md}`;
}

module.exports = { generateTocMarkdown, maybePrependToc };
