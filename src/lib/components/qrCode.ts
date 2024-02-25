import QRCode from 'qrcode'
import { encrypt, getShortenedCurrentUrl } from './urls'

export const allowedImageFormats = [
  { name: 'jpeg', format: 'image/jpeg' },
  { name: 'png', format: 'image/png' },
  { name: 'webp', format: 'image/webp' }
]

/**
 * Generate QR-Code from current URL and display it in designated image
 * (format is decided by global variable <i>formatQRCodeIndex</i>)
 * @param imageId id of the image
 * @param QRCodeWidth largeur du QR-Code (en pixels)
 * @param formatQRCodeIndex code du format d'image (voir allowedImageFormats)
 * @param url chaîne à ajouter à l'URL courante
 * @param shorten l'URL doit être raccourcie ou pas ?
 * @param crypted l'URL doit être encryptée ou pas ?
 * @author sylvain
 */
export async function urlToQRCodeOnWithinImgTag (
  imageId: string,
  QRCodeWidth: number,
  formatQRCodeIndex = 0,
  url = '',
  shorten = false,
  crypted = false
) {
  // const currentURL = document.URL + urlAddendum
  let currentURL
  if (shorten) {
    try {
      currentURL = await getShortenedCurrentUrl(url)
    } catch (error) {
      console.log('Impossible de créer le QR-Code avec lien raccourci')
      throw error
    }
  } else {
    currentURL = crypted
      ? encrypt(url) + ''
      : url
  }
  const options = {
    errorCorrectionLevel: 'H',
    type: allowedImageFormats[formatQRCodeIndex].format,
    quality: 0.9,
    margin: 1,
    scale: 2,
    width: QRCodeWidth,
    color: {
      dark: '#000',
      light: '#fff'
    }
  }
  QRCode.toDataURL(currentURL, options, (err: Error, url: string) => {
    if (err) throw err
    const img = document.getElementById(imageId)
    if (img) {
      img.setAttribute('src', url)
    } else {
      throw new Error(`Can't find image with this ID: ${imageId} in document...`)
    }
  })
}

/**
 * Download image of QR-Code contained within designated img tag
 * (timestamp is added to the file name)
 * @param imageId ID of the image to download
 * @param formatQRCodeIndex code du format d'image (voir allowedImageFormats)
 * @author sylvain
 */
export function downloadQRCodeImage (imageId: string, formatQRCodeIndex = 0) {
  // creating a timestamp for file name
  const date = new Date()
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const timestamp = `${year}${month}${day}`

  const id = document.getElementById(imageId)
  if (id) {
    const imageSrc = id.getAttribute('src')
    if (imageSrc) {
      fetch(imageSrc)
        .then((resp) => resp.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob)
          // creating virtual link for download
          const downloadLink = document.createElement('a')
          downloadLink.style.display = 'none'
          downloadLink.href = url
          downloadLink.download =
            'qrcode_diapo_coopmaths_' +
            timestamp +
            '.' +
            allowedImageFormats[formatQRCodeIndex].name
          document.body.appendChild(downloadLink)
          downloadLink.click()
          window.URL.revokeObjectURL(url)
        })
        .catch(() => "Erreur avec le téléchargement de l'image du QR-Code")
    } else {
      throw new Error(`Image with ID: ${imageId} has no attribute "src"`)
    }
  } else {
    throw new Error(`Can't find image with this ID: ${imageId} in document...`)
  }
}
