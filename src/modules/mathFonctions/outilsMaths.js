import { round } from 'mathjs'
import { ecritureAlgebrique } from '../../lib/outils/ecritures.js'
import { stringNombre } from '../../lib/outils/texNombre.js'
import FractionEtendue from '../FractionEtendue.js'
import { fraction } from '../fractions.js'
import { matriceCarree } from './MatriceCarree.js'
import { egal, randint } from '../outils.js'
import { TableauDeVariation } from '../TableauDeVariation.js'

/**
 * retourne une FractionEtendue à partir de son écriture en latex (ne prend pas en compte des écritures complexes comme
 * \dfrac{4+\dfrac{4}{5}}{5-\dfrac{3}{5}}
 * @param {string} fractionLatex la fraction écrite en latex (avec des accolades) exemple : \frac{5}{7} ou \dfrac{5}{7}
 * @returns {FractionEtendue}
 */
export function fractionLatexToMathjs (fractionLatex) {
  const parts = fractionLatex.split('{')
  const num = Number(parts[1].slice(0, -1))
  const den = Number(parts[2].slice(0, -1))
  return new FractionEtendue(num, den)
}
/**
 * delta(true) retourne dans un tableau des valeurs de a, b, c telles que b*b-4*a*c >0
 * delta(false) retourne dans un tableau des valeurs de a, b, c telles que b*b-4*a*c <0
 * @author Jean-Claude Lhote
 */
export function choisiDelta (positif) {
  let d, a, b, c
  do {
    a = randint(-5, 5, 0)
    b = randint(-5, 5, 0)
    c = randint(-5, 5, 0)
    d = b * b - 4 * a * c
  } while (positif ? d <= 0 : d >= 0)
  return [a, b, c]
}
/**
 * fonction qui retourne un polynome du second degré correctement écrit.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {string}
 */
export function expTrinome (a, b, c) {
  let expr = ''
  if (typeof a === 'number') {
    switch (a) {
      case 0:
        break
      case -1:
        expr += '-x^2'
        break
      case 1:
        expr += 'x^2'
        break
      default:
        expr += `${a}x^2`
        break
    }
  } else {
    expr += `${a}x^2`
  }
  if (typeof b === 'number') {
    switch (b) {
      case 0:
        break
      case -1:
        expr += '-x'
        break
      case 1:
        expr += '+x'
        break
      default:
        if (a === 0) {
          expr += `${b}`
        } else expr += `${ecritureAlgebrique(b)}x`
        break
    }
  } else {
    if (a === 0) {
      expr += `${b}x`
    } else {
      expr += `+${b}x`
    }
  }
  if (typeof c === 'number') {
    if (a === 0 && b === 0) {
      expr += `${c}`
    } else {
      if (c !== 0) {
        expr += `${ecritureAlgebrique(c)}`
      }
    }
  } else {
    expr += `+${c}`
  }
  return expr
}

/**
 * renvoie les solutions (intervalles) de f(x) < y (ou f(x)<=y ou f(x)>y ou f(x)>=y)
 * @param {function} fonction une fonction x=>f(x)
 * @param {number} y la valeur de y à atteindre
 * @param {number} xMin la borne gauche du domaine de définition
 * @param {number} xMax la borne droite du domaine de définition
 * @param {boolean} inferieur si true < si false >
 * @param {boolean} strict si true < ou > sinon <= ou >=
 * @param {Object} [options]
 * @param {number} options.step le pas de recherche en x.
 * @return {{borneG: {x: number, included: boolean, y: number}, borneD: {x: number, included: boolean, y: number}}[]} le ou les intervalles dans une liste
 */
