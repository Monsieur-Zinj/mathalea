export function dropLatex (text: string, doNotDropCr: boolean = false) {
  text = text
    .replace(/\$[^$]*\$/g, '')
    // eslint-disable-next-line no-irregular-whitespace
    .replace(/[​  ]/g, ' ') // espaces bizarres remplacés par de vrais espaces
    .replace(/  +/g, ' ') // plusieurs espaces consécutifs remplacés par un seul
  if (doNotDropCr) return text
  return text.replace(/\n/g, '')
}

/**
 * extrait les $xxx$ d'un texte
 * @param {string} text
 * @return {string[]} les strings LaTeX contenues dans le texte (sans les $), tableau vide si y'en avait pas
 */
export function getMqChunks (text: string) {
  const re = /\$([^$]*)\$/g
  const mqChunks = []
  let chunks
  while ((chunks = re.exec(text)) !== null) { // faut tester !== null pour choper les chaînes vides
    mqChunks.push(chunks[1])
  }
  return mqChunks
}

/**
 * Retourne le texte sans retour chariot ni espace en double
 * @param {string} text
 */
export const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()

interface PluralOptions {
  tpl?: string;
  notIfZero?: boolean;
  plural?: string;
  singular?: string;
}

/**
 *  Remplace dans tpl %s par plural|singular et %d par nb (donc appelé avec un seul argument ça retourne s ou une chaîne vide)
 */
export const plural = (nb: number, { tpl = '', notIfZero = false, plural = 's', singular = '' }: PluralOptions = {}): string => {
  if (!Number.isInteger(nb) || nb < 0) {
    throw new Error('Invalid call (not a positive integer)')
  }
  if (notIfZero && !nb) {
    return ''
  }
  const str = nb > 1 ? plural : singular
  return tpl.replace(/%s/g, str).replace(/%d/, nb.toString())
}
