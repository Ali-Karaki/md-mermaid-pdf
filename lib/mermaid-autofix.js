'use strict';

const MERMAID_FENCE_RE = /^(```\s*mermaid)\s*\n([\s\S]*?)```\s*$/gim;

/**
 * Apply narrow, conservative transforms to mermaid diagram bodies.
 * Only safe whitespace/trim fixes; logs when changes are made.
 * @param {string} markdown
 * @param {{ log?: boolean }} [options]
 * @returns {string}
 */
function autofixMermaid(markdown, options = {}) {
	if (typeof markdown !== 'string') return markdown;
	const log = options.log !== false;
	let modified = false;
	const result = markdown.replace(MERMAID_FENCE_RE, (match, fence, body) => {
		const trimmed = body.replace(/\s+$/, '').replace(/^\n+/, '');
		if (trimmed !== body) {
			modified = true;
			if (log) {
				console.warn('[md-mermaid-pdf] mermaidAutofix: trimmed leading/trailing whitespace from diagram');
			}
		}
		return fence + '\n' + trimmed + '\n```';
	});
	return result;
}

module.exports = { autofixMermaid };