export function inferieurSuperieur (fonction, y, xMin, xMax, inferieur = true, strict = false, { step = 0.001 } = {}) {
  const satisfy = function (image, y, inferieur, strict) {
    if (inferieur) {
      return strict ? y - image > 0 : y - image >= 0
    } else {
      return strict ? y - image < 0 : y - image <= 0
    }
  }
  const solutions = []
  let borneG = {}
  let borneD = {}
  for (let x = xMin; x <= xMax;) {
    const image = fonction(round(x, 3))
    if (borneG.x === undefined && satisfy(image, y, inferieur, strict)) { // c'est le premier x qui matche
      borneG = { x: round(x, 3), y: round(image, 3), included: !strict }
    } else if (satisfy(image, y, inferieur, strict)) { // les suivants qui matchent écrasent borneD
      borneD = { x: round(x, 3), y: round(image, 3), included: !strict }
    } else { // ça ne matche plus ou pas
      if (borneD.x !== undefined) { // il y a eu un intervalle, ça a matché et c'est terminé
        solutions.push({
          borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
          borneD: { x: borneD.x, y: borneD.y, included: borneD.included }
        })
        borneG = {}
        borneD = {} // on réinitialise pour le prochain intervalle
      } else if (borneG.x !== undefined) { // On n'a pas de borneD, mais on a une borneG, cas particulier du singleton
        solutions.push({
          borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
          borneD: { x: borneG.x, y: borneG.y, included: borneG.included }
        })
        borneG = {}
        borneD = {} // on réinitialise pour le prochain intervalle
      }
    }
    x += step // dans tous les cas, on avance
  }
  if (borneD.x !== undefined) { // le dernier intervalle n'a pas été mis dans les solutions car on est encore dedans
    solutions.push({
      borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
      borneD: { x: borneD.x, y: borneD.y, included: borneD.included }
    })
  }
  return solutions
}

/**
 *
 * @param {function} fonction du type (x)=>number
 * @param {number} xMin
 * @param {number} xMax
 * @param {number} step // fournir un step adapté à l'intervalle pour ne pas louper les valeurs particulières et pour ne pas ralentir le navigateur
 * @returns {*[]}
 */
export function signesFonction (fonction, xMin, xMax, step = 0.001) {
  const signes = []
  let xG, xD, signe, signeCourant
  for (let x = xMin; x <= xMax; x += step) {
    const image = fonction(x)
    signe = image < 0 ? '-' : image > 0 ? '+' : '0'
    if (xG == null) { // On entame un nouvel intervalle et il n'y en avait pas avant.
      xG = round(x, 2)
      xD = xG
      signeCourant = signe
    } else { // On est dans un intervalle commencé
      if (signe === signeCourant) {
        if (Math.abs(image) < 1e-12) { // Là, on est sur un zéro passé inaperçu
          xD = round(x, 2)
          signes.push({ xG, xD, signe })
          xG = round(x, 2)
          xD = xG
          signes.push({ xG, xD, signe: '0' })
          xG = null
          xD = null
          signeCourant = null
        } else { // Le signe n'a pas changé, on repousse xD
          xD = round(x, 2)
        }
      } else if (signe === '+') { // Le signe a changé il est devenu positif
        if (image < 1e-12) { // Là, on est sur un zéro passé inaperçu
          xD = round(x, 2)
          signes.push({ xG, xD, signe: signeCourant })
          xG = xD
          signes.push({ xG, xD, signe: '0' })
          xG = null
          xD = null
          signeCourant = null
        } else { // On est vraiment dans un nouveau secteur où la fonction est positive
          xD = round(x, 2)
          if (signeCourant === '-') {
            signes.push({ xG, xD, signe: signeCourant })
            xG = round(x, 2)
          }
          signeCourant = '+'
        }
      } else if (signe === '-') { // Le signe a changé, il est devenu négatif
        if (-image < 1e-12) { // Là, on est sur un zéro passé inaperçu
          xD = round(x, 2)
          signes.push({ xG, xD, signe: signeCourant })
          xG = round(x, 2)
          signes.push({ xG, xD, signe: '0' })
          xG = null
          xD = null
          signeCourant = null
        } else { // Le signe est vraiment devenu négatif
          xD = round(x, 2)
          if (signeCourant === '+') {
            signes.push({ xG, xD, signe: signeCourant })
            xG = round(x, 2)
          }
          signeCourant = '-'
        }
      } else { // Là le signe est devenu '0'
        xD = round(x, 2)
        signes.push({ xG, xD, signe: signeCourant })
        xG = round(x, 2)
        xD = xG
        signes.push({ xG, xD, signe: '0' })
        xD = null
        signeCourant = '0'
      }
    }
  }
  if (xD != null) {
    signes.push({ xG, xD, signe })
  }
  return signes
}

