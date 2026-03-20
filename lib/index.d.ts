import type { Browser } from 'puppeteer';

export type MdMermaidPdfInput = { content: string } | { path: string };

/** Same shape as md-to-pdf config, plus optional md-mermaid-pdf options. */
export type MdMermaidPdfConfig = Record<string, unknown> & {
	mermaidCdnUrl?: string;
	mermaidSource?: 'cdn' | 'bundled' | 'auto';
	mermaidConfig?: Record<string, unknown>;
	documentTheme?: 'light' | 'dark';
	outputCache?: boolean | { dir?: string };
	hashOutput?: boolean;
	mermaidAutofix?: boolean;
};

export const DEFAULT_MERMAID_CDN_URL: string;

export function mdToPdf(
	input: MdMermaidPdfInput,
	config?: MdMermaidPdfConfig,
): Promise<{ filename?: string; content: Buffer } | undefined>;

export function mdToPdfAuto(
	inputPath: string,
	partialConfig?: MdMermaidPdfConfig,
): Promise<{ filename?: string; content: Buffer } | undefined>;

export function mdToPdfFromFiles(
	paths: string[],
	config?: MdMermaidPdfConfig,
	options?: { separator?: string },
): Promise<{ filename?: string; content: Buffer } | undefined>;

export function mdToPdfBatch(
	paths: string[],
	config?: MdMermaidPdfConfig,
	options?: { concurrency?: number; incremental?: boolean; cacheDir?: string },
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
