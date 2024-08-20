# Wrapper HTML
[Install from here ](https://marketplace.visualstudio.com/items?itemName=Spikey.wrapper-html)

## Developed By
- [Avishkar Mahalingpure](https://github.com/Spikree)
- [Harsh Bailurkar](https://github.com/Harshbailurkar)

## Features

The Wrapper HTML extension allows you to effortlessly wrap your HTML code with any common HTML wrapping tags like `<div>`, `<section>`, `<article>`, and more. No more manually searching for ending tags—this extension takes care of it for you!

## Usage

1. Select the HTML code you want to wrap.
2. Trigger the extension by using the default keyboard shortcut `Ctrl+1` or through the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) by typing `Wrap HTML Element`.
3. Choose your desired wrapping tag from the quick pick list.

## Extension Settings

If the default keybinding conflicts with another extension, you can customize it by adding the following to your `keybindings.json` file:

```json
[
    {
        "key": "ctrl+1", // your_custom_key
        "command": "html-wrapper-.wrapper",
        "when": "editorTextFocus"
    }
]
```
### Known Issues
Currently, the extension fully supports wrapping elements with a range of block-level tags. Future updates will include enhanced support for additional tags.

## Release Notes
### v2.0.0
- Full support for wrapping selected elements with a variety of HTML tags.
- Automatic identification of closing tags.

## Installation
Open Visual Studio Code.
In the Extension Store search wrapper html. or download it from here https://marketplace.visualstudio.com/items?itemName=Spikey.wrapper-html

if the keys are conflicting then change them as given below: 
Go to the "View" menu and select "Command Palette" (or use the shortcut Ctrl+Shift+P or Cmd+Shift+P on macOS).
Type "Preferences: Open Keyboard Shortcuts (JSON)" and select it from the dropdown.
In the keybindings.json file, add your custom key binding as shown above.
Enjoy your streamlined HTML wrapping experience!
