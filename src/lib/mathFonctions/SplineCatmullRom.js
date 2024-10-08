/**
 * Fonction qui trie des couples de coordonnées pour les remettre dans l'ordre des x croissant
 * inutilisée
 * @author Jean-Claude Lhote
 */
/* export function trieCouples (x, y) {
  let xInter, yInter
  for (let i = 0; i < x.length - 1; i++) {
    for (let j = i + 1; j < x.length; j++) {
      if (x[i] > x[j]) {
        xInter = x[i]
        x[i] = x[j]
        x[j] = xInter
        yInter = y[i]
        y[i] = y[j]
        y[j] = yInter
      } else if (egal(x[i], x[j])) {
        console.log('Deux couples ont la même valeur de x ! je ne peux pas trier')
        return false
      }
    }
  }
  return true
}
*/
import { abs, acos, polynomialRoot, round } from 'mathjs'
import { Polynome } from './Polynome.js'
import { Trace } from './Spline.js'

/**
 * inspiré de https://yahiko.developpez.com/tutoriels/introduction-interpolation/?page=page_8#L8-3
 * La spline de Catmull-Rom utilise ici un tableau d'ordonnées successives pour des abscisses équiréparties.
 * Donc on donne le tableau des valeurs de y, l'abscisse correspondant à la première valeur de y et le pas (step) permettant de passer d'une abscisse à la suivante.
 * Adaptation pour Mathalea
 * @property {number[]} x liste des abscisses des noeuds (rempli à partir de x0 et step)
 * @property {number[]} y liste des ordonnées des noeuds
 * @property {number} n nombre de noeuds
 * @property {Polynome[]} polys liste des polynomes correspondants à chaque intervalle
 * @property {Function[]} fonctions liste des fonctions correspondantes à chaque polynome
 * @method  {(number)=>number[]} solve(y) retourne les antécédents de y
 * @method {number=>number} image(x) retourne l'image de x par la fonction
 * @author Jean-Claude Lhote
 * @deprecated Remplacé par la classe Spline de Spline.js
 */
class SplineCatmullRom {
  /**
   *
   * @param {number[]} tabY liste des valeurs de y au niveau des noeuds (sa longueur détermine le nombre d'intervalles
   * @param {number} x0 l'abscisse du début de l'intervalle de définition
   * @param {number} step le pas entre chaque valeur de x pour les différents noeuds successifs
   */
  constructor ({ tabY = [], x0 = -5, step = 1 }) {
    this.x = []
    this.y = []
    this.n = tabY.length // on a n valeurs de y et donc de x, soit n-1 intervalles numérotés de 1 à n-1.
    this.step = step // on en a besoin pour la dérivée...

    for (let i = 0; i < this.n; i++) {
      this.x[i] = x0 + step * i
      this.y[i] = tabY[i]
    }
    this.polys = this.definePolys()
    this.fonctions = this.convertPolyFunction()
  }

