import Exercice from '../ExerciceTs'

import { context } from '../../modules/context'
import figureApigeom from '../../lib/figureApigeom'
import { randint } from '../../modules/outils'
import Figure from 'apigeom'
import { choice } from '../../lib/outils/arrayOutils'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { courbe } from '../../lib/2d/courbes'
import { point } from '../../lib/2d/points'
import { droite } from '../../lib/2d/droites'
import { texNombre } from '../../lib/outils/texNombre'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { Polynome } from '../../lib/mathFonctions/Polynome'
import { interpolationDeLagrange } from '../../lib/mathFonctions/outilsMaths'
import { lettreMinusculeDepuisChiffre } from '../../lib/outils/outilString'
import Point from 'apigeom/src/elements/points/Point'
import { reduirePolynomeDegre3 } from '../../lib/outils/ecritures'

export const titre = 'Résoudre graphiquement une équation ou une inéquation'
export const dateDePublication = '29/10/2023'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Résoudre graphiquement une équation ou une inéquation
 *
 * @author Jean-Claude Lhote
 * Références
 */
export const uuid = '28997'
export const ref = '3F11-0'
export const dateDeCreation = '29/12/2023'

type TypesDeFonction = 'constante' | 'affine' | 'poly2' | 'poly3'

function compareEnsembles (e1: string, e2: string) {
  const cleanUp = (s: string) => s.replace('{.}', '.').replace(',', '.')
  const elements1 = cleanUp(e1).split(';')
  const elements2 = cleanUp(e2).split(';')
  if (elements1.length !== elements2.length) return false
  let ok = true
  for (let i = 0; i < elements1.length; i++) {
    if (Math.abs(Number(elements1[i].replace(',', '.')) - Number(elements2[i].replace(',', '.'))) > 0.1) {
      ok = false
      break
    }
  }
  return ok
}

/**
 * La fonction pour récupérer les intervalles de solutions
 * @param fonc
 * @param inferieur
 */
function chercheIntervalles (fonc: Polynome, soluces: number[], inferieur: boolean, xMin: number, xMax: number): string {
  const liste = [xMin, ...soluces, xMax]
  const values = liste.filter((el, i) => el !== liste[i + 1])
  const solutions: string[] = []
  for (let i = 0; i < values.length - 1; i++) {
    const middle = (values[i] + values[i + 1]) / 2
    const imageMiddle = fonc.image(middle)
    if ((imageMiddle < 0 && inferieur) || (!inferieur && imageMiddle > 0)) {
      solutions.push(`[${texNombre(values[i], 1)};${texNombre(values[i + 1], 1)}]`)
    }
  }
  return solutions.join('\\cup')
}

/**
 * La fonction de comparaison des intervalles pour l'interactif
 * @param e1
 * @param e2
 */
function compareIntervalles (e1: string, e2: string) {
  let result = true
  const cleanUp = (s: string) => s.replaceAll('{,}', '.').replaceAll(',', '.')
  e1 = cleanUp(e1)
  e2 = cleanUp(e2)
  const intervallesSaisie = e1.match(/\[-?\d.?\d?;-?\d.?\d?]/g)
  const intervallesReponse = e2.match(/\[-?\d.?\d?;-?\d.?\d?]/g)
  if (intervallesReponse != null && intervallesSaisie != null) {
    for (let i = 0; i < intervallesReponse.length; i++) {
      const [borneInfRep, borneSupRep] = intervallesReponse[i].match(/-?\d\.?\d?/g) as string[]
      const [borneInfSai, borneSupSai] = intervallesSaisie[i].match(/-?\d\.?\d?/g) as string[]
      if (Math.abs(Number(borneInfSai) - Number(borneInfRep)) > 0.1 || Math.abs(Number(borneSupSai) - Number(borneSupRep)) > 0.1) {
        result = false
      }
    }
    return result
  }
}

/**
 * retourne le yMin pour cadrer la figure
 * @param poly1
 * @param poly2
 */
