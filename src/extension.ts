import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('[*] EasyType is active!');

	vscode.workspace.onDidChangeTextDocument(event => {
		// console.log('[*] Detect text document changed.');
		detectTextChange(event);
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }

let convert_map = new Map([
	['，', ','], 
	['。', '.'], 
	['、', '\\'], 
	['（', '('],
	['）', ')'],
	['《', '<'],
	['》', '>'],
	['【', '['],
	['】', ']'],
	['：', ':'],
	['；', ';'],
	['？', '?'],
	['！', '!'],
	['‘', '\''],
	['’', '\''],
	['“', '"'],
	['”', '"'],
	['￥', '$'],
	['…', '^'],
]);

function detectTextChange(event: vscode.TextDocumentChangeEvent): void {
	if (!vscode.window.activeTextEditor) {
		console.log('No active text editor.');
		return;
	}

	if (event.reason) {
		console.log("Ignore event with reason: " + event.reason);
		return;
	}

	event.contentChanges.forEach(change => {
		const changedText = change.text;
		console.log(changedText);

		if ([ ...convert_map.keys() ].includes(changedText)) {
			const startPosition = change.range.start;
			if (startPosition.character > 0) {
				const previousText = event.document.getText(new vscode.Range(startPosition.translate(0, -1), startPosition));

				if ((previousText === changedText) ||
					((previousText === '“') && (changedText === '”')) ||
					((previousText === '‘') && (changedText === '’'))
				) {
					const edit = new vscode.WorkspaceEdit();
					const range = new vscode.Range(startPosition.translate(0, -1), startPosition.translate(0, 1));
					const replacementText = convert_map.get(changedText);
					if (replacementText) {
						edit.replace(event.document.uri, range, replacementText);
						vscode.workspace.applyEdit(edit);
					}
				}
			}
		}
	});
}