/**
 * retourne un tableau décrivant les variations de la fonction
 * Attention, la fonction fournie doit avoir une methode derivee(x) qui retourne la valeur de la dérivée en x
 * @param {(x)=>number} derivee
 * @param {number} xMin
 * @param {number} xMax
 * @param {number} step // fournir un step adapté à l'intervalle pour ne pas louper les valeurs particulières et pour ne pas ralentir le navigateur
 * @returns {null|*[]}
 */
export function variationsFonction (derivee, xMin, xMax, step) {
  if (derivee !== null && typeof derivee === 'function') {
    const signesDerivee = signesFonction(derivee, xMin, xMax, step)
    const variations = []
    for (const signe of signesDerivee) {
      if (signe.signe === '+') {
        variations.push({ xG: signe.xG, xD: signe.xD, variation: 'croissant' })
      } else if (signe.signe === '-') {
        variations.push({ xG: signe.xG, xD: signe.xD, variation: 'decroissant' })
      } // on ne fait rien pour signe.signe==='0'
    }
    return variations.filter((variation) => variation.xG !== variations.xD)
  } else {
    window.notify('variationsFonction() appelée avec autre chose qu\'une fonction', { derivee })
    return null
  }
}

/**
 * Fonction qui retourne les coefficients a et b de f(x)=ax²+bx+c à partir des données de x1,x2,f(x1),f(x2) et c.
 *
 * @author Jean-Claude Lhote
 */
export function resolutionSystemeLineaire2x2 (x1, x2, fx1, fx2, c) {
  const matrice = matriceCarree([[x1 ** 2, x1], [x2 ** 2, x2]])
  const determinant = matrice.determinant()
  const [a, b] = matrice.cofacteurs().transposee().multiplieVecteur([fx1 - c, fx2 - c])
  if (Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(determinant)) {
    const fa = fraction(a, determinant)
    const fb = fraction(b, determinant)
    return [[fa.numIrred, fa.denIrred], [fb.numIrred, fb.denIrred]]
  }
  return [[a / determinant, 1], [b / determinant, 1]]
}

/**
 * Fonction qui retourne les coefficients a, b et c de f(x)=ax^3 + bx² + cx + d à partir des données de x1,x2,x3,f(x1),f(x2),f(x3) et d (entiers !)
 * sous forme de fraction irréductible. Si pas de solution (déterminant nul) alors retourne [[0,0],[0,0],[0,0]]
 * @author Jean-Claude Lhote
 */
export function resolutionSystemeLineaire3x3 (x1, x2, x3, fx1, fx2, fx3, d) {
  const matrice = matriceCarree([[x1 ** 3, x1 ** 2, x1], [x2 ** 3, x2 ** 2, x2], [x3 ** 3, x3 ** 2, x3]])
  const y1 = fx1 - d
  const y2 = fx2 - d
  const y3 = fx3 - d
  const determinant = matrice.determinant()
  if (determinant === 0) {
    return [[0, 0], [0, 0], [0, 0]]
  }
  const [a, b, c] = matrice.cofacteurs().transposee().multiplieVecteur([y1, y2, y3])
  if (Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(c) && Number.isInteger(determinant)) { // ici on retourne un tableau de couples [num,den] entiers !
    const fa = fraction(a, determinant)
    const fb = fraction(b, determinant)
    const fc = fraction(c, determinant)
    return [
      [fa.numIrred, fa.denIrred],
      [fb.numIrred, fb.denIrred],
      [fc.numIrred, fc.denIrred]
    ]
    // pour l'instant on ne manipule que des entiers, mais on peut imaginer que ce ne soit pas le cas... dans ce cas, la forme est numérateur = nombre & dénominateur=1
  }
  return [
    [a / determinant, 1],
    [b / determinant, 1],
    [b / determinant, 1]
  ]
}

