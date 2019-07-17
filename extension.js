// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const ColorHash = require("color-hash");
const colorHash = new ColorHash();
const tinyColor = require("tinycolor2");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  console.log(
    'Congratulations, your extension "statusbarcolorizer" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.statusbarcolorizer",
    function() {
      // The code you place here will be executed every time your command is executed

      const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

      const backgroundColor = colorHash.hex(
        vscode.workspace.workspaceFolders[0].name
      );

      let foregroundColor = "#ffffff";
      const fgColor = tinyColor(backgroundColor);
      if (fgColor.isLight()) {
        foregroundColor = "#000000";
      }

      const content = `	{
		"workbench.colorCustomizations":{
			"statusBar.background":"${backgroundColor}",
			"statusBar.foreground":"${foregroundColor}",
			"activityBar.background":"${backgroundColor}",
			}
		}`;

      const settingsDir = path.join(folderPath, ".vscode");

      if (!fs.existsSync(settingsDir)) {
        fs.mkdir(settingsDir, { recursive: true }, err => {
          if (err)
            return vscode.window.showErrorMessage("Cannot Create Directory");
          fs.writeFile(
            path.join(settingsDir, `settings.json`),
            content,
            err => {
              if (err) {
                console.log(err);
                return vscode.window.showErrorMessage("Error");
              }
              vscode.window.showInformationMessage("worked");
            }
          );
        });
      }

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World!");
    }
  );
  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
