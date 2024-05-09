import { abs, acos, polynomialRoot, round } from 'mathjs'

import { colorToLatexOrHTML, ObjetMathalea2D } from '../../modules/2dGeneralites.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { egal, randint } from '../../modules/outils.js'
import { Courbe } from '../2d/courbes.js'
import { point, tracePoint } from '../2d/points.js'
import { Segment } from '../2d/segmentsVecteurs.js'
import { choice } from '../outils/arrayOutils'
import { signesFonction, variationsFonction } from './etudeFonction.js'
import { MatriceCarree } from './MatriceCarree.js'
import { rationnalise } from './outilsMaths.js'
import { Polynome } from './Polynome.js'
import Decimal from 'decimal.js'
import { rangeMinMax } from '../outils/nombres'

/**
 * Une fonction pour créer une Spline aléatoire
 * @param {number} n
 * @param {boolean} noeudsVisibles
 * @param {number} xMin
 * @param {number} step
 * @param {number} y0 ordonnée de départ de la spline aléatoire
 * @returns {Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}>}
 */
export function noeudsSplineAleatoire (n, noeudsVisibles, xMin = -n / 2, y0 = 0, step = 2) {
  const noeuds = []
  const isVisible = noeudsVisibles

  let y = y0
  let deriveeDroit = Math.cos(Math.random() * Math.PI) * randint(1, 2)
  for (let x = xMin; x < -xMin + 1; x += step) {
    const y0 = y
    noeuds.push({ x, y, deriveeGauche: deriveeDroit, deriveeDroit, isVisible })
    do {
      y = y + choice([-1, 1]) * randint(1, 2)
    } while (y > 5 || y < -5)
    do {
      deriveeDroit = Math.cos(Math.random() * Math.PI) * randint(0, 2)
    } while (deriveeDroit * (y - y0) < 0)
  }
  return noeuds
}

/**
 * Une fonction pour créer un nuage de noeuds différents d'un nuage passé en argument avec certaines options
 * @param {Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}>} noeudsF
 * @param {objet} options
 * @param {boolean} [options.symetrieH]
 * @param {boolean} [options.symetrieV]
 * @param {number} [options.echangeNoeuds]
 * @param {number} [options.decalVertical]
 * @param {number} [options.decalHorizontal]
 * @return {Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}>}
 */
