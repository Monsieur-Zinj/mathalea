import { globalOptions } from '../stores/generalStore'
import { canOptions } from '../stores/canStore'
import { get } from 'svelte/store'
import { type InterfaceGlobalOptions, type VueType } from '../../lib/types'
import { notify } from '../../bugsnag'

export class MathAleaURL extends URL {
  /**
   * Utilise l'URL courante pour fabriquer l'URL lors de l' appel new MathAleaURL()
   */
  constructor () {
    super(document.URL)
  }

  /**
   * Retire de l'URL le paramètre fourni et retourne l'URL modifiée
   * @param paramToBeRemoved paramètre à supprimer dans l'URL (seulement les propriétés de InterfaceGlobalOptions sont permises )
   * @returns l'URL
   */
  removeParam (paramToBeRemoved: keyof InterfaceGlobalOptions): MathAleaURL {
    this.searchParams.delete(paramToBeRemoved)
    return this
  }

  /**
   * Ajoute un paramètre avec sa valeur à l'URL et retourne l'URL modifiée
   * @param param paramètre à ajouter (seulement les propriétés de InterfaceGlobalOptions sont permises)
   * @param value valeur du paramètre
   * @returns l'URL
   */
  addParam (param: keyof InterfaceGlobalOptions, value: string): MathAleaURL {
    this.searchParams.append(param, value)
    return this
  }

  /**
   * Ajoute (ou remplace) un paramètre avec sa valeur à l'URL et retourne l'URL modifiée
   * @param param paramètre à ajouter (seulement les propriétés de InterfaceGlobalOptions sont permises)
   * @param value valeur du paramètre
   * @returns l'URL
   */
  setParam (param: keyof InterfaceGlobalOptions, value: string): MathAleaURL {
    this.searchParams.set(param, value)
    return this
  }

  /**
   * Ajoute/remplace une vue cible à l'URL et retourne cette URL
   * @param value la vue cible
   * @returns l'URL
   */
  setVue (value: VueType): MathAleaURL {
    this.setParam('v', value)
    return this
  }
}

/**
 * Construit l'URL pour la feuille élève en mettant tous les paramètres existants et ceux des réglages de la page de configuration
 * @param view la vue dans laquelle va s'afficher la série d'exercice
 * @param mode le mode de présentation des exercices
 * @returns l'URL correspondant à la feuille d'exercices avec tous les paramètres
 */
export function buildMathAleaURL (options: {
  view: VueType,
  mode?: InterfaceGlobalOptions['presMode'],
  isEncrypted?: boolean, isShort?: boolean}
): URL {
  const url = new MathAleaURL()
  const global = get(globalOptions)
  const can = get(canOptions)
  url.setVue(options.view).addParam('es', buildEsParams(options.mode))
  if (options.view === 'can') {
    // paramètres spécifiques à la can dans l'URL
    url
      .addParam('canD', (can.durationInMinutes ?? 1).toString())
      .addParam('canT', can.subTitle.toString())
      .addParam('canSA', can.solutionsAccess ? '1' : '0')
      .addParam('canSM', can.solutionsMode)
      .addParam('canI', can.isInteractive ? '1' : '0')
  } else {
    url.addParam('title', global.title)
  }
  if (global.beta) {
    url.addParam('beta', '1')
  }
  const cryptedUrl = options.isEncrypted ? encrypt(url.toString()) : url.toString()
  return new URL(cryptedUrl)
}

/**
 * Construit la chaîne représentant les réglages de la vue élève/can
 * @param mode mode de présentation
 * @returns la chaîne de 6 chiffres représentant le setup
 */
export function buildEsParams (
  mode?: InterfaceGlobalOptions['presMode']
): string {
  const options = get(globalOptions)
  const presentationMode = new Map([
    ['liste_exos', 0],
    ['un_exo_par_page', 1],
    ['liste_questions', 2],
    ['une_question_par_page', 3],
    ['cartes', 4]
  ])
  let es = ''
  // Paramètre 'es' : presMode|setInteractive|isSolutionAccessible|isInteractiveFree|oneShot|twoColumns|isTitleDisplayed
  es += presentationMode.get(mode !== undefined ? mode : options.presMode)
  es += options.setInteractive
  es += options.isSolutionAccessible ? '1' : '0'
  es += options.isInteractiveFree ? '1' : '0'
  es += options.oneShot ? '1' : '0'
  es += options.twoColumns ? '1' : '0'
  es += options.isTitleDisplayed ? '1' : '0'
  return es
}

