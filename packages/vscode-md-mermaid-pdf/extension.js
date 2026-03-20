'use strict';

const vscode = require('vscode');
const { execSync } = require('child_process');
const path = require('path');

function activate(context) {
	const disposable = vscode.commands.registerCommand('md-mermaid-pdf.export', async () => {
		const doc = vscode.window.activeTextEditor?.document;
		if (!doc || doc.languageId !== 'markdown') {
			vscode.window.showErrorMessage('Open a Markdown file to export.');
			return;
		}
		const inputPath = doc.fileName;
		const outPath = inputPath.replace(/\.md$/i, '.pdf');
		try {
			execSync(`npx md-mermaid-pdf "${inputPath}" "${outPath}"`, {
				stdio: 'inherit',
				cwd: path.dirname(inputPath),
			});
			vscode.window.showInformationMessage(`Exported to ${outPath}`);
		} catch (err) {
			vscode.window.showErrorMessage(`Export failed: ${err.message}`);
		}
	});
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
