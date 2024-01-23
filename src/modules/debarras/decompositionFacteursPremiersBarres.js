import { decompositionFacteursPremiersArray } from '../../lib/outils/primalite'

/**
 * Renvoie la décomposition en produit de facteurs premiers d'un nombre avec les facteursABarrer barrés
 * @author Guillaume Valmont
 * @param {number} nombre
 * @param {number[]} facteursABarrer
 * @returns texte en LateX
 */
export function decompositionFacteursPremiersBarres (nombreADecomposer, facteursABarrer) {
  const decomposition = decompositionFacteursPremiersArray(nombreADecomposer)
  const facteursBarres = []
  let str = ''
  for (const nombre of decomposition) {
    let unNombreAEteBarre = false
    for (let i = 0; i < facteursABarrer.length; i++) {
      const facteurABarrer = facteursABarrer[i]
      if (nombre === facteurABarrer && !facteursBarres.includes(i) && !unNombreAEteBarre) {
        str += ` \\cancel{${facteurABarrer}} \\times `
        facteursBarres.push(i)
        unNombreAEteBarre = true
      }
    }
    if (!unNombreAEteBarre) {
      str += nombre + ' \\times '
    }
  }
  return str.slice(0, -8)
}