function trouveMaxMin (poly1: Polynome, poly2: Polynome, np1: {
    x: number,
    y: number
}[], np2: {
    x: number,
    y: number
}[]): number {
  // on s'embête pas avec les constantes, elles sont toujours dans la fenêtre
  // on ne s'embête pas avec les affines, la encore, on sait comment elles se comportent quand elles sortent de la fenêtre
  // on va chercher donc le min et le max de fct1 et fct2 si ce sont au moins des polynomes de degré 2
  const fPrime1 = poly1.derivee()
  const fPrime2 = poly2.derivee()
  let yMin1: number
  let yMin2: number
  if (fPrime1.deg === 2) {
    const [c, b, a] = fPrime1.monomes
    const delta1 = b ** 2 - 4 * a * c
    if (delta1 > 0) { // deux racines dérivée négative entre les racines donc fonction croissante puis décroissante puis croissante ou l'inverse selon le signe de a
      const ptitDelta1 = Math.sqrt(delta1)
      const x1 = (-b - ptitDelta1) / (2 * a)
      const x2 = (-b + ptitDelta1) / (2 * a)
      yMin1 = a > 0 ? poly1.image(Math.max(x1, x2)) : poly1.image(Math.min(x1, x2))
    } else { // une seule racine la dérivée est du signe de a sur tout l'intervalle donc monotone, on ne cherche pas de min
      yMin1 = 0
    }
  } else if (fPrime1.deg === 1) { // poly de degré 2
    const [b, a] = fPrime1.monomes
    if (a < 0) { // la courbe est concave, on ne cherche pas de min
      yMin1 = 0
    } else {
      yMin1 = poly1.image(-b / a)
    }
  } else { // c'est une fonction affine, on ne cherche pas de min
    yMin1 = 0
  }
  if (fPrime2.deg === 2) {
    const [c, b, a] = fPrime2.monomes
    const delta2 = b ** 2 - 4 * a * c
    if (delta2 > 0) { // deux racines dérivée négative entre les racines donc fonction croissante puis décroissante puis croissante ou l'inverse selon le signe de a
      const ptitDelta2 = Math.sqrt(delta2)
      const x1 = (-b - ptitDelta2) / (2 * a)
      const x2 = (-b + ptitDelta2) / (2 * a)
      yMin2 = a > 0 ? poly2.image(Math.max(x1, x2)) : poly2.image(Math.min(x1, x2))
    } else { // une seule racine ou aucune la dérivée est du signe de a sur tout l'intervalle donc monotone, on ne cherche pas de min
      yMin2 = 0
    }
  } else if (fPrime2.deg === 1) { // poly de degré 2
    const [b, a] = fPrime2.monomes
    if (a < 0) { // la courbe est concave, on ne cherche pas de min
      yMin2 = 0
    } else {
      yMin2 = poly2.image(-b / a)
    }
  } else { // c'est une fonction affine, on ne cherche pas de min
    yMin2 = 0
  }

  return Math.min(yMin1, yMin2, ...np1.map(el => el.y), ...np2.map(el => el.y))
}

function renseigneFonction (poly: Polynome) {
  const func = poly.fonction
  const monomesNormalized = poly.monomes.slice()
  while (monomesNormalized.length < 4) {
    monomesNormalized.push(0)
  }
  const monomesInverses = monomesNormalized.reverse()
  const expr: string = reduirePolynomeDegre3(...monomesInverses.map((el: number) => Math.abs(el) < 1e-10 ? 0 : el)).replaceAll('\\,', '').replaceAll('{,}', '.')
  return { func, expr, poly }
}

class resolutionEquationInequationGraphique extends Exercice {
  // On déclare des propriétés supplémentaires pour cet exercice afin de pouvoir les réutiliser dans la correction
  figure!: Figure
  idApigeom!: string

  constructor () {
    super()
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    // Pour un exercice de type simple qui n'utilise pas le champ de réponse
    this.formatChampTexte = 'largeur15 inline'
    this.exoCustomResultat = true
    this.answers = {}
    this.sup2 = 10
    this.sup = 1
    this.besoinFormulaireNumerique = ['Choix des questions', 3, '1 : Résoudre une équation\n2 : Résoudre une inéquation\n3: Résoudre une équation et une inéquation']
    this.besoinFormulaire2Numerique = ['Choix des deux fonctions', 10,
      'Constante-affine\nConstante-degré2\nConstante-degré3\nAffine-affine\nAffine-degré2\nAffine-degré3\nDegré2-degré2\nDegré2-degré3\nDegré3-degré3\nMélange']
  }