export function modifieNoeuds (noeudsF, options) {
  const noeudsG = noeudsF.map(el => Object.assign({}, { x: el.x, y: el.y, deriveeGauche: el.deriveeGauche, deriveeDroit: el.deriveeDroit, isVisible: el.isVisible }))
  const nbNoeuds = noeudsF.length
  if (options.symetrieH) {
    for (let i = nbNoeuds; i > 0; i--) {
      noeudsG[nbNoeuds - i] = {
        x: noeudsF[nbNoeuds - i].x,
        y: noeudsF[i - 1].y,
        deriveeGauche: noeudsF[i - 1].deriveeDroit,
        deriveeDroit: noeudsF[i - 1].deriveeGauche,
        isVisible: noeudsF[i - 1].isVisible
      }
    }
  }
  if (options.symetrieV) {
    for (let i = 0; i < nbNoeuds; i++) {
      noeudsG[i] = {
        x: noeudsG[i].x,
        y: -noeudsG[i].y,
        deriveeGauche: -noeudsG[i].deriveeGauche,
        deriveeDroit: -noeudsG[i].deriveeDroit,
        isVisible: noeudsG[i].isVisible
      }
    }
  }
  if (options.echangeNoeuds) {
    const indices = rangeMinMax(0, nbNoeuds - 1)
    // le nombre de modifications doit être pair car on va échanger 2 par 2 et il doit y en avoir moins que nbNoeuds.
    const nbModifs = options.echangeNoeuds ?? 2 * Math.round(randint(2, nbNoeuds) / 2)
    const indiceDepartArrivee = []
    for (let i = 0, cpt = 0; i < nbModifs / 2 && cpt < 50;) {
      const choix1 = choice(indices, indiceDepartArrivee)
      const choix2 = choice(indices, indiceDepartArrivee)
      if (choix1 != null && choix2 != null) {
        indiceDepartArrivee.push(choix1, choix2)
        i++
      }
      cpt++
    }
    for (let i = 0; i < indiceDepartArrivee.length; i += 2) { // on va de 2 en 2 car les indices impairs sont les indices d'arrivée
      const depart = indiceDepartArrivee[i]
      const arrivee = indiceDepartArrivee[i + 1]
      // on n'échange que si l'indice du noeud concerné est avant celui d'arrivée
      const noeudInter = {
        x: noeudsG[arrivee].x,
        y: noeudsG[depart].y,
        deriveeGauche: noeudsG[depart].deriveeGauche,
        deriveeDroit: noeudsG[depart].deriveeDroit,
        isVisible: noeudsG[depart].isVisible
      }
      noeudsG[depart] = {
        x: noeudsG[depart].x,
        y: noeudsG[arrivee].y,
        deriveeGauche: noeudsG[arrivee].deriveeGauche,
        deriveeDroit: noeudsG[arrivee].deriveeDroit,
        isVisible: noeudsG[arrivee].isVisible
      }
      noeudsG[arrivee] = {
        x: noeudInter.x,
        y: noeudInter.y,
        deriveeGauche: noeudInter.deriveeGauche,
        deriveeDroit: noeudInter.deriveeDroit,
        isVisible: noeudInter.isVisible
      }
    }
  }
  if (options.decalVertical) {
    const offset = Number.isInteger(options.decalVertical) ? options.decalVertical : randint(-2, 2, 0)
    for (let i = 0; i < noeudsG.length; i++) {
      noeudsG[i] = {
        x: noeudsG[i].x,
        y: noeudsG[i].y + offset,
        deriveeGauche: noeudsG[i].deriveeGauche,
        deriveeDroit: noeudsG[i].deriveeDroit,
        isVisible: noeudsG[i].isVisible
      }
    }
  }
  if (options.decalHorizontal) {
    const offset = Number.isInteger(options.decalVertical) ? options.decalVertical : randint(-2, 2, 0)
    for (let i = 0; i < noeudsG.length; i++) {
      noeudsG[i] = {
        x: noeudsG[i].x + offset,
        y: noeudsG[i].y,
        deriveeGauche: noeudsG[i].deriveeGauche,
        deriveeDroit: noeudsG[i].deriveeDroit,
        isVisible: noeudsG[i].isVisible
      }
    }
  }
  return noeudsG
}
/**
 * Les noeuds sont des objets : {x,y, nombreDerive} attention à les donner dans l'ordre des x croissants
 * @author Jean-Claude Lhote
 */
