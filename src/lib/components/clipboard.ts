import { showDialogForLimitedTime } from './dialogs'

/**
   * Copy current URL to clipboard
   * @param dialogId id of dialog from ModalActionWithDialog where the info is displayed
   * @param url string to be added at the end of the URL
   * @param shorten does the URL has to be shorten ?
   * @param crypted does the URL need to be crypted ?
   * @author sylvain
   */
export async function copyLinkToClipboard (dialogId: string, url: URL) {
  navigator.clipboard.writeText(url.toString()).then(
    () => {
      showDialogForLimitedTime(dialogId + '-success', 1000)
    },
    (err) => {
      console.error('Async: Could not copy text: ', err)
      showDialogForLimitedTime(dialogId + '-error', 1000)
    }
  )
}

/**
 * Copy the code to be embedded into a webpage to the clipboard
 * @param dialogId id of dialog from ModalActionWithDialog where the info is displayed
 * @param url string to add to the URL
 * @param shorten tag for shortening the URL
 * @param crypted tag for encrypting the URL
 */
export async function copyEmbeddedCodeToClipboard (dialogId: string, url: URL) {
  const embeddedCode =
  `<iframe
      height="400" 
      src="${url.toString()}"
      frameborder="0" >
  </iframe>`
  navigator.clipboard.writeText(embeddedCode).then(
    () => {
      showDialogForLimitedTime(dialogId + '-success', 1000)
    },
    (err) => {
      console.error('Async: Could not copy text: ', err)
      showDialogForLimitedTime(dialogId + '-error', 1000)
    }
  )
}
