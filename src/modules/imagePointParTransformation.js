import { matriceCarree } from '../lib/mathFonctions/MatriceCarree.js'

/**
 * Description
 * @param {any} transformation Entier déterminant la transformation voulue
 **1=symétrie / passant par O
 **2=symétrie \ passant par O
 **3=symétrie _ passant par O
 **4=symétrie | passant par O
 **5= rotation 90° anti-horaire centre O
 **6= rotation 90° horaire centre O
 **7= symétrie centrale centre O
 **11= rotation 60° anti-horaire centre O
 **12= rotation 60° horaire centre O
 **13= rotation 120° anti-horaire centre O
 **14= rotation 120° horaire centre O
 **8= translation coordonnées de O = vecteur de translation
 **9= homothétie. centre O rapport k
**10= homothétie. centre O rapport 1/k
 * @param {any} pointA Point dont on cherche l'image
 * @param {any} pointO Centre du repère local pour les symétries, centre pour les rotations et les homothéties
 * @param {any} vecteur=[] Vecteur de la translation
 * @param {number} rapport=1 rapport d'homothétie
 * @author Jean-Claude Lhote
 * @returns {number[]} Le point résultat
 */
export function imagePointParTransformation (transformation, pointA, pointO, vecteur = [], rapport = 1) {
  // pointA,centre et pointO sont des tableaux de deux coordonnées
  // on les rends homogènes en ajoutant un 1 comme 3ème coordonnée)
  // nécessite d'être en repère orthonormal...
  // Point O sert pour les rotations et homothéties en tant que centre (il y a un changement d'origine du repère en O pour simplifier l'expression des matrices de transformations.)

  if (pointA.length === 2) pointA.push(1)
  const x2 = pointO[0] // Point O' (origine du repère dans lequel les transformations sont simples (centre des rotations et point d'intersection des axes))
  const y2 = pointO[1]
  const u = vecteur[0] // (u,v) vecteur de translation.
  const v = vecteur[1]
  const k = rapport // rapport d'homothétie

  const matriceChangementDeRepere = matriceCarree([[1, 0, x2], [0, 1, y2], [0, 0, 1]])
  const matriceChangementDeRepereInv = matriceCarree([[1, 0, -x2], [0, 1, -y2], [0, 0, 1]])

  let matrice
  switch (transformation) {
    case 1: { // Symétrie par rapport à la première bissectrice
      const matriceSymObl1 = matriceCarree([[0, 1, 0], [1, 0, 0], [0, 0, 1]]) // x'=y et y'=x
      matrice = matriceSymObl1.multiply(matriceChangementDeRepereInv)
    }
      break
    case 2: { // symétrie par rapport à la deuxième bissectrice
      const matriceSymObl2 = matriceCarree([[0, -1, 0], [-1, 0, 0], [0, 0, 1]]) // x'=-y et y'=-x
      matrice = matriceSymObl2.multiply(matriceChangementDeRepereInv)
    }
      break
    case 3: { // Symétrie par rapport à l'axe des abscisses
      const matriceSymxxprime = matriceCarree([[1, 0, 0], [0, -1, 0], [0, 0, 1]]) // x'=x et y'=-y
      matrice = matriceSymxxprime.multiply(matriceChangementDeRepereInv)
    }
      break
    case 4: { // symétrie par rapport à l'axe des ordonnées
      const matriceSymYyPrime = matriceCarree([[-1, 0, 0], [0, 1, 0], [0, 0, 1]]) // x'=-x et y'=y
      matrice = matriceSymYyPrime.multiply(matriceChangementDeRepereInv)
    }
      break
    case 5: { // rotation 90 direct
      const matriceQuartDeTourDirect = matriceCarree([[0, -1, 0], [1, 0, 0], [0, 0, 1]]) // x'=-y et y'=x
      matrice = matriceQuartDeTourDirect.multiply(matriceChangementDeRepereInv)
    }
      break
    case 6: { // rotation quart de tour indirect
      const matriceQuartDeTourIndirect = matriceCarree([[0, 1, 0], [-1, 0, 0], [0, 0, 1]]) // x'=y et y'=-x
      matrice = matriceQuartDeTourIndirect.multiply(matriceChangementDeRepereInv)
    }
      break
    case 7: { // symétrie centrale
      const matriceSymCentrale = matriceCarree([[-1, 0, 0], [0, -1, 0], [0, 0, 1]]) // x'=-x et y'=-y
      matrice = matriceSymCentrale.multiply(matriceChangementDeRepereInv)
    }
      break
    case 11: { // rotation 60° direct
      const matriceRotation60Direct = matriceCarree([[0.5, -Math.sin(Math.PI / 3), 0], [Math.sin(Math.PI / 3), 0.5, 0], [0, 0, 1]])
      matrice = matriceRotation60Direct.multiply(matriceChangementDeRepereInv)
    }
      break
    case 12: { // rotation 60° indirect
      const matriceRotation60Indirect = matriceCarree([[0.5, Math.sin(Math.PI / 3), 0], [-Math.sin(Math.PI / 3), 0.5, 0], [0, 0, 1]])
      matrice = matriceRotation60Indirect.multiply(matriceChangementDeRepereInv)
    }
      break
    case 13: { // rotation 120° direct
      const matriceRotation120Direct = matriceCarree([[-0.5, -Math.sin(Math.PI / 3), 0], [Math.sin(Math.PI / 3), -0.5, 0], [0, 0, 1]])
      matrice = matriceRotation120Direct.multiply(matriceChangementDeRepereInv)
    }
      break
    case 14: { // rotation 120° indirect
      const matriceRotation120Indirect = matriceCarree([[-0.5, Math.sin(Math.PI / 3), 0], [-Math.sin(Math.PI / 3), -0.5, 0], [0, 0, 1]])
      matrice = matriceRotation120Indirect.multiply(matriceChangementDeRepereInv)
    }
      break
    case 8: { // translation
      const matriceTranslation = matriceCarree([[1, 0, u], [0, 1, v], [0, 0, 1]])
      matrice = matriceTranslation.multiply(matriceChangementDeRepereInv)
    }
      break
    case 9: { // homothétie rapport entier
      const matriceHomothetie = matriceCarree([[k, 0, 0], [0, k, 0], [0, 0, 1]])
      matrice = matriceHomothetie.multiply(matriceChangementDeRepereInv)
    }
      break
    case 10: { // homothetie rapport inverse d'entier
      const matriceHomothetie2 = matriceCarree([[1 / k, 0, 0], [0, 1 / k, 0], [0, 0, 1]])
      matrice = matriceHomothetie2.multiply(matriceChangementDeRepereInv)
    }
      break
  }
  const pointA1 = matrice.multiply(pointA)
  const pointA2 = matriceChangementDeRepere.multiply(pointA1)
  return pointA2.toArray()
}