  nouvelleVersion (numeroExercice: number): void {
    // on va chercher une spline aléatoire
    this.listeQuestions = []
    this.listeCorrections = ['']
    this.autoCorrection = []
    const aleaF1 = randint(1, 15)
    const f1 = lettreMinusculeDepuisChiffre(aleaF1)
    const f2 = lettreMinusculeDepuisChiffre(randint(1, 20, aleaF1))
    const choixFonctions = this.sup2 < 10 ? this.sup2 : randint(1, 9)
    let integraleDiff: number
    let f1Type: TypesDeFonction
    let f2Type: TypesDeFonction
    let fonction1: {
            func: (x: number) => number,
            expr: string,
            poly: Polynome
        }
    let fonction2: {
            func: (x: number) => number,
            expr: string,
            poly: Polynome
        }
    let texteCorr = ''
    const xbase = randint(-2, 2)
    const x0 = -4 + xbase
    const x1 = randint(-2, -1) + xbase
    const x2 = randint(1, 2) + xbase
    const x3 = 4 + xbase
    const decalAxe = randint(0, 2)
    const xMin = x0 - decalAxe - 1
    const xMax = xMin + 10
    let yMin
    let cpt = 0
    do { // Une boucle pour tester des valeurs et on sort si les courbes sont suffisamment distantes      }
      // On choisit les noeuds passants (il en faut 4 pour déterminer un poly3, qui peut le plus peut le moins !
      cpt++
      let y0: number
      let y1: number
      let y2: number
      let y3: number
      let vec1: {
                u: number,
                v: number
            }
      let vec2: {
                u: number,
                v: number
            }
      let vec3: {
                u: number,
                v: number
            }
            // Calcul des coordonnées d'un vecteur
      const vector = (x0: number, y0: number, x1: number, y1: number) => Object.assign({}, {
        u: x1 - x0,
        v: y1 - y0
      })
      // est-ce que deux vecteurs sont colinéaires ou à peu près colinéaires
      const areColineaires = (v1: {
                u: number,
                v: number
            }, v2: {
                u: number,
                v: number
            }) =>
        Boolean(Math.abs(v1.u * v2.v - v1.v * v2.u) < 0.1)
      if (this.sup2 < 7) { // il faut des points alignés et une pente pas trop importante
        do {
          y0 = randint(-2, 2)
          y1 = randint(-3, 3, y0)
        } while (Math.abs((y1 - y0) / (x1 - x0)) > 1)
        const a = (y1 - y0) / (x1 - x0)
        const b = y1 - a * x1
        y2 = a * x2 + b
        y3 = a * x3 + b
      } else {
        do {
          y0 = randint(-2, 2)
          y1 = randint(-3, 3, y0)
          y2 = randint(-4, 4, y1)
          y3 = randint(-2, 3, [y0, y2, y1])
          vec1 = vector(x0, y0, x1, y1)
          vec2 = vector(x0, y0, x2, y2)
          vec3 = vector(x0, y0, x3, y3)
        } while (areColineaires(vec1, vec2) || areColineaires(vec1, vec3)) // On cherche des points non alignés
      }

      // les noeuds passants qu'on trie dans l'ordre des x croissants
      // on initialise noeudsPassants1 et noeudsPassants2. Les 4 noeuds sont identiques, mais on va les changer selon le type de fonction

      const noeudsPassants1 = [{ x: x0, y: y0 },
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 }].sort((el1, el2) => el1.x - el2.x)
      const noeudsPassants2 = [{ x: x0, y: y0 },
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 }].sort((el1, el2) => el1.x - el2.x)