  /**
   * définis les polynomes de CatMulRom
   * @returns {Polynome[]}
   */
  definePolys () {
    const polys = []
    for (let i = 1; i < this.n; i++) {
      let y0, y1, y2, y3
      if (i === 1) { // on est dans l'intervalle [x0,x1] le premier intervalle. i est le numéro de l'intervalle.
        y1 = this.y[i - 1]
        y2 = this.y[i]
        y0 = 2 * y1 - y2
        y3 = this.y[i + 1]
      } else if (i === this.n - 1) { // on est dans le dernier intervalle [xn-2,xn-1]
        y0 = this.y[i - 2]
        y1 = this.y[i - 1]
        y2 = this.y[i]
        y3 = 2 * y2 - y1
      } else {
        y0 = this.y[i - 2]
        y1 = this.y[i - 1]
        y2 = this.y[i]
        y3 = this.y[i + 1]
      }
      // t = (x - this.x[i - 1]) / (this.x[i] - this.x[i - 1])
      const k = 1 / (this.x[i] - this.x[i - 1])
      const t0 = new Polynome({ useFraction: false, coeffs: [-this.x[i - 1], 1] })
      const t = t0.multiply(k)
      const t2 = t.multiply(t)
      const t3 = t2.multiply(t)
      const b0 = t.multiply(-1).add(t2.multiply(2)).add(t3.multiply(-1)) // -t + 2 * t2 - t3
      const b1 = t3.multiply(3).add(t2.multiply(-5)).add(2) // b1 = 2 - 5 * t2 + 3 * t3
      const b2 = t.add(t2.multiply(4)).add(t3.multiply(-3)) // b2 = t + 4 * t2 - 3 * t3
      const b3 = t3.add(t2.multiply(-1)) // b3 = -t2 + t3 // tous les bi sont de degré 3 en x
      // pol est le polynome de degré 3 pour cet intervalle !
      const pol = b0.multiply(y0).add(b1.multiply(y1)).add(b2.multiply(y2)).add(b3.multiply(y3)).multiply(0.5)//  (b0 * y0 + b1 * y1 + b2 * y2 + b3 * y3) / 2
      polys.push(pol)
    }
    return polys
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
            arr = round(valeur, 3)
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
   * retourne une nouvelle splineCatmulRom correspondant à la fonction dérivée de this.
   */
  get derivee () {
    const derivees = []
    for (let i = 0; i < this.n; i++) {
      derivees.push(this.polys[Math.min(i, this.n - 2)].derivee().fonction(this.x[i]))
    }
    const maSpline = new SplineCatmullRom({ tabY: derivees, x0: this.x[0], step: this.step, repere: this.repere })
    for (let i = 0; i < this.n - 1; i++) { // on redéfinit les polynomes
      maSpline.polys[i] = this.polys[i].derivee()
    }
    maSpline.fonctions = maSpline.convertPolyFunction() // on remets les 'bonnes' fonctions
    return maSpline
  }

  /**
   * crée l'objet mathalea2d correspondant à la courbe tracée
   * @param {Repere} repere
   * @param {number} step
   * @param {string} color
   * @param {number} epaisseur
   * @param {boolean} ajouteNoeuds
   * @param {{*}} optionsNoeuds
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
 * inspiré de https://yahiko.developpez.com/tutoriels/introduction-interpolation/?page=page_8#L8-3
 * La spline de Catmull-Rom utilise ici un tableau d'ordonnées successives pour des abscisses équiréparties.
 * Donc on donne le tableau des valeurs de y, l'abscisse correspondant à la première valeur de y et le pas (step) permettant de passer d'une abscisse à la suivante.
 * Adaptation pour Mathalea
 * @property {number[]} x liste des abscisses des noeuds (rempli à partir de x0 et step)
 * @property {number[]} y liste des ordonnées des noeuds
 * @property {number} n nombre de noeuds
 * @property {Polynome[]} polys liste des polynomes correspondants à chaque intervalle
 * @property {Function[]} fonctions liste des fonctions correspondantes à chaque polynome
 * @method  {(number)=>number[]} solve(y) retourne les antécédents de y
 * @method {number=>number} image(x) retourne l'image de x par la fonction
 * @author Jean-Claude Lhote
 *
 * @param {number[]} tabY liste des valeurs de y au niveau des noeuds (sa longueur détermine le nombre d'intervalles
 * @param {number} x0 l'abscisse du début de l'intervalle de définition
 * @param {number} step le pas entre chaque valeur de x pour les différents noeuds successifs
 * @deprecated préférer la classe Spline de Spline.js beaucoup mieux faite (J'ai beaucoup appris de mes erreurs) J-C Lhote
 */
export function splineCatmullRom ({ tabY = [], x0 = -5, step = 1 } = {}) {
  return new SplineCatmullRom({ tabY, x0, step })
}