export async function getShortenedCurrentUrl (addendum: string = ''): Promise<string> {
  const urlObj = new URL(window.location.href)
  const port = urlObj.port
  const baseUrl = port ? 'https://coopmaths.fr/alea' : document.URL
  const url = `${baseUrl}${addendum}`

  try {
    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`)
    if (!response.ok) {
      throw new Error('Network response was not ok.')
    }
    const jsonResponse = await response.json()
    return jsonResponse.result.full_short_link
  } catch (error) {
    notify('Impossible de raccourcir l\'url', { error })
    return url
  }
}

/**
 * Encrypte la partie de l'URL après le point d'interrogation '?'
 * Principe : on ajoute 'EEEE' après le '?' pour reconnaître une URL encryptée
 * par la suite et on encode le reste de l'URL en suivant l'algorithme montré
 * [ici](https://stackoverflow.com/questions/67855828/encrypt-and-decrypt-a-string-using-simple-javascript-without-using-any-external)...
 * @param {string} url URL a encrypter
 * @returns {URL} URL encryptée
 * @author sylvain
 */
export function encrypt (url: string): string {
  const urlParts = url.split('?')
  let newUrl = urlParts[0] + '?EEEE'
  let char, nextChar, combinedCharCode
  let partEncrypted = ''
  const partToEncrypt = encodeURI(urlParts[1])
  for (let i = 0; i < partToEncrypt.length; i += 2) {
    char = partToEncrypt.charCodeAt(i)
    if (i + 1 < partToEncrypt.length) {
      nextChar = partToEncrypt.charCodeAt(i + 1) - 31
      combinedCharCode =
        char +
        '' +
        nextChar.toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
      partEncrypted += String.fromCharCode(parseInt(combinedCharCode, 10))
    } else {
      partEncrypted += partToEncrypt.charAt(i)
    }
  }
  const hexPartEncrypted = partEncrypted.split('').reduce((hex, c) => {
    hex += c.charCodeAt(0).toString(16).padStart(4, '0')
    return hex
  }, '')
  newUrl += hexPartEncrypted
  return newUrl
}

/**
 * Décrypte _si besoin_ une URL sur la base du cryptage précédent
 * @param {URL} url URL à décrypter
 * @returns {URL} URL décryptée
 * @author sylvain
 */
export function decrypt (url: URL): URL {
  const oldUrl = url.href
  const part1 = oldUrl.slice(0, oldUrl.indexOf('?'))
  const part2withEEEE = oldUrl.replace(part1 + '?', '')
  let newUrl = ''
  if (part2withEEEE.substring(0, 4) !== 'EEEE') {
    newUrl = url.toString()
  } else {
    let char, codeStr, firstCharCode, lastCharCode
    let decryptedPart = ''
    newUrl = part1 + '?'
    let part2 = part2withEEEE.slice(4, part2withEEEE.length) // on enlève les `EEEE`
    const matches = part2.match(/.{1,4}/g)
    if (matches !== null) {
      part2 = matches.reduce(
        (acc, char) => acc + String.fromCharCode(parseInt(char, 16)),
        ''
      )
    }

    for (let i = 0; i < part2.length; i++) {
      char = part2.charCodeAt(i)
      if (char > 132) {
        codeStr = char.toString(10)
        firstCharCode = parseInt(codeStr.substring(0, codeStr.length - 2), 10)
        lastCharCode =
          parseInt(codeStr.substring(codeStr.length - 2, codeStr.length), 10) +
          31
        decryptedPart +=
          String.fromCharCode(firstCharCode) + String.fromCharCode(lastCharCode)
      } else {
        decryptedPart += part2.charAt(i)
      }
    }
    newUrl += decryptedPart
  }
  return new URL(newUrl)
}

/**
 * Détecte si une URL a été encryptée par `encrypt`
 * @param {URL} url Chaîne representant l'URL à analyser
 * @returns {boolean} `true` si l'URL est crypté avec la fonction `encrypt`
 */
export function isCrypted (url: URL): boolean {
  return url.href.includes('?EEEE')
}

/**
 * Télécharger un fichier connaissant l'URL
 *
 * __Exemple__
 * ```tsx
 * downloadFileFromURL(url, 'image.jpg');
 * ```
 *
 * __Paramètres__
 * @param {string} url URL du fichier à télécharger
 * @param {string} filename nom doné au fichier téléchargé
 * @see {@link https://blog.gitnux.com/code/javascript-download-file-from-url/}
 */
export async function downloadFileFromURL (url: string, filename: string) {
  try {
    // Fetch the file
    const response = await fetch(url)
    // Check if the request was successful
    if (response.status !== 200) {
      throw new Error(
        `Unable to download file. HTTP status: ${response.status}`
      )
    }

    // Get the Blob data
    const blob = await response.blob()

    // Create a download link
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = filename

    // Trigger the download
    document.body.appendChild(downloadLink)
    downloadLink.click()

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(downloadLink.href)
      document.body.removeChild(downloadLink)
    }, 100)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error downloading the file:', error.message)
    }
  }
}