      switch (choixFonctions) { // On choisit les fonctions demandées
        case 1 : // constante et affine
          {
            f1Type = 'constante'
            f2Type = 'affine'
            // C'est l'index du point d'intersection
            const indexPI = randint(0, 1)
            // c'est l'index du point non commun
            const indexPNC = randint(0, 3, indexPI)
            // la fonction constante
            fonction1 = { // On prend un noeud au milieu de la liste pour éviter d'avoir une tangente en début de graphe.
              func: () => noeudsPassants1[indexPI].y,
              expr: `${noeudsPassants1[indexPI].y}`,
              poly: new Polynome({ rand: false, deg: 3, coeffs: [noeudsPassants1[indexPI].y, 0, 0, 0] })
            }
            // la fonction affine
            const noeudsFonction = noeudsPassants1.filter((el, i) => (i === indexPI || i === indexPNC))
            const poly = interpolationDeLagrange(noeudsFonction)
            fonction2 = renseigneFonction(poly)
          }
          break
        case 2 : { // constante et degré2
          f1Type = 'constante'
          f2Type = 'poly2'
          const indexPI1 = 0
          const indexPI2 = randint(1, 3)
          fonction1 = {
            func: () => noeudsPassants1[indexPI1].y,
            expr: `${noeudsPassants1[indexPI1].y}`,
            poly: new Polynome({ rand: false, deg: 3, coeffs: [noeudsPassants1[indexPI1].y, 0, 0, 0] })
          }
          noeudsPassants2[indexPI2].y = noeudsPassants1[0].y
          // c'est l'index du point non commun
          const indexNC1 = randint(0, 3, [indexPI1, indexPI2])
          noeudsPassants2[indexNC1].y = randint(-5, 5, [noeudsPassants1[indexPI1].y, noeudsPassants1[indexPI1].y - 1, noeudsPassants1[indexPI1].y + 1])
          const noeudsFonction = noeudsPassants2.filter((el, i) => (i === indexPI1 || i === indexPI2 || i === indexNC1))
          const poly = interpolationDeLagrange(noeudsFonction)
          fonction2 = renseigneFonction(poly) // la fonction constante
        }
          break
        case 3 : { // constante et degré3
          f1Type = 'constante'
          f2Type = 'poly3'
          const indexPI1 = randint(0, 1)
          const indexPI2 = randint(1, 3, indexPI1)
          const indexPI3 = randint(1, 3, [indexPI1, indexPI2])
          const indexNC = randint(0, 3, [indexPI1, indexPI2, indexPI3])
          fonction1 = { // On prend un noeud au milieu de la liste pour éviter d'avoir une tangente en début de graphe.
            func: () => noeudsPassants1[indexPI1].y,
            expr: `${noeudsPassants1[indexPI1].y}`,
            poly: new Polynome({ rand: false, deg: 3, coeffs: [noeudsPassants1[indexPI1].y, 0, 0, 0] })
          }
          for (const index of [indexPI1, indexPI2, indexPI3]) {
            noeudsPassants2[index].y = noeudsPassants1[indexPI1].y
          }
          noeudsPassants2[indexNC].y = randint(-5, 5, [noeudsPassants1[indexPI1].y, noeudsPassants1[indexPI1].y - 1, noeudsPassants1[indexPI1].y + 1])
          const poly = interpolationDeLagrange(noeudsPassants2)
          fonction2 = renseigneFonction(poly) // la fonction constante
        }
          break
        case 4 : // 2 affines
          f1Type = 'affine'
          f2Type = 'affine'
          {
            const indexPI1 = randint(0, 3)
            const indexNC1 = randint(0, 2, indexPI1)
            const indexNC2 = randint(0, 2, [indexPI1, indexNC1])
            const noeudsFonction1 = noeudsPassants1.filter((el, i) => (i === indexPI1 || i === indexNC1))
            noeudsPassants2[indexNC2].y = randint(-4, 4, [noeudsPassants1[indexPI1].y, noeudsPassants1[indexNC1].y])
            const noeudsFonction2 = noeudsPassants2.filter((el, i) => (i === indexPI1 || i === indexNC2))
            const poly1 = interpolationDeLagrange(noeudsFonction1)
            fonction1 = renseigneFonction(poly1) // la fonction constante
            const poly2 = interpolationDeLagrange(noeudsFonction2)
            fonction2 = renseigneFonction(poly2) // la fonction constante
          }
          break
        case 5 : // affine et degré2
          f1Type = 'affine'
          f2Type = 'poly2'
          {
            const indexPI = randint(0, 3)
            const indexPNC1 = randint(0, 3, indexPI)
            const indexPI2 = randint(0, 3, [indexPI, indexPNC1])
            const noeudsFonction1 = noeudsPassants1.filter((el, i) => (i === indexPI || i === indexPNC1))
            const poly1 = interpolationDeLagrange(noeudsFonction1)
            fonction1 = renseigneFonction(poly1) // la fonction affine
            for (const index of [indexPI, indexPI2]) {
              noeudsPassants2[index].y = fonction1.func(noeudsPassants2[index].x)
            }
            noeudsPassants2[indexPNC1].y = randint(-5, 5, [noeudsPassants1[indexPNC1].y, noeudsPassants2[0].y, noeudsPassants2[1].y, noeudsPassants2[2].y, noeudsPassants2[3].y])
            const noeudsFonction2 = noeudsPassants2.filter((el, i) => (i === indexPI || i === indexPNC1 || i === indexPI2))
            const poly2 = interpolationDeLagrange(noeudsFonction2)
            fonction2 = renseigneFonction(poly2) // la fonction constante
          }
          break
        case 6 : { // affine et degré3
          f1Type = 'affine'
          f2Type = 'poly3'
          const indexPI = randint(0, 3)
          const indexPI1 = randint(0, 3, indexPI)
          const indexPI2 = randint(0, 3, [indexPI, indexPI1])
          const indexPNC1 = randint(0, 3, [indexPI, indexPI1, indexPI2])
          const noeudsFonction1 = noeudsPassants1.filter((el, i) => (i === indexPI || i === indexPI1))
          const poly1 = interpolationDeLagrange(noeudsFonction1)
          fonction1 = renseigneFonction(poly1) // la fonction constante
          for (const index of [indexPI, indexPI1, indexPI2]) {
            noeudsPassants2[index].y = fonction1.func(noeudsPassants2[index].x)
          }
          noeudsPassants2[indexPNC1].y = randint(-5, 5, [noeudsPassants1[indexPNC1].y, noeudsPassants2[0].y, noeudsPassants2[1].y, noeudsPassants2[2].y, noeudsPassants2[3].y])
          const poly2 = interpolationDeLagrange(noeudsPassants2)
          fonction2 = renseigneFonction(poly2) // la fonction constante
        }
          break
        case 7 : // degré2 et degré2
          f1Type = 'poly2'
          f2Type = 'poly2'
          {
            const indexPI = randint(0, 3)
            const indexPI1 = randint(0, 3, indexPI)
            const indexPNC1 = randint(0, 3, [indexPI, indexPI1])
            const indexPNC2 = randint(0, 3, [indexPI, indexPNC1, indexPNC1])
            const noeudsFonction1 = noeudsPassants1.filter((el, i) => i === indexPI || i === indexPI1 || i === indexPNC1)
            const noeudsFonction2 = noeudsPassants2.filter((el, i) => i === indexPI || i === indexPNC1 || i === indexPNC2)
            const poly1 = interpolationDeLagrange(noeudsFonction1)
            fonction1 = renseigneFonction(poly1) // la fonction constante
            const poly2 = interpolationDeLagrange(noeudsFonction2)
            fonction2 = renseigneFonction(poly2) // la fonction constante
          }
          break
        case 8 : // degré2 et degré3
          f1Type = 'poly2'
          f2Type = 'poly3'
          {
            const indexPI1 = randint(0, 3)
            const indexPI2 = randint(0, 3, indexPI1)
            const indexPNC1 = randint(0, 3, [indexPI1, indexPI2])
            const noeudsFonction1 = noeudsPassants1.filter((el, i) => i === indexPI1 || i === indexPNC1 || i === indexPI2)
            const poly1 = interpolationDeLagrange(noeudsFonction1)
            fonction1 = renseigneFonction(poly1) // la fonction constante
            const poly2 = interpolationDeLagrange(noeudsPassants2)
            fonction2 = renseigneFonction(poly2) // la fonction constante
          }
          break
        case 9 : // degré3 et degré3
          f1Type = 'poly3'
          f2Type = 'poly3'
          {
            const poly1 = interpolationDeLagrange(noeudsPassants1)
            fonction1 = renseigneFonction(poly1)
            // on modifie la valeur y de l'un des points passants qui devient non passant pour la fonction1
            const indexPNC1 = randint(0, 3)
            const ordonnees = noeudsPassants1.map(el => el.y)
            let newY: number
            do {
              newY = (noeudsPassants1[indexPNC1].y > 0 ? -1 : 1) * randint(-4, 4, ordonnees)
            } while (Math.abs(newY - noeudsPassants1[indexPNC1].y) > 5)
            noeudsPassants2[indexPNC1].y = newY
            const poly2 = interpolationDeLagrange(noeudsPassants2)
            fonction2 = renseigneFonction(poly2) // la fonction constante
          }
          break
        default: // affine et affine (c'est le this.sup par défaut) Le code du case 4 est dupliqué ici pour avoir une valeur par défaut au cas où
          f1Type = 'affine'
          f2Type = 'affine'
          {
            const indexPI = randint(0, 3)
            const indexPNC1 = randint(0, 3, indexPI)
            const indexPNC2 = randint(0, 3, [indexPI, indexPNC1])
            const noeudsFonction1 = noeudsPassants1.filter((el, i) => i === indexPI || i === indexPNC1)
            const noeudsFonction2 = noeudsPassants2.filter((el, i) => i === indexPI || i === indexPNC2)
            const poly1 = interpolationDeLagrange(noeudsFonction1)
            fonction1 = renseigneFonction(poly1) // la fonction constante
            const poly2 = interpolationDeLagrange(noeudsFonction2)
            fonction2 = renseigneFonction(poly2) // la fonction constante
          }

          break
      }
      const integrales = []
      // on calcule la différence des polys, on intègre entre -5 et 0 et entre 0 et 5
      const poly = fonction1.poly
      if (poly == null) { // noremalement, ça ne doit pas arriver car la seule à ne pas avoir la propriété poly est la spline qui est éliminée
        // d'ailleurs typescript le sait puisque dans le test, si on met f1Type !== 'spline' il nous fait remarquer que c'est pas la peine !
        // donc ce test est là juste pour que typescript ne me dise pas que fonctions[0].poly peut être undefined
        throw Error('la fonction 1 n\'a pas de polynôme alors qu\'elle devrait')
      }
      const diff = poly.multiply(-1).add(fonction2.poly)
      for (let k = 0; k < 10; k++) {
        integrales.push(Math.abs(diff.image(x0 + k) - diff.image(x0 - 1 + k)))
      }
      integraleDiff = Math.min(...integrales)
      yMin = Math.min(trouveMaxMin(fonction1.poly, fonction2.poly, noeudsPassants1, noeudsPassants2), -1) - 0.3
    } while (integraleDiff < 0.2 && cpt < 50)
    const polyDiff = fonction1.poly.add(fonction2.poly.multiply(-1))
    this.figure = new Figure({ xMin: x0 - decalAxe - 1.2, yMin, width: 312, height: 378 })
    this.figure.create('Grid')
    this.figure.options.limitNumberOfElement.set('Point', 1)

    // on s'occupe de la fonction 1 et du point mobile dessus on trace tout ça.
    // Maintenant, la fonction1 n'est jamais une spline !
    let courbeF
    let M
    if (f1Type === 'constante' || f1Type === 'affine') {
      const a = fonction1.poly.monomes[1]
      const b = fonction1.poly.monomes[0]
      console.log(a + 'x+' + b)
      const B = new Point(this.figure, {
        x: x0 - 1 - decalAxe,
        y: (x0 - 1 - decalAxe) * a + b,
        isVisible: false
      })
      const A = new Point(this.figure, {
        x: (x3 + 1 - decalAxe),
        y: (x3 + 1 - decalAxe) * a + b,
        isVisible: false
      })
      const d = this.figure.create('Segment', { point1: B, point2: A })
      d.color = 'blue'
      d.thickness = 2
      d.isDashed = true
      M = this.figure.create('PointOnLine', { line: d })
    } else {
      courbeF = this.figure.create('Graph', {
        expression: fonction1.expr as string,
        color: 'blue',
        thickness: 2,
        fillOpacity: 0.5,
        xMin,
        xMax: x3 + 1.05 - decalAxe,
        isDashed: true
      })
      M = this.figure.create('PointOnGraph', { graph: courbeF })
    }
    // M.draw()
    M.label = 'M'
    M.shape = 'x'
    M.createSegmentToAxeX()
    M.createSegmentToAxeY()
    const textX = this.figure.create('DynamicX', { point: M })
    const textY = this.figure.create('DynamicY', { point: M })
    textX.dynamicText.maximumFractionDigits = 1
    textY.dynamicText.maximumFractionDigits = 1
    let x
    let y
    let trouve = false
    // On cherche à placer Cf
    for (x = xMin; x < xMax && !trouve; x++) {
      if (Math.abs(fonction1.poly.image(x)) < 5) {
        y = fonction1.poly.image(x)
        trouve = true
      }
    }
    if (!trouve) {
      x = xMax
      if (fonction1.poly.image(4) < 0) {
        y = -5
      } else {
        y = 5
      }
    }
    if (f2Type === 'affine') {
      const a = fonction2.poly.monomes[1]
      const b = fonction2.poly.monomes[0]
      const B = new Point(this.figure, { x: (x0 - 1 - decalAxe), y: a * (x0 - 1 - decalAxe) + b, isVisible: false })
      const A = new Point(this.figure, { x: (x3 + 1 - decalAxe), y: a * (x3 + 1 - decalAxe) + b, isVisible: false })
      const d = this.figure.create('Segment', { point1: B, point2: A })
      d.color = 'red'
      d.thickness = 2
      d.isDashed = false
    } else {
      this.figure.create('TextByPosition', { x: x - 0.5, y: y + 0.5, text: `$\\mathscr{C_${f1}}$`, color: 'blue' })
      this.figure.create('Graph', {
        expression: fonction2.expr as string,
        color: 'red',
        thickness: 2,
        fillOpacity: 0.5,
        xMin: x0 - 1 - decalAxe,
        xMax: x3 + 1.05 - decalAxe
      })
    }
    trouve = false
    for (x = xMin; x > -5 && !trouve; x--) {
      if (Math.abs(fonction2.poly.image(x)) < 5) {
        trouve = true
        y = fonction2.poly.image(x)
      }
    }
    if (!trouve) {
      x = xMin
      if (fonction2.poly.image(-4) < 0) {
        y = -5
      } else {
        y = 5
      }
    }
    this.figure.create('TextByPosition', { x: x + 0.5, y: y + 0.5, text: `$\\mathscr{C_${f2}}$`, color: 'red' })
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    // De -6.3 à 6.3 donc width = 12.6 * 30 = 378
    let enonce = `On considère les fonctions $${f1}$ et $${f2}$ définies sur $[${texNombre(xMin, 0)};${texNombre(xMax, 0)}]$ et dont on a représenté ci-dessous leurs courbes respectives.<br><br>`
    let numero = 1
    // let diff
    let soluces: number[]
    const inferieur = choice([true, false])

    soluces = []
    if (fonction1.poly == null && fonction2.poly == null) throw Error('Un problème avec l\'un des polynome')

    const racines = polyDiff.racines()
    if (racines == null) throw Error(`Il n'y aurait pas de points d'intersection !!! polyDiff = ${polyDiff.toLatex()}`)
    const racinesArrondies = racines.map(el => Number(el.toFixed(1)))
    for (let n = 0; n < racinesArrondies.length; n++) {
      const image = fonction1.func(racinesArrondies[n])
      const isInside = racinesArrondies[n] < xMax && racinesArrondies[n] > xMin
      const isInside2 = image > yMin && image < yMin + 12
      if (isInside && isInside2) {
        soluces.push(racinesArrondies[n])
      }
    }
    soluces = Array.from(new Set(soluces)) as number[]
    soluces = soluces.sort((a: number, b: number) => a - b)
    if (this.sup === 1 || this.sup === 3) {
      enonce += `${String(numero)}. Résoudre graphiquement $${f1}(x)${miseEnEvidence('~=~', 'black')}${f2}(x)$.<br>`
      enonce += 'Les solutions doivent être rangées par ordre croissant et séparées par un point-virgule.<br>'
      texteCorr += `${String(numero)}. L'ensemble de solutions de l'équation correspond aux abscisses des points d'intersection des deux courbes soit : $\\{${soluces.map(el => texNombre(el, 1)).join(';')}\\}$<br><br>`
      numero++
    }
    if (soluces != null) {
      if (this.sup === 1 || this.sup === 3) {
        enonce += 'L\'ensemble de solutions de l\'équation est : ' + remplisLesBlancs(this, 0, '\\{%{soluces}\\}', 'inline lycee', '\\ldots\\ldots') + '<br><br>' // '$\\{' + Array.from(soluces).join(' ; ') + '\\}$'//
        setReponse(this, 0, {
          soluces: {
            value: Array.from(soluces).join(';'),
            compare: compareEnsembles
          }
        }, { formatInteractif: 'fillInTheBlank' })
      }
    }
    if (this.sup === 2 || this.sup === 3) {
      enonce += `${numero}. Résoudre graphiquement $${f1}(x)${inferieur ? miseEnEvidence('\\leqslant', 'black') : miseEnEvidence('~\\geqslant~', 'black')}${f2}(x)$.<br>`
      if (this.interactif) {
        enonce += 'On peut taper \'union\' au clavier ou utiliser le clavier virtuel pour le signe $\\cup$.<br>'
      }
      enonce += 'L\'ensemble des solutions de l\'inéquation est : ' + remplisLesBlancs(this, 1, '%{solucesIneq}', 'inline lycee', '\\ldots\\ldots') + '<br><br>'
      const soluces2: string = chercheIntervalles(polyDiff, soluces, inferieur, xMin, xMin + 10)

      // enonce += '$' + soluces2 + '$'
      setReponse(this, 1, {
        solucesIneq: {
          value: soluces2,
          compare: compareIntervalles
        }
      }, { formatInteractif: 'fillInTheBlank' })
      texteCorr += `${String(numero)}. Pour trouver l'ensemble des solutions de l'inéquation, on regarde les portions où la courbe $${miseEnEvidence('\\mathscr{C_' + f1 + '}', 'blue')}$ est située ${inferieur ? 'en-dessous' : 'au-dessus'} de la  courbe $${miseEnEvidence('\\mathscr{C_' + f2 + '}', 'red')}$.<br>`
      texteCorr += `On lit les intervalles correspondants sur l'axe des abscisses : $${soluces2}$.<br><br>`
    }
    this.figure.setToolbar({ tools: ['DRAG'], position: 'top' })
    if (this.figure.ui) this.figure.ui.send('DRAG')
    // Il est impératif de choisir les boutons avant d'utiliser figureApigeom
    const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure: this.figure })
    this.figure.isDynamic = true
    this.figure.divButtons.style.display = 'flex'
    if (context.isHtml) {
      this.listeQuestions = [enonce + emplacementPourFigure]
    } else {
      const repere = new RepereBuilder({ xMin: -6.3, yMin: -6.3, xMax: 6.3, yMax: 6.3 })
        .setGrille({
          grilleX: {
            dx: 1, xMin: -6, xMax: 6
          },
          grilleY: {
            dy: 1, yMin: -6, yMax: 6
          }
        })
        .setGrilleSecondaire({
          grilleX: {
            dx: 0.2, xMin: -6, xMax: 6
          },
          grilleY: { dy: 0.2, yMin: -6, yMax: 6 }
        })
        .buildStandard()
      let courbe1, courbe2
      if (f1Type === 'constante' || f1Type === 'affine') {
        const M = point(-6, fonction1.func(-6), '')
        const N = point(6, fonction1.func(6), '')
        courbe1 = droite(M, N)
      } else {
        courbe1 = courbe(fonction1.func, { repere })
      }
      courbe1.color = colorToLatexOrHTML('blue')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      courbe1.epaisseur = 2
      if (f2Type === 'affine') {
        const M = point(-6, fonction2.func(-6), '')
        const N = point(6, fonction2.func(6), '')
        courbe2 = droite(M, N)
      } else {
        courbe2 = courbe(fonction2.func, { repere })
      }
      courbe1.color = colorToLatexOrHTML('blue')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      courbe1.epaisseur = 2
      const courbes = [courbe1, courbe2]
      this.listeQuestions = [enonce + mathalea2d(Object.assign({}, fixeBordures([...repere.objets, ...courbes])))]
    }
    this.listeCorrections = [texteCorr]
  }
}

export default resolutionEquationInequationGraphique
