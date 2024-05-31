import { matrice } from '../../lib/mathFonctions/Matrice.js'
import { egal } from '../outils.js'

/**
 * retourne les coefficients d'un polynome de degré 3 dont la dérivée s'annule en  x1 et x2 et tel que f(x1)=y1 et f(x2)=y2.
 * @author Jean-Claude Lhote
 */
export function cherchePolynomeDegre3aExtremaFixes (x1, x2, y1, y2) {
  const M = matrice([[x1 ** 3, x1 ** 2, x1, 1], [x2 ** 3, x2 ** 2, x2, 1], [3 * x1 ** 2, 2 * x1, 1, 0], [3 * x2 ** 2, 2 * x2, 1, 0]])
  const R = [y1, y2, 0, 0]
  if (!egal(M.determinant(), 0)) return M.inverse().multiplieVecteur(R)
  else return false
}