export class Spline {
  /**
     * Passer au moins deux noeuds, sinon ça ne peut pas fonctionner d'où la valeur par défaut...
     * @param {Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}>} noeuds la liste des noeuds avec leurs nombres dérivés
     */
  constructor (noeuds) {
    this.polys = []

    if (noeuds == null || !Array.isArray(noeuds) || noeuds.length < 2) { // on ne peut pas interpoler une courbe avec moins de 2 noeuds
      window.notify('Spline : nombre de noeuds insuffisant', { noeuds })
      noeuds = [{ x: -3, y: -5, deriveeGauche: 0, deriveeDroit: 2, isVisible: false }, { x: 3, y: 0, deriveeGauche: -2, deriveeDroit: -2, isVisible: false }]
    }
    if (!trieNoeuds(noeuds)) {
      window.notify('Il y a un problème avec ces noeuds (peut-être un doublon ?) ', { noeuds })
      return
    } // les noeuds comportent une anomalie : deux valeur de x identiques

    for (let i = 0; i < noeuds.length - 1; i++) {
      const x0 = noeuds[i].x
      const y0 = noeuds[i].y
      const d0 = noeuds[i].deriveeDroit
      const x1 = noeuds[i + 1].x
      const y1 = noeuds[i + 1].y
      const d1 = noeuds[i + 1].deriveeGauche
      const matrice = new MatriceCarree([
        [x0 ** 3, x0 ** 2, x0, 1],
        [x1 ** 3, x1 ** 2, x1, 1],
        [3 * x0 ** 2, 2 * x0, 1, 0],
        [3 * x1 ** 2, 2 * x1, 1, 0]
      ])
      if (matrice.table.filter(ligne => ligne.filter(nombre => isNaN(nombre)).length !== 0).length > 0) {
        window.notify('Spline : Système impossible à résoudre il y a un problème avec les données ', {
          x0,
          y0,
          x1,
          y1,
          d0,
          d1
        })
        return
      }
      if (y0 + (x1 - x0) * d1 === y1 && d0 === d1) {
        const a = (y1 - y0) / (x1 - x0)
        const b = y0 - a * x0
        this.polys.push(new Polynome({ coeffs: [b, a, 0, 0] }))
      } else {
        const determinant = matrice.determinant()// c'est maintenant une FractionEtendue !
        if (determinant.valeurDecimale === 0) {
          window.notify('Spline : impossible de trouver un polynome ici car la matrice n\'est pas inversible, il faut revoir vos noeuds : ', {
            noeudGauche: noeuds[i],
            noeudDroit: noeuds[i + 1]
          })
          return
        }
        const matriceInverse = matrice.inverse()
        const vecteur = [y0, y1, d0, d1]
        this.polys.push(new Polynome({
          useFraction: true,
          coeffs: matriceInverse.multiplieVecteur(vecteur).reverse()
        }))
      }
    }
    this.noeuds = [...noeuds]
    this.n = this.noeuds.length
    this.x = this.noeuds.map((noeud) => noeud.x)
    this.y = this.noeuds.map((noeud) => noeud.y)
    this.visibles = this.noeuds.map((noeud) => noeud.isVisible) // On récupère la visibilité des noeuds pour la courbe
    this.n = this.y.length // on a n valeurs de y et donc de x, soit n-1 intervalles numérotés de 1 à n-1.
    // this.step = step // on en a besoin pour la dérivée...
    this.fonctions = this.#convertPolyFunction()
  }

