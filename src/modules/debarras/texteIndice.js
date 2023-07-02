import { context } from '../context.js'

/**
 * Gère l'écriture de l'indice en mode text (ne doit pas s'utiliser entre $ $)
 * Pour le mode maths (entre $ $) on utilisera tout _3 pour mettre un indice 3 ou _{42} pour l'indice 42.
 * @param {string} texte
 * @Example
 * // `(d${texteIndice(3)})`
 * @author Jean-Claude Lhote
 */
export function texteIndice (texte) {
  if (context.isHtml) {
    return `<sub>${texte}</sub>`
  } else {
    return `\\textsubscript{${texte}}`
  }
}
