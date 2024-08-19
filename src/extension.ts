import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "html-wrapper-" is now active!');

    let disposable = vscode.commands.registerTextEditorCommand('html-wrapper.wrapper', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        try {
            // Show Quick Pick to select a tag
       const tags = [
    'div', 'section', 'article', 'header', 'footer', 'main', 'nav', 'aside', 'form', 'table',
    'blockquote', 'ul', 'ol', 'span', 'a', 'strong', 'em', 'code', 'mark'
];

const tag = await vscode.window.showQuickPick(tags, {
    placeHolder: 'Select the HTML tag to wrap with'
});





            if (!tag) {
                vscode.window.showInformationMessage('No tag selected. Aborting wrap operation.');
                return;
            }

            console.log(`Selected tag: ${tag}`);

            const selection = textEditor.selection;
            const startPosition = selection.start;

            const openingTag = findOpeningTag(textEditor.document, startPosition);

            if (!openingTag) {
                vscode.window.showInformationMessage('Failed to find matching opening tag.');
                return;
            }

            console.log(`Opening tag found: ${textEditor.document.getText(openingTag)}`);

            const closingTag = findClosingTag(textEditor.document, openingTag);

            if (!closingTag) {
                vscode.window.showInformationMessage('Failed to find matching closing tag.');
                return;
            }

            console.log(`Closing tag found: ${textEditor.document.getText(closingTag)}`);

            // Wrap the entire HTML element with the specified tag
            const contentToWrap = textEditor.document.getText(new vscode.Range(openingTag.start, closingTag.end));
            const wrappedText = `<${tag}>\n${contentToWrap}\n</${tag}>`;

            // Replace the selected HTML content with the wrapped text
            textEditor.edit(editBuilder => {
                editBuilder.replace(new vscode.Range(openingTag.start, closingTag.end), wrappedText);
            }).then(success => {
                if (success) {
                    vscode.window.showInformationMessage(`HTML element wrapped in <${tag}> successfully!`);
                } else {
                    vscode.window.showInformationMessage('Failed to replace text. Try again.');
                }
            }, error => {
                vscode.window.showErrorMessage('An error occurred while replacing text.');
                console.error('Error occurred while executing command:', error);
            });

        } catch (error) {
            console.error('Error occurred while executing command:', error);
            vscode.window.showErrorMessage('An error occurred while executing the command.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }

function findOpeningTag(document: vscode.TextDocument, position: vscode.Position): vscode.Range | undefined {
    const openingTagRegex = /<\w+/g;
    let lineNumber = position.line;

    while (lineNumber >= 0) {
        const lineText = document.lineAt(lineNumber).text;
        const matches = [...lineText.matchAll(openingTagRegex)];
        const tagMatch = matches.find(match => position.character >= match.index! && position.character <= match.index! + match[0].length);

        if (tagMatch) {
            const startCharacter = tagMatch.index!;
            return new vscode.Range(new vscode.Position(lineNumber, startCharacter), new vscode.Position(lineNumber, startCharacter + tagMatch[0].length));
        }

        lineNumber--;
    }

    return undefined;
}

function findClosingTag(document: vscode.TextDocument, openingTagRange: vscode.Range): vscode.Range | undefined {
    const openingTagText = document.getText(openingTagRange);
    const openingTagName = openingTagText.match(/<(\w+)/)?.[1];

    if (openingTagName) {
        const closingTagPattern = `</${openingTagName}>`;
        const closingTagRegex = new RegExp(closingTagPattern, 'i');
        let lineNumber = openingTagRange.start.line;

        while (lineNumber < document.lineCount) {
            const lineText = document.lineAt(lineNumber).text;
            const match = lineText.match(closingTagRegex);

            if (match) {
                const startCharacter = lineText.indexOf(match[0]);
                return new vscode.Range(new vscode.Position(lineNumber, startCharacter), new vscode.Position(lineNumber, startCharacter + match[0].length));
            }

            lineNumber++;
        }
    }

    return undefined;
}