  pointsOfSpline (nbPoints) {
    const points = []
    const stepPoints = (this.x[this.x.length - 1] - this.x[0]) / nbPoints // on fait 50 points ça devrait suffir...
    let x = this.x[0]
    do {
      points.push({ x, y: this.#image(x) })
      x += stepPoints
    } while (x <= this.x[this.x.length - 1])
    points.push({ x: this.x[this.x.length - 1], y: this.#image(this.x[this.x.length - 1]) })
    return points
  }

  /**
     * convertit les polynomes en fonctions
     * @returns {Function[]}
     */
  #convertPolyFunction () {
    const f = []
    for (let i = 0; i < this.n - 1; i++) {
      f.push(this.polys[i].fonction)
    }
    return f
  }

  /**
   * une méthode pour ajouter deux splines... et retourner une nouvelle spline !
   * Attention ! il faut que les deux splines aient exactement le même nombre de noeuds, et que les abscisses de ces noeuds soient les mêmes !
   * @param {Spline} s
   * @param {boolean} opposite
   */
  add (s, opposite) {
    if (this.n !== s.n) {
      throw Error('Veuillez vous assurer de donner deux splines compatibles')
    }
    if (this.x.filter(el => s.x.includes(el)).length !== this.n) {
      throw Error('Veuillez vous assurer de donner deux splines compatibles')
    }
    const noeuds = []
    for (let i = 0; i < this.n; i++) {
      const x = this.x[i]
      const y = this.y[i] + (opposite ? -1 : 1) * s.y[i]
      const deriveeGauche = this.noeuds[i].deriveeGauche + (opposite ? -1 : 1) * s.noeuds[i].deriveeGauche
      const deriveeDroit = this.noeuds[i].deriveeDroit + (opposite ? -1 : 1) * s.noeuds[i].deriveeDroit
      const isVisible = this.noeuds[i].isVisible && s.noeuds[i].isVisible
      noeuds.push({ x, y, deriveeGauche, deriveeDroit, isVisible })
    }
    return new Spline(noeuds)
  }

  /**
     * retourne les solutions de f(x) = y sur son domaine de définition
     * @param {number} y
     * @returns {number[]}
     */
  solve (y) {
    // On a eu des soucis plus loin dans polynome.add(-y) donc on s'assure que y est bien un number.
    const yArg = y
    y = Number(y)
    if (!isNaN(y)) {
      const antecedents = []
      for (let i = 0; i < this.polys.length; i++) {
        const polEquation = this.polys[i].add(-y) // Le polynome dont les racines sont les antécédents de y
        // Algebrite n'aime pas beaucoup les coefficients decimaux...
        try {
          const liste = polynomialRoot(...polEquation.monomes)
          for (const valeur of liste) {
            let arr
            if (typeof valeur === 'number') {
              arr = round(valeur, 3)
            } else { // complexe !
              const module = valeur.toPolar().r
              if (module < 1e-5) { // module trop petit pour être complexe, c'est 0 !
                arr = 0
              } else {
                const argument = valeur.arg()
                if (abs(argument) < 0.01 || abs((abs(argument) - acos(-1))) < 0.001) { // si l'argument est proche de 0 ou de Pi ou de -Pi
                  arr = round(valeur.re, 3) // on prend la partie réelle
                } else {
                  arr = null // c'est une vraie racine complexe, du coup, on prend null
                }
              }
            }
            if (arr !== null && arr >= this.x[i] && arr <= this.x[i + 1]) {
              if (!antecedents.includes(arr)) {
                antecedents.push(arr)
              }
            }
          }
        } catch (e) {
          window.notify('Erreur dans Spline.solve()' + e.message, { valeur_de_y: y })
        }
      }
      return antecedents
    } else {
      window.notify(`Spline.solve() a reçu un truc bizarre à la place d'un nombre : ${yArg} !`, { valeurArgument: yArg })
    }
  }

  /**
     * retourne un array décrivant les variations de la Spline sur son domaine de déf
     * à améliorer... la fonction variationsFonctions ne travaille pas proprement. on peut faire beaucoup mieux avec Spline
     * @returns {*[]|null}
     */
  variations (step) {
    return variationsFonction(this.derivee, this.noeuds[0].x, this.noeuds[this.n - 1].x, step ?? new FractionEtendue(1, 100))
  }

  /**
     * retourne les signes pris par la Spline sur son domaine de déf
     * à améliorer... la fonction signesFonctions ne travaille pas proprement. on peut faire beaucoup mieux avec Spline
     * @returns {T[]}
     */
  signes (step) {
    return signesFonction(this.fonction, this.noeuds[0].x, this.noeuds[this.n - 1].x, step ?? new FractionEtendue(1, 10), 0.001)
  }

  /**
     * retourne le nombre d'antécédents entiers trouvés pour une valeur y donnée
     * @param {number} y
     * @returns {number}
     */
  nombreAntecedentsEntiers (y) {
    const solutions = this.solve(y)
    const solutionsEntieres = solutions.filter(sol => Number.isInteger(sol))
    return solutionsEntieres.length
  }

  /**
     * retourne le nombre d'antécédents de y
     * @param {number} y
     * @returns {number}
     */
  nombreAntecedents (y) {
    const solutions = this.solve(y)
    return solutions.length
  }

  nombreAntecedentsMaximum (yMin, yMax, yentier = true, entiers = true) {
    let nbMax = 0
    for (let k = yMin; k < yMax; k += (yentier ? 1 : 0.1)) {
      if (entiers) {
        nbMax = Math.max(nbMax, this.nombreAntecedentsEntiers(k))
      } else {
        nbMax = Math.max(nbMax, this.nombreAntecedents(k))
      }
    }
    return nbMax
  }

  /**
     * Retourne une valeur de y (si trouvée) pôur laquelle il y a exactement n antécédents
     * @param {number} n
     * @param {number} yMin
     * @param {number} yMax
     * @returns {string|*}
     */
  trouveYPourNAntecedents (n, yMin, yMax, yEntier = true, antecedentsEntiers = true) {
    const candidats = []
    if (Number.isInteger(yMin) && Number.isInteger(yMax)) {
      if (yEntier) {
        for (let y = yMin; y <= yMax; y++) {
          if ((antecedentsEntiers && this.nombreAntecedentsEntiers(y) === n && this.nombreAntecedents(y) === n) || (!antecedentsEntiers && this.nombreAntecedents(y) === n)) {
            candidats.push(y)
          }
        }
      } else {
        // ici, on n'a pas trouvé avec y entier entre xMin et yMax, on recommence avec un pas de 0.1
        for (let y = yMin; y <= yMax; y += 0.1) {
          if ((antecedentsEntiers && this.nombreAntecedentsEntiers(y) === n && this.nombreAntecedents(y) === n) || (!antecedentsEntiers && this.nombreAntecedents(y) === n)) {
            candidats.push(y)
          }
        }
      }
    } else {
      window.notify('trouveYPourNAntecedentsEntiers() appelé avec des valeurs incorrectes', { n, yMin, yMax })
    }
    if (candidats.length < 1) {
      window.notify('trouveYPourNAntecedents() : Je n\'ai rien trouvé !', { n, yMin, yMax })
    }
    return choice(candidats) // normalement, il ne devrait jamais retourner cette valeur.
  }

  /**
     * retourne les min et max pour un repère contenant la courbe si ceux-ci sont sur des noeuds (c'est vivement consseillé)
     * Ne fonctionne pas si yMax ou yMin sont atteints entre deux noeuds
     * @returns {{yMin: number, yMax: number, xMax: number, xMin: number}}
     */
  trouveMaxes () {
    if (Array.isArray(this.noeuds) && this.noeuds.length > 0) {
      const xMin = Math.ceil(Math.min(...this.noeuds.map(el => el.x)))
      const yMin = Math.ceil(Math.min(...this.noeuds.map(el => el.y)))
      const xMax = Math.floor(Math.max(...this.noeuds.map(el => el.x)))
      const yMax = Math.floor(Math.max(...this.noeuds.map(el => el.y)))
      return { xMin, xMax, yMin, yMax }
    } else {
      window.notify('Spline.trouveMaxes() on demande ça alors que la Spline n\'a pas de noeuds !', { laSpline: JSON.stringify(this) })
      return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 }
    }
  }

  /**
     * retourne le minimum et le maximum de la fonction
     * @returns {{yMin: number, yMax: number}}
     */
  amplitude () {
    let yMin = 1000
    let yMax = -1000
    const derivees = this.derivees
    for (let i = 0; i < this.x.length - 1; i++) {
      const derivee = derivees[i]
      let maxLocal, minLocal
      if (derivee.deg === 2) {
        const a = Number(derivee.monomes[2])
        const b = Number(derivee.monomes[1])
        const c = Number(derivee.monomes[0])
        const delta = b ** 2 - 4 * a * c
        if (delta < 0) { // la dérivée ne s'annule pas donc la fonction est monotone du signe de a
          if (a > 0) { // la fonction est croissante don le max est atteint en x[i+1]
            maxLocal = this.y[i + 1]
            minLocal = this.y[i]
          } else {
            maxLocal = this.y[i]
            minLocal = this.y[i + 1]
          }
        } else if (delta === 0) { // la dérivée s'annule une seule fois mais il faut vérifier que c'est sur l'intervalle x[i] x[i+1]
          const racine = -b / 2 / a
          if (racine > this.x[i] && racine < this.x[i]) { // ça peut encore être un max ou un min !
            if (a > 0) { // c'est un minimum
              maxLocal = Math.max(this.y[i], this.y[i + 1])
              minLocal = this.#image(racine)
            } else { // c'est un maximum
              maxLocal = this.#image(racine)
              minLocal = Math.min(this.y[i], Number(this.y[i + 1]))
            }
          } else { // la racine n'est pas dans cet intervalle, donc la dérivée est monotone ici
            maxLocal = Math.max(this.y[i], Number(this.y[i + 1]))
            minLocal = Math.min(this.y[i], Number(this.y[i + 1]))
          }
        } else { // delta >0 deux racines !
          const ptiDelta = Math.sqrt(delta)
          const r1 = a > 0 ? (-b - ptiDelta) / 2 / a : (-b + ptiDelta) / 2 / a
          const r2 = a > 0 ? (-b + ptiDelta) / 2 / a : (-b - ptiDelta) / 2 / a
          if (this.x[i] < r1 && r1 < this.x[i + 1]) { // r1 est dans l'intervalle
            if (this.x[i] < r2 && r2 < this.x[i + 1]) { // r2 aussi !
              if (a > 0) { // croissant puis decroissant puis croissant : le max est soit en r1 soit en x[i+1]
                maxLocal = Math.max(this.#image(r1), this.y[i + 1])
                minLocal = Math.min(this.y[i], this.#image(r2))
              } else { // a<0 décroissant puis croissant puis décroissant
                minLocal = Math.min(this.#image(r1), this.y[i + 1])
                maxLocal = Math.max(this.y[i], this.#image(r2))
              }
            } else { // r1 est dedans mais pas r2
              if (a > 0) { // on a un max en r1 et le min est soit en x[i] soit en x[i+1]
                maxLocal = this.#image(r1)
                minLocal = Math.min(this.y[i], this.y[i + 1])
              } else { // minimum en r1, max en x[i] ou x[i+1]
                minLocal = this.#image(r1)
                maxLocal = Math.max(Number(this.y[i], this.y[i + 1]))
              }
            }
          } else { // r1 n'est pas dans l'intervalle mais peut-être r2 y est
            if (this.x[i] < r2 && r2 < this.x[i + 1]) {
              if (a > 0) { // on a le min en r2 et le max en x[i] ou en x[i+1]
                minLocal = this.#image(r2)
                maxLocal = Math.max(this.x[i], this.y[i + 1])
              } else { // on a le max en r2 et le min en x[i] ou en x[i+1]
                maxLocal = this.#image(r2)
                minLocal = Math.min(this.x[i], this.y[i + 1])
              }
            } else { // ni r1, ni r2 ne sont dans l'intervalle. La fonction est monotone
              if (a > 0) {
                if (r2 < this.x[i] || r1 > this.x[i + 1]) { // strictement croissante
                  maxLocal = this.y[i + 1]
                  minLocal = this.y[i]
                } else { // normalemennt r1<x[i] et r2>x[i+1] strictement décroissante
                  maxLocal = this.y[i]
                  minLocal = this.y[i + 1]
                }
              } else {
                if (r2 < this.x[i] || r1 > this.x[i + 1]) { // strictement décroissante
                  maxLocal = this.y[i]
                  minLocal = this.y[i + 1]
                } else { // normalemennt r1<x[i] et r2>x[i+1] strictement croissante
                  maxLocal = this.y[i + 1]
                  minLocal = this.y[i]
                }
              }
            }
          }
        }
      } else if (derivees[i].deg === 1) { // derivée affine, monotone croissante ou décroissante selon le signe de derivee[i].monomes[1]
        const a = derivees[i].monomes[1]
        if (a > 0) {
          maxLocal = this.y[i + 1]
          minLocal = this.y[i]
        } else {
          maxLocal = this.y[i]
          minLocal = this.y[i + 1]
        }
      } else { // constante !
        minLocal = this.y[i]
        maxLocal = this.y[i]
      }
      yMin = Math.min(yMin, minLocal)
      yMax = Math.max(yMax, maxLocal)
    }
    return { yMin, yMax }
  }

  /**
     * fournit la fonction à passer pour simuler une fonction mathématique du type (x)=>f(x)
     * @returns {function(*): number|*}
     */
  get fonction () {
    return x => this.#image(rationnalise(x))
  }

  /**
     * Retourne l'image de x par la fonction
     * @param {number} x
     * @returns {number}
     */
  #image (x) {
    if (typeof x !== 'number') {
      if (x instanceof FractionEtendue) {
        x = x.valeurDecimale
      } else if (x instanceof Decimal) {
        x = x.toNumber()
      }
    }
    let trouveK = false
    let k = 0
    for (let i = 0; i < this.n - 1; i++) {
      if (x >= this.x[i] && x <= this.x[i + 1]) {
        k = i
        trouveK = true
        break
      }
    }
    if (!trouveK) {
      const intervalle = `D = [${this.x[0]} ; ${this.x[this.n - 1]}]`
      window.notify('Spline: la valeur de x fournie n\'est pas dans lìntervalle de définition de la fonction', {
        x,
        intervalle
      })
      return NaN
    } else {
      return this.fonctions[k](x)
    }
  }

  /**
     * retourne un array de polynomes dérivés (degré 2) de ceux de la Spline utilisé par derivee() pour définir la dérivée pour tout x du domaine
     * la fonction est continue, mais les dérivées à gauche et à droite des noeuds ne seront pas identiques
     * donc on ne peut pas en faire une Spline.
     */
  get derivees () {
    const derivees = []
    for (let i = 0; i < this.polys.length; i++) {
      derivees.push(this.polys[i].derivee())
    }
    return derivees
  }

  /**
     * retourne une fonction dérivée de la spline sur son domaine de définition
     */
  get derivee () {
    const intervalles = []
    for (let i = 0; i < this.noeuds.length - 1; i++) {
      intervalles.push({ xG: this.noeuds[i].x, xD: this.noeuds[i + 1].x })
    }
    return (x) => {
      const index = intervalles.findIndex((intervalle) => x >= intervalle.xG && x <= intervalle.xD)
      return this.derivees[index].image(rationnalise(x))
    }
  }

  /** retourne une spline construite avec les valeurs dérivées aux noeuds de la spline.
   * Il faut impérativement que cette fonction soit continue donc les nombre dérivés à gauche et à droite en chacun des noeuds doivent être égaux !
   */
  get splineDerivee () {
    const noeudsDerivee/** Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}> */ = []
    for (const noeud of this.noeuds) {
      noeudsDerivee.push({ x: noeud.x, y: noeud.deriveeGauche, deriveeGauche: 0, deriveeDroit: 0, isVisible: noeud.isVisible })
    }
    return new Spline(noeudsDerivee)
  }

  /**
     * crée l'objet mathalea2d correspondant à la courbe tracée
     * @param {Repere} repere
     * @param {number} step
     * @param {string} color
     * @param {number} epaisseur
     * @param {boolean} ajouteNoeuds
     * @param {Object} optionsNoeuds
     * @returns {Trace}
     */
  courbe ({
    repere,
    step = 0.1,
    color = 'black',
    epaisseur = 1,
    ajouteNoeuds = false,
    optionsNoeuds = {}
  } = {}) {
    return new Trace(this, {
      repere,
      step,
      color,
      epaisseur,
      ajouteNoeuds,
      optionsNoeuds
    })
  }
}

/**
 * un raccourcis pour new Spline(noeuds)
 * @param {Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}>} noeuds
 * @returns {Spline}
 */
export function spline (noeuds) {
  return new Spline(noeuds)
}

/**
 * Fonction qui trie des noeuds pour Spline afin de les remettre dans l'ordre des x croissant
 * @param {Array<{x: number, y:number,nombreDerive:number}>} noeuds
 * @author Jean-Claude Lhote
 */
export function trieNoeuds (noeuds) {
  let xInter, yInter, dGaucheInter, dDroitInter, isVisibleInter
  for (let i = 0; i < noeuds.length - 1; i++) {
    for (let j = i + 1; j < noeuds.length; j++) {
      if (noeuds[i].x > noeuds[j].x) {
        xInter = noeuds[i].x
        yInter = noeuds[i].y
        dGaucheInter = noeuds[i].deriveeGauche
        dDroitInter = noeuds[i].deriveeDroit
        isVisibleInter = noeuds[i].isVisible
        noeuds[i].x = noeuds[j].x
        noeuds[i].y = noeuds[j].y
        noeuds[i].deriveeGauche = noeuds[j].deriveeGauche
        noeuds[i].deriveeDroit = noeuds[j].deriveeDroit
        noeuds[i].isVisible = noeuds[j].isVisible
        noeuds[j].x = xInter
        noeuds[j].y = yInter
        noeuds[j].deriveeGauche = dGaucheInter
        noeuds[j].deriveeDroit = dDroitInter
        noeuds[j].isVisible = isVisibleInter
      } else if (egal(noeuds[i].x, noeuds[j].x)) {
        return false
      }
    }
  }
  return true
}

/**
 * @class
 * crée la courbe de la spline (objet mathalea2d)
 */
export class Trace extends ObjetMathalea2D {
  /**
     * @param {Spline | SplineCatmullRom}spline La splineCatmulRom ou Spline dont on veut la Trace
     * @param {Repere} repere le repère associé
     * @param {number} step le pas entre deux points
     * @param {string} color la couleur
     * @param {number} epaisseur son épaisseur
     * @param {boolean} ajouteNoeuds si true, des points sont ajoutés aux endroits des noeuds
     * @param {Object} optionsNoeud
     */
  constructor (spline, {
    repere,
    step = 0.25,
    color = 'black',
    epaisseur = 1,
    ajouteNoeuds = true,
    optionsNoeuds = {}
  } = {}) {
    super()
    const objets = []
    const { xMin, xMax, yMin, yMax } = spline.trouveMaxes()
    this.bordures = [xMin, yMin, xMax, yMax]
    for (let i = 0; i < spline.n - 1; i++) {
      if (spline.polys[i].deg > 1) {
        objets.push(new Courbe(spline.fonctions[i], {
          repere,
          epaisseur,
          color,
          step,
          xMin: spline.x[i],
          xMax: spline.x[i + 1]
        }))
      } else {
        const s = new Segment(spline.x[i] * repere.xUnite, spline.y[i] * repere.yUnite, spline.x[i + 1] * repere.xUnite, spline.fonctions[i](spline.x[i + 1]) * repere.yUnite, color)
        s.epaisseur = epaisseur
        objets.push(s)
      }
      if (ajouteNoeuds && spline.visibles[i]) {
        const noeud = point(spline.x[i], spline.y[i])
        const traceNoeud = tracePoint(noeud)
        if (optionsNoeuds) {
          if (optionsNoeuds.color) {
            traceNoeud.color = colorToLatexOrHTML(optionsNoeuds.color)
            traceNoeud.couleurDeRemplissage = colorToLatexOrHTML(optionsNoeuds.color)
          }
          if (optionsNoeuds.epaisseur) {
            traceNoeud.epaisseur = optionsNoeuds.epaisseur
          }
          if (optionsNoeuds.style) {
            traceNoeud.style = optionsNoeuds.style
          }
          if (optionsNoeuds.taille) {
            traceNoeud.taille = optionsNoeuds.taille
          }
        }
        objets.push(traceNoeud)
      }
    }
    if (ajouteNoeuds && spline.visibles[spline.n - 1]) {
      const noeud = point(spline.x[spline.n - 1], spline.y[spline.n - 1])
      const traceNoeud = tracePoint(noeud)
      if (optionsNoeuds) {
        if (optionsNoeuds.color) {
          traceNoeud.color = colorToLatexOrHTML(optionsNoeuds.color)
          traceNoeud.couleurDeRemplissage = colorToLatexOrHTML(optionsNoeuds.color)
        }
        if (optionsNoeuds.epaisseur) {
          traceNoeud.epaisseur = optionsNoeuds.epaisseur
        }
        if (optionsNoeuds.style) {
          traceNoeud.style = optionsNoeuds.style
        }
        if (optionsNoeuds.taille) {
          traceNoeud.taille = optionsNoeuds.taille
        }
      }
      objets.push(traceNoeud)
    }
    this.svg = function (coeff) {
      let code = ''
      for (const objet of objets) {
        code += '\n\t' + objet.svg(coeff)
      }
      return code
    }
    this.tikz = function () {
      let code = ''
      for (const objet of objets) {
        code += '\n\t' + objet.tikz()
      }
      return code
    }
  }
}
