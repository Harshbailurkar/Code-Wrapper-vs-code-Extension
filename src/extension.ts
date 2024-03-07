import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "html-wrapper-" is now active!');

    let disposable = vscode.commands.registerTextEditorCommand('html-wrapper-.wrapper', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        const selection = textEditor.selection;
        const startPosition = selection.start;

        // Find the actual opening tag by looking for '<' before the tag name
        const openingTag = findOpeningTag(textEditor.document, startPosition);

        if (openingTag) {
            // Find the closing tag of the selected opening tag
            const closingTag = findClosingTag(textEditor.document, startPosition);

            if (closingTag) {
                // Wrap the entire HTML element with a <div>
                const wrappedText = `<div>\n${textEditor.document.getText(new vscode.Range(openingTag.start, closingTag.end))}\n</div>`;

                // Replace the selected HTML content with the wrapped text
                edit.replace(new vscode.Range(openingTag.start, closingTag.end), wrappedText);

                vscode.window.showInformationMessage('HTML element wrapped in <div> successfully!');
            } else {
                vscode.window.showInformationMessage('Failed to find matching closing tag.');
            }
        } else {
            vscode.window.showInformationMessage('Failed to find matching opening tag.');
        }
    });

    // Register the keybinding
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand('html-wrapper-.wrapper', () => {
        vscode.commands.executeCommand('html-wrapper-.wrapper');
    }));
}

export function deactivate() {}

function findOpeningTag(document: vscode.TextDocument, position: vscode.Position): vscode.Range | undefined {
    const openingTagRegex = /<\w+/;

    for (let line = position.line; line >= 0; line--) {
        const lineText = document.lineAt(line).text;
        const match = lineText.match(openingTagRegex);

        if (match) {
            const startCharacter = lineText.indexOf(match[0]);
            return new vscode.Range(new vscode.Position(line, startCharacter), new vscode.Position(line, startCharacter + match[0].length));
        }
    }

    return undefined;
}

function findClosingTag(document: vscode.TextDocument, startPosition: vscode.Position): vscode.Range | undefined {
    const openingTagName = getTagName(document, startPosition);

    if (openingTagName) {
        const closingTagPattern = `</${openingTagName}>`;
        const closingTagRegex = new RegExp(closingTagPattern, 'i');

        let closingTagLine = startPosition.line;
        let closingTagCharacter = startPosition.character;

        // Special handling for the starting tag itself
        if (document.lineAt(startPosition.line).text.trim().startsWith(`<${openingTagName}`)) {
            const closingTagMatch = document.lineAt(startPosition.line).text.match(closingTagRegex);
            if (closingTagMatch) {
                closingTagCharacter = closingTagMatch.index || 0;
                return new vscode.Range(new vscode.Position(startPosition.line, startPosition.character), new vscode.Position(startPosition.line, closingTagCharacter + closingTagMatch[0].length));
            }
        }

        while (closingTagLine < document.lineCount) {
            const lineText = document.lineAt(closingTagLine).text;
            const closingTagMatch = lineText.match(closingTagRegex);

            if (closingTagMatch) {
                closingTagCharacter = lineText.indexOf(closingTagMatch[0]);
                return new vscode.Range(new vscode.Position(startPosition.line, startPosition.character), new vscode.Position(closingTagLine, closingTagCharacter + closingTagMatch[0].length));
            }

            closingTagLine++;
        }
    }

    return undefined;
}

function getTagName(document: vscode.TextDocument, position: vscode.Position): string | undefined {
    const wordRange = document.getWordRangeAtPosition(position);
    const tagName = wordRange ? document.getText(wordRange) : undefined;
    return tagName;
}
