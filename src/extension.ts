import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('[*] EasyType is active!');

    vscode.workspace.onDidChangeTextDocument(event => {
        // console.log('[*] Detect text document changed.');
		detectTextChange(event);
    });
}

// This method is called when your extension is deactivated
export function deactivate() {}

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

		if (changedText === '、') {
			const startPosition = change.range.start;
			if (startPosition.character > 0) {
				const previousText = event.document.getText(new vscode.Range(startPosition.translate(0, -1), startPosition));

				if (previousText === '、') {
					const edit = new vscode.WorkspaceEdit();
					const range = new vscode.Range(startPosition.translate(0, -1), startPosition.translate(0, 1));
					edit.replace(event.document.uri, range, '\\');
					vscode.workspace.applyEdit(edit);
				}
			}
		}
	});
}