/**
 * Fonction qui cherche les minimas et maximas d'une fonction polynomiale f(x)=ax^3 + bx² + cx + d
 * retourne [] si il n'y en a pas, sinon retourne [[x1,f(x1)],[x2,f(x2)] ne précise pas si il s'agit d'un minima ou d'un maxima.
 * @author Jean-Claude Lhote
 */
export function chercheMinMaxFonction ([a, b, c, d]) {
  const delta = 4 * b * b - 12 * a * c
  if (delta <= 0) return [[0, 10 ** 99], [0, 10 ** 99]]
  const x1 = (-2 * b - Math.sqrt(delta)) / (6 * a)
  const x2 = (-2 * b + Math.sqrt(delta)) / (6 * a)
  return [[x1, a * x1 ** 3 + b * x1 ** 2 + c * x1 + d], [x2, a * x2 ** 3 + b * x2 ** 2 + c * x2 + d]]
}

export function tableauSignesFonction (fonction, xMin, xMax, { latex, substituts, step } = { latex: false, substituts: null, step: 0.001 }) {
  const signes = signesFonction(fonction, xMin, xMax, step)
  const initialValue = []
  const premiereLigne = []
  premiereLigne.push(...signes.reduce((previous, current) => previous.concat([stringNombre(current.xG, 2), 10]), initialValue))
  premiereLigne.push(stringNombre(signes[signes.length - 1].xD, 2), 10)
  if (substituts && Array.isArray(substituts)) {
    for (let i = 0; i < premiereLigne.length; i++) {
      const strNb = premiereLigne[i].replaceAll(/\s/g, '')
      const substitut = substituts.find((el) => stringNombre(el.antVal, 2).replaceAll(/\s/g, '') === strNb)
      if (substitut) {
        premiereLigne[i] = substitut.antTex
      }
    }
  }
  const tabLine = ['Line', 30]
  if (egal(fonction(xMin), 0)) {
    tabLine.push('z', 10)
  } else {
    tabLine.push('', 10)
  }
  for (const signe of signes) {
    tabLine.push(signe.signe, 10)
    tabLine.push('z', 10)
  }
  if (!egal(fonction(xMax), 0)) {
    tabLine.splice(-2, 2)
  }
  return new TableauDeVariation({
    tabInit: [
      [
        ['x', 2, 10], ['f(x)', 2, 10]
      ],
      premiereLigne
    ],
    tabLines: [tabLine],
    colorBackground: '',
    escpl: 3.5, // taille en cm entre deux antécédents
    deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
    lgt: 8, // taille de la première colonne en cm
    hauteurLignes: [15, 15],
    latex: latex ?? false
  })
}

/**
 *
 * @param {function} fonction
 * @param {function} derivee
 * @param {number} xMin
 * @param {number} xMax
 * @param {boolean} latex
 * @param {{antVal: number, antTex: string, imgVal: number, imgTex: string}[]} substituts
 * @param {number} step
 * @param {boolean} ligneDerivee Mettre à true pour faire apparaître la ligne de f'
 * @returns {TableauDeVariation}
 */
