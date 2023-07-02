/**
 *
 * @param {array} matrice M tableau 3x3 nombres
 * @param {array} vecteur A tableau 3 nombres
 * Fonction pouvant être utilisée en 2d avec des coordonnées homogènes
 * elle retourne le vecteur [x,y,z] résultat de M.A
 * @author Jean-Claude Lhote
 */

export function produitMatriceVecteur3x3 (matrice, vecteur) { // matrice est un tableau 3x3 sous la forme [[ligne 1],[ligne 2],[ligne 3]] et vecteur est un tableau de 3 nombres [x,y,z]
  const resultat = [0, 0, 0]
  for (let j = 0; j < 3; j++) { // Chaque ligne de la matrice
    for (let i = 0; i < 3; i++) { // On traite la ligne i de la matrice -> résultat = coordonnée i du vecteur résultat
      resultat[j] += matrice[j][i] * vecteur[i]
    }
  }
  return resultat
}

/**
 *
 * @param {array} matrice1 Matrice A
 * @param {array} matrice2 Matrice B
 * retourne la matrice A.B
 * @author Jean-Claude Lhote
 */

export function produitMatriceMatrice3x3 (matrice1, matrice2) { // les deux matrices sont des tableaux 3x3  [[ligne 1],[ligne 2],[ligne 3]] et le résultat est de la même nature.
  const resultat = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        resultat[j][i] += matrice1[j][k] * matrice2[k][i]
      }
    }
  }
  return resultat
}

/**
 *
 * @param {array} point
 * calcule les coordonnées d'un point donné par ses coordonnées en repère orthonormal en repère (O,I,J) tel que IOJ=60°
 * @author Jean-Claude Lhote
 */
export function changementDeBaseOrthoTri (point) {
  if (point.length === 2) point.push(1)
  return produitMatriceVecteur3x3([[1, -Math.cos(Math.PI / 3) / Math.sin(Math.PI / 3), 0], [0, 1 / Math.sin(Math.PI / 3), 0], [0, 0, 1]], point)
}

/**
 *
 * @param {array} point
 * Changement de base inverse de la fonction précédente
 * @author Jean-CLaude Lhote
 */
export function changementDeBaseTriOrtho (point) {
  if (point.length === 2) point.push(1)
  return produitMatriceVecteur3x3([[1, Math.cos(Math.PI / 3), 0], [0, Math.sin(Math.PI / 3), 0], [0, 0, 1]], point)
}
