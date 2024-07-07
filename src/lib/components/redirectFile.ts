import { showDialogForLimitedTime } from './dialogs'
import { encrypt, getShortenedCurrentUrl } from './urls'

/**
   * Download a file reddirecting to custom URL
   * @param dialogId id of dialog widget where the info is displayed
   * @param url string to be added at the end of the URL
   * @param {boolean} shorten does the URL has to be shorten ?
   * @param {boolean} crypted does the URL need to be crypted ?
   * @author Mathieu Degrange
   */
export async function downloadRedirectFile (dialogId: string, url: URL, fileName: string, shorten = false, crypted = false) {
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

  try {
    const text = `<html><head><meta http-equiv="refresh" content="0;URL=${encodeURI(finalUrl.toString())}"></head></html>`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', fileName + '.html')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    showDialogForLimitedTime(dialogId + '-success', 1000)
  } catch (error) {
    showDialogForLimitedTime(dialogId + '-error', 1000)
    throw error
  }
}
