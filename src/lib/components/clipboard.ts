import { showDialogForLimitedTime } from './dialogs'
import { getBlobFromImageElement, copyBlobToClipboard, canCopyImagesToClipboard } from 'copy-image-clipboard'
import { encrypt, getShortenedCurrentUrl } from './urls'

/**
   * Copy current URL to clipboard
   * @param dialogId id of dialog from ModalActionWithDialog where the info is displayed
   * @param url string to be added at the end of the URL
   * @param shorten does the URL has to be shorten ?
   * @param crypted does the URL need to be crypted ?
   * @author sylvain
   */
export async function copyLinkToClipboard (dialogId: string, url: URL, shorten: boolean = false, crypted: boolean = false) {
  let finalUrl
  if (shorten) {
    try {
      finalUrl = await getShortenedCurrentUrl(url.toString())
    } catch (error) {
      showDialogForLimitedTime(dialogId + '-error', 1000)
      throw error
    }
  } else {
    finalUrl = crypted ? encrypt(url.toString()) : url.toString()
  }
  navigator.clipboard.writeText(finalUrl.toString()).then(
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
   * Copy image of QR-Code contained in designated img tag
   * and displayed that the image has been copied in designated dialog widget
   * @param imageId id of the HTMLImageElement containing the QR-Code
   * @param dialogId id of dialog from ModalActionWithDialog where the info is displayed
   * @author sylvain
   */
export function copyQRCodeImageToClipboard (imageId: string, dialogId: string) {
  const imageElement = document.getElementById(imageId)
  if (canCopyImagesToClipboard() && imageElement instanceof HTMLImageElement) {
    getBlobFromImageElement(imageElement)
      .then((blob) => {
        return copyBlobToClipboard(blob)
      })
      .then(() => {
        showDialogForLimitedTime(dialogId + '-success', 1000)
      })
      .catch((e) => {
        console.error('Error: ', e.message)
      })
  } else {
    showDialogForLimitedTime(dialogId + '-error', 2000)
  }
}

/**
 * Copy the code to be embedded into a webpage to the clipboard
 * @param dialogId id of dialog from ModalActionWithDialog where the info is displayed
 * @param url string to add to the URL
 * @param shorten tag for shortening the URL
 * @param crypted tag for encrypting the URL
 */
export async function copyEmbeddedCodeToClipboard (dialogId: string, url: URL, shorten = false, crypted = false) {
  let finalUrl
  if (shorten) {
    try {
      finalUrl = await getShortenedCurrentUrl(url.toString())
    } catch (error) {
      showDialogForLimitedTime(dialogId + '-error', 1000)
      throw error
    }
  } else {
    finalUrl = crypted ? encrypt(url.toString()) : url.toString()
  }
  const embeddedCode =
  `<iframe
      height="400" 
      src="${finalUrl}"
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
