import type { Question } from './types'

export function clean (text: string, options: ('dollars' | 'espaces' | 'virgules')[]) {
  text = text.replace('−', '-')
  if (options.includes('dollars')) text = text.replaceAll('$', '')
  if (options.includes('virgules')) text = text.replaceAll('{,}', ',')
  if (options.includes('espaces')) text = text.replaceAll(/\s/g, '').replaceAll('\\,', '')
  return text
}

/**
 * Permet d'obtenir des fractions que Katex affiche dans des balises <mn>
 */
export async function getFraction (question: Question) {
  const numLocator = question.locator.locator('span:nth-child(1) > span > span.katex-mathml > math > semantics > mrow > mstyle > mfrac > mn').first()
  const denLocator = question.locator.locator('span:nth-child(1) > span > span.katex-mathml > math > semantics > mrow > mstyle > mfrac > mn').nth(1)
  if (numLocator == null || denLocator == null) throw Error('Pas de fraction trouvée dans des balises <mn>')
  const num = await numLocator.textContent()
  const den = await denLocator.textContent()
  return { num, den }
}

/**
 * Extrait les $xxx$ d'un texte
 * @param {string} text
 * @return {string[]} les strings LaTeX contenues dans le texte (sans les $), tableau vide si y'en avait pas
 */
export function getLatex (text: string) {
  return text.match(/\$(.*?)\$/) ?? []
}

/**
 * Supprime les $xxx$ d'un texte
 * @param {string} text
 * @returns {string} texte sans les $xxx$
 */
export function dropLatex (text: string) {
  return text
    .replace(/\$[^$]*\$/g, '')
    // eslint-disable-next-line no-irregular-whitespace
    .replace(/[​  ]/g, ' ') // espaces bizarres remplacés par de vrais espaces
    .replace(/  +/g, ' ') // plusieurs espaces consécutifs remplacés par un seul
}
