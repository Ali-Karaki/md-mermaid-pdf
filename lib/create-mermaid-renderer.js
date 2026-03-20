'use strict';

const { marked } = require('marked');

/**
 * Marked renderer: ```mermaid fences become <div class="mermaid"> for browser rendering.
 * @returns {import('marked').Renderer}
 */
function createMermaidMarkedRenderer() {
	const renderer = new marked.Renderer();
	const origCode = renderer.code.bind(renderer);
	renderer.code = function mermaidAwareCode(code, infostring, escaped) {
		const lang = (infostring || '').match(/\S*/)[0];
		if (lang === 'mermaid') {
			return `<div class="mermaid">\n${code.replace(/\n$/, '')}\n</div>\n`;
		}
		return origCode(code, infostring, escaped);
	};
	return renderer;
}

module.exports = { createMermaidMarkedRenderer };
