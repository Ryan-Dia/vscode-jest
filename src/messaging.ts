/**
 * collection of functions to show messages with actions in a consistent manner
 */

import * as vscode from 'vscode'

export interface MessageAction {
  title: string
  action: () => void
}

export function systemErrorMessage(message: string, ...actions: Array<MessageAction>) {
  vscode.window.showErrorMessage(message, ..._extractActionTitles(actions)).then(_handleMessageActions(actions))
}

export function systemWarningMessage(message: string, ...actions: Array<MessageAction>) {
  vscode.window.showWarningMessage(message, ..._extractActionTitles(actions)).then(_handleMessageActions(actions))
}

// common actions
export const showTroubleshootingAction: MessageAction = {
  title: 'Help',
  action: () => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(TroubleShootingURL)),
}

export const TroubleShootingURL = 'https://github.com/jest-community/vscode-jest/blob/master/README.md#troubleshooting'
//
// internal methods
//
function _extractActionTitles(actions?: Array<MessageAction>): string[] {
  return actions ? actions.map(a => a.title) : []
}
// expose the internal function so we can unit testing it
export function _handleMessageActions(actions?: Array<MessageAction>): (action?: string) => void {
  return (action?: string) => {
    if (!action) {
      return
    }
    const found = actions.filter(a => a.title === action)
    if (found.length === 1) {
      found[0].action()
    } else {
      throw Error(`expect exactly one matched action '${action}' but found ${found.length} match(es)`)
    }
  }
}