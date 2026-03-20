import type { Browser } from 'puppeteer';

export type MdMermaidPdfInput = { content: string } | { path: string };

/** Same shape as md-to-pdf config, plus optional Mermaid CDN override (not passed to md-to-pdf). */
export type MdMermaidPdfConfig = Record<string, unknown> & {
	mermaidCdnUrl?: string;
};

export const DEFAULT_MERMAID_CDN_URL: string;

export function mdToPdf(
	input: MdMermaidPdfInput,
	config?: MdMermaidPdfConfig,
): Promise<{ filename?: string; content: Buffer } | undefined>;

export function mdToPdfBatch(
	paths: string[],
	config?: MdMermaidPdfConfig,
	options?: { concurrency?: number },
): Promise<Array<{ filename?: string; content: Buffer } | undefined>>;

export function createMermaidMarkedRenderer(): import('marked').Renderer;

export function convertMdToPdfMermaid(
	input: MdMermaidPdfInput,
	config: Record<string, unknown>,
	options?: { args?: Record<string, string>; browser?: Browser },
): Promise<{ filename?: string; content: Buffer } | undefined>;

export function generateOutputMermaid(
	html: string,
	relativePath: string,
	config: Record<string, unknown>,
	browserRef: Browser,
): Promise<{ filename?: string; content: Buffer } | undefined>;

export default mdToPdf;
