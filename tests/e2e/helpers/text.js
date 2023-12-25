/**
 * Vire les $xxx$ d'un texte
 * @param {string} text
 * @param {boolean} [doNotDropCr=false] passer true pour ne pas virer les \n de text
 * @return {string}
 */
export function dropLatex (text, doNotDropCr) {
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
export function getMqChunks (text) {
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
export const normalize = (text) => text.replace(/\s+/g, ' ').trim()

/**
 * Remplace dans tpl %s par plural|singular et %d par nb (donc appelé avec un seul argument ça retourne s ou une chaîne vide)
 * @param {number} nb
 * @param {Object} [options]
 * @param {string} [options.tpl=] Un template où on va substituer les %s et %d trouvés
 * @param {string} [options.plural=s] Préciser un pluriel autre que 's' si besoin
 * @param {string} [options.singular=] Préciser un singulier autre que '' si besoin
 * @param {boolean} [options.notIfZero=false] Passer true pour toujours retourner une chaîne vide si nb=0 (sans tpl ça sert donc à rien)
 * @return {string}
 */
export const plural = (nb, { tpl = '', notIfZero = false, plural = 's', singular = '' } = {}) => {
  if (!Number.isInteger(nb) || nb < 0) throw Error('Appel invalide (pas un entier positif)')
  if (notIfZero && !nb) return ''
  const str = nb > 1 ? plural : singular
  return tpl.replace(/%s/g, str).replace(/%d/, nb)
}