export function tableauVariationsFonction (fonction, derivee, xMin, xMax, { latex, substituts, step, ligneDerivee = false } = {}) {
  const signes = signesFonction(derivee, xMin, xMax, step).filter((signe) => signe.xG !== signe.xD)
  const premiereLigne = []
  const initalValue = []
  premiereLigne.push(...signes.reduce((previous, current) => previous.concat([stringNombre(current.xG, 2), 10]), initalValue))
  premiereLigne.push(stringNombre(signes[signes.length - 1].xD, 2), 10)
  if (substituts && Array.isArray(substituts)) {
    for (let i = 0; i < premiereLigne.length; i += 2) {
      const strNb = premiereLigne[i].replaceAll(/\s/g, '')
      const substitut = substituts.find((el) => stringNombre(el.antVal, 2).replaceAll(/\s/g, '') === strNb)
      if (substitut) {
        premiereLigne[i] = typeof substitut.antTex === 'string' ? substitut.antTex : substitut.antTex.toString()
      }
    }
  }
  const tabLineDerivee = ['Line', 30]
  if (egal(derivee(xMin), 0)) {
    tabLineDerivee.push('z', 10)
  } else {
    tabLineDerivee.push('', 10)
  }
  for (const signe of signes) {
    tabLineDerivee.push(signe.signe, 10)
    tabLineDerivee.push('z', 10)
  }
  if (!egal(derivee(xMax), 0)) {
    tabLineDerivee.splice(-2, 2)
  }

  const variations = variationsFonction(derivee, xMin, xMax, step)

  const tabLineVariations = ['Var', 10]
  const tabLinesImage = []
  let variationG = variations[0]
  let variationD
  if (variationG.variation === 'croissant') {
    tabLineVariations.push(`-/${stringNombre(fonction(variationG.xG), 3)}`, 10)
  } else {
    tabLineVariations.push(`+/${stringNombre(fonction(variationG.xG), 3)}`, 10)
  }
  for (let i = 0; i < variations.length - 1; i++) {
    variationG = variations[i]
    variationD = variations[i + 1]
    if (variationG.variation === variationD.variation) {
      tabLineVariations.push('R/', 10)
      tabLinesImage.push(['Ima', i + 1, i + 3, stringNombre(fonction(variationG.xD), 3)])
    } else {
      tabLineVariations.push(`${variationG.variation === 'croissant' ? '+' : '-'}/${stringNombre(fonction(variationG.xD), 3)}`, 10)
    }
  }
  if (variationD != null) {
    if (variationD.variation === 'croissant') {
      tabLineVariations.push(`+/${stringNombre(fonction(variationD.xD, 1), 3)}`, 10)
    } else {
      tabLineVariations.push(`-/${stringNombre(fonction(variationD.xD, 1), 3)}`, 10)
    }
  } else {
    tabLineVariations.push(`${variationG.variation === 'croissant' ? '+' : '-'}/${stringNombre(fonction(variationG.xD), 3)}`, 10)
  }
  if (substituts && Array.isArray(substituts)) {
    for (let i = 2; i < tabLineVariations.length; i += 2) {
      const strChunks = tabLineVariations[i].split('/')
      const substitut = substituts.find((el) => stringNombre(Number(el.imgVal), 3).replaceAll(/\s/g, '') === strChunks[1].replaceAll(/\s/g, ''))
      if (substitut) {
        tabLineVariations[i] = strChunks[0] + '/' + substitut.imgTex
      }
    }
  }
  const tabLines = ligneDerivee ? [tabLineDerivee] : []
  tabLines.push(tabLineVariations)
  if (tabLinesImage.length > 0) {
    tabLines.push(...tabLinesImage)
  }
  return new TableauDeVariation({
    tabInit: [
      ligneDerivee
        ? [
            ['x', 2, 10], ['f′(x)', 2, 10], ['f(x)', 2, 10]
          ]
        : [
            ['x', 2, 10], ['f(x)', 2, 10]
          ],
      premiereLigne
    ],
    tabLines,
    colorBackground: '',
    escpl: 4.5, // taille en cm entre deux antécédents
    deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
    lgt: 3, // taille de la première colonne en cm
    hauteurLignes: ligneDerivee ? [15, 15, 30] : [15, 30],
    latex: latex ?? false
  })
}
