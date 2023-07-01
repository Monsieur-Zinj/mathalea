import { abs, acos, det, inv, multiply, polynomialRoot, round } from 'mathjs'
import { Courbe, point, Segment, tracePoint } from '../2d.js'
import { colorToLatexOrHTML, ObjetMathalea2D } from '../2dGeneralites.js'
import { egal } from '../outils.js'
import { Polynome } from './Polynome.js'

/**
 * Les noeuds sont des objets : {x,y, nombreDerive} attention à les donner dans l'ordre des x croissants
 * @author Jean-Claude Lhote
 */
class Spline {
  /**
   * Passer au moins deux noeuds, sinon ça ne peut pas fonctionner
   * @param {Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}>} noeuds la liste des noeuds avec leurs nombres dérivés
   */
  constructor (noeuds) {
    this.polys = []
    if (noeuds.length < 2) { // on ne peut pas interpoler une courbe avec moins de 2 noeuds
      window.notify('Spline : nombre de noeuds insuffisant', { noeuds })
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
      const matrice = [
        [x0 ** 3, x0 ** 2, x0, 1],
        [x1 ** 3, x1 ** 2, x1, 1],
        [3 * x0 ** 2, 2 * x0, 1, 0],
        [3 * x1 ** 2, 2 * x1, 1, 0]
      ]
      if (matrice.filter(ligne => ligne.filter(nombre => isNaN(nombre)).length !== 0).length > 0) {
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
      if (det(matrice) === 0) {
        window.notify('Spline : impossible de trouver un polynome ici car la matrice n\'est pas inversible, il faut revoir vos noeuds : ', {
          noeudGauche: noeuds[i],
          noeudDroit: noeuds[i + 1]
        })
        return
      }

      const matriceInverse = inv(matrice)
      const vecteur = [y0, y1, d0, d1]
      this.polys.push(new Polynome({
        isUseFraction: false,
        coeffs: multiply(matriceInverse, vecteur).reverse().map(coef => round(coef, 3))
      }))
    }
    this.noeuds = [...noeuds]
    this.n = this.noeuds.length
    this.x = this.noeuds.map((noeud) => noeud.x)
    this.y = this.noeuds.map((noeud) => noeud.y)
    this.visible = this.noeuds.map((noeud) => noeud.isVisible) // On récupère la visibilité des noeuds pour la courbe
    this.n = this.y.length // on a n valeurs de y et donc de x, soit n-1 intervalles numérotés de 1 à n-1.
    // this.step = step // on en a besoin pour la dérivée...
    this.fonctions = this.convertPolyFunction()
    this.fonction = this.image.bind(this)
  }

  /**
   * convertit les polynomes en fonctions
   * @returns {Function[]}
   */
  convertPolyFunction () {
    const f = []
    for (let i = 0; i < this.n - 1; i++) {
      f.push(this.polys[i].fonction)
    }
    return f
  }

  /**
   * retourne les solutions de f(x) = y sur son domaine de définition
   * @param {number} y
   * @returns {number[]}
   */
  solve (y) {
    const antecedents = []
    for (let i = 0; i < this.polys.length; i++) {
      const polEquation = this.polys[i].add(-y) // Le polynome dont les racines sont les antécédents de y
      // Algebrite n'aime pas beaucoup les coefficients decimaux...
      try {
        const liste = polynomialRoot(...polEquation.monomes)
        for (const valeur of liste) {
          let arr
          if (typeof valeur === 'number') {
            arr = round(valeur, 1)
          } else { // complexe !
            const module = valeur.toPolar().r
            if (module < 1e-5) { // module trop petit pour être complexe, c'est 0 !
              arr = 0
            } else {
              if (abs(valeur.arg()) < 0.01 || (abs(valeur.arg() - acos(-1)) < 0.01)) { // si l'argument est proche de 0 ou de Pi
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
        console.log(e)
      }
    }
    return antecedents
  }

  nombreAntecedentsEntiers (y) {
    const solutions = this.solve(y)
    const solutionsEntieres = solutions.filter(sol => Number.isInteger(sol))
    return solutionsEntieres.length
  }

  nombreAntecedents (y) {
    const solutions = this.solve(y)
    return solutions.length
  }

  trouveYPourNAntecedentsEntiers (n, yMin, yMax) {
    if (Number.isInteger(yMin) && Number.isInteger(yMax)) {
      for (let y = yMin; y <= yMax; y++) {
        if (this.nombreAntecedentsEntiers(y) === n && this.nombreAntecedents(y) === n) {
          return y
        }
      }
    } else {
      window.notify('trouveYPourNAntecedentsEntiers() appelé avec des valeurs incorrectes', { n, yMin, yMax })
    }
    window.notify('trouveYPourNAntecedentsEntiers() : Je n\'ai rien trouvé !', { n, yMin, yMax })
    return 'aucune' // normalement, il ne devrait jamais retourner cette valeur.
  }

  /**
   * retourne les min et max pour un repère contenant la courbe
   * @returns {{yMin: number, yMax: number, xMax: number, xMin: number}}
   */
  trouveMaxes () {
    if (Array.isArray(this.noeuds) && this.noeuds.length > 0) {
      const xMin = Math.floor(Math.min(...this.noeuds.map(el => el.x)) - 1)
      const yMin = Math.floor(Math.min(...this.noeuds.map(el => el.y)) - 1)
      const xMax = Math.ceil(Math.max(...this.noeuds.map(el => el.x)) + 1)
      const yMax = Math.ceil(Math.max(...this.noeuds.map(el => el.y)) + 1)
      return { xMin, xMax, yMin, yMax }
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
      let maxLocal, minLocal
      if (derivees[i].deg === 2) {
        const a = derivees[i].monomes[2]
        const b = derivees[i].monomes[1]
        const c = derivees[i].monomes[0]
        const delta = b ** 2 - 4 * a * c
        if (delta < 0) { // la dérivée ne s'annule pas donc la fonction est monotone du signe de a
          if (a > 0) { // la fonction est croissante don le max est atteint en x[i+1]
            maxLocal = this.image(this.x[i + 1])
            minLocal = this.image(this.x[i])
          } else {
            maxLocal = this.image(this.x[i])
            minLocal = this.image(this.x[i + 1])
          }
        } else if (delta === 0) { // la dérivée s'annule une seule fois mais il faut vérifier que c'est sur l'intervalle x[i] x[i+1]
          const racine = -b / 2 / a
          if (racine > this.x[i] && racine < this.x[i]) { // ça peut encore être un max ou un min !
            if (a > 0) { // c'est un minimum
              maxLocal = Math.max(this.image(this.x[i]), this.image(this.x[i + 1]))
              minLocal = this.image(racine)
            } else { // c'est un maximum
              maxLocal = this.image(racine)
              minLocal = Math.min(this.image(this.x[i]), this.image(this.x[i + 1]))
            }
          } else { // la racine n'est pas dans cet intervalle, donc la dérivée est monotone ici
            maxLocal = Math.max(this.image(this.x[i]), this.image(this.x[i + 1]))
            minLocal = Math.min(this.image(this.x[i]), this.image(this.x[i + 1]))
          }
        } else { // delta >0 deux racines !
          const tiDelta = Math.sqrt(delta)
          const r1 = a > 0 ? (-b - tiDelta) / 2 / a : (-b + tiDelta) / 2 / a
          const r2 = a > 0 ? (-b + tiDelta) / 2 / a : (-b - tiDelta) / 2 / a
          if (this.x[i] < r1 && r1 < this.x[i + 1]) { // r1 est dans l'intervalle
            if (this.x[i] < r2 && r2 < this.x[i + 1]) { // r2 aussi !
              if (a > 0) { // croissant puis decroissant puis croissant : le max est soit en r1 soit en x[i+1]
                maxLocal = Math.max(this.image(r1), this.image(this.x[i + 1]))
                minLocal = Math.min(this.image(this.x[i]), this.image(r2))
              } else { // a<0 décroissant puis croissant puis décroissant
                minLocal = Math.min(this.image(r1), this.image(this.x[i + 1]))
                maxLocal = Math.max(this.image(this.x[i]), this.image(r2))
              }
            } else { // r1 est dedans mais pas r2
              if (a > 0) { // on a un max en r1 et le min est soit en x[i] soit en x[i+1]
                maxLocal = this.image(r1)
                minLocal = Math.min(this.x[i], this.image(this.x[i + 1]))
              } else { // minimum en r1, max en x[i] ou x[i+1]
                minLocal = this.image(r1)
                maxLocal = Math.max(this.x[i], this.image(this.x[i + 1]))
              }
            }
          } else { // r1 n'est pas dans l'intervalle mais peut-être r2 y est
            if (this.x[i] < r2 && r2 < this.x[i + 1]) {
              if (a > 0) { // on a le min en r2 et le max en x[i] ou en x[i+1]
                minLocal = this.image(r2)
                maxLocal = Math.max(this.x[i], this.image(this.x[i + 1]))
              } else { // on a le max en r2 et le min en x[i] ou en x[i+1]
                maxLocal = this.image(r2)
                minLocal = Math.min(this.x[i], this.image(this.x[i + 1]))
              }
            } else { // ni r1, ni r2 ne sont dans l'intervalle. La fonction est monotone
              if (a > 0) {
                if (r2 < this.x[i] || r1 > this.x[i + 1]) { // strictement croissante
                  maxLocal = this.image(this.x[i + 1])
                  minLocal = this.image(this.x[i])
                } else { // normalemennt r1<x[i] et r2>x[i+1] strictement décroissante
                  maxLocal = this.image(this.x[i])
                  minLocal = this.image(this.x[i + 1])
                }
              } else {
                if (r2 < this.x[i] || r1 > this.x[i + 1]) { // strictement décroissante
                  maxLocal = this.image(this.x[i])
                  minLocal = this.image(this.x[i + 1])
                } else { // normalemennt r1<x[i] et r2>x[i+1] strictement croissante
                  maxLocal = this.image(this.x[i + 1])
                  minLocal = this.image(this.x[i])
                }
              }
            }
          }
        }
      } else if (derivees[i].deg === 1) { // derivée affine, monotone croissante ou décroissante selon le signe de derivee[i].monomes[1]
        const a = derivees[i].monomes[1]
        if (a > 0) {
          maxLocal = this.image(this.x[i + 1])
          minLocal = this.image(this.x[i])
        } else {
          maxLocal = this.image(this.x[i])
          minLocal = this.image(this.x[i + 1])
        }
      } else { // constante !
        minLocal = this.image(this.x[i])
        maxLocal = this.image(this.x[i])
      }
      yMin = Math.min(yMin, minLocal)
      yMax = Math.max(yMax, maxLocal)
    }
    return { yMin, yMax }
  }

  get fonction () {
    return x => this.image(x)
  }

  image (x) {
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
      window.notify('SplineCatmullRom : la valeur de x fournie n\'est pas dans lìntervalle de définition de la fonction', {
        x,
        intervalle
      })
      return NaN
    } else {
      return this.fonctions[k](x)
    }
  }

  /**
   * retourne un array de polynomes dérivés (degré 2) de ceux de la Spline
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
 * crée la courbe de la spline
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
    step = 0.1,
    color = 'black',
    epaisseur = 1,
    ajouteNoeuds = true,
    optionsNoeuds = {}
  } = {}) {
    super()
    const objets = []
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
      if (ajouteNoeuds && spline.visible[i]) {
        const noeud = point(spline.x[i], spline.y[i])
        const traceNoeud = tracePoint(noeud)
        if (optionsNoeuds) {
          if (optionsNoeuds.color) {
            traceNoeud.color = colorToLatexOrHTML(optionsNoeuds.color)
            traceNoeud.couleurDeRemplissage = colorToLatexOrHTML(optionsNoeuds.color)
          }
          if (optionsNoeuds.epaisseur) { traceNoeud.epaisseur = optionsNoeuds.epaisseur }
          if (optionsNoeuds.style) { traceNoeud.style = optionsNoeuds.style }
          if (optionsNoeuds.taille) { traceNoeud.taille = optionsNoeuds.taille }
        }
        objets.push(traceNoeud)
      }
    }
    if (ajouteNoeuds && spline.visible[spline.n - 1]) {
      const noeud = point(spline.x[spline.n - 1], spline.y[spline.n - 1])
      const traceNoeud = tracePoint(noeud)
      if (optionsNoeuds) {
        if (optionsNoeuds.color) {
          traceNoeud.color = colorToLatexOrHTML(optionsNoeuds.color)
          traceNoeud.couleurDeRemplissage = colorToLatexOrHTML(optionsNoeuds.color)
        }
        if (optionsNoeuds.epaisseur) { traceNoeud.epaisseur = optionsNoeuds.epaisseur }
        if (optionsNoeuds.style) { traceNoeud.style = optionsNoeuds.style }
        if (optionsNoeuds.taille) { traceNoeud.taille = optionsNoeuds.taille }
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
