import { milieu, point, pointAdistance } from '../../../lib/2d/points.js'
import { segment } from '../../../lib/2d/segmentsVecteurs.js'
import { labelPoint, texteParPosition } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { creerNomDePolygone } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Calculer une longueur avec le théorème de Thalès'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can3G03
 * Date de publication sptembre 2021
*/
export const uuid = '14145'
export const ref = 'can3G03'
export const refs = {
  'fr-fr': ['can3G03'],
  'fr-ch': []
}
export default function CalculLongueurThales2 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = 'largeur01 inline'

  this.nbQuestions = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let nom, a, b, c, k, A, B, C, D, E, objets
    if (choice([true, false])) {
      nom = creerNomDePolygone(5, ['QD'])
      k = choice([1.5, 2, 2.5])
      b = randint(2, 5) * 2//
      a = k * b
      c = randint(2, 6, b)//

      A = point(0, 0, nom[0], 'above')
      B = pointAdistance(A, b, -30, nom[1], 'below')
      C = pointAdistance(B, c, 110, nom[2], 'above')

      D = pointAdistance(A, a, 150, nom[3], 'above')
      E = pointAdistance(D, k * c, -70, nom[4], 'below')

      // pol = polygoneAvecNom(A, D, C)
      objets = []
      objets.push(segment(B, D), segment(D, E), segment(C, E), segment(B, C), labelPoint(A, B, C, D, E))
      objets.push(texteParPosition(`${texNombre(b)}`, milieu(A, B).x, milieu(A, B).y - 0.7, 'milieu', 'black', 1, 'middle', true),
        texteParPosition(`${texNombre(c)}`, milieu(B, C).x + 0.5, milieu(B, C).y, 'milieu', 'black', 1, 'middle', true),
        texteParPosition(`${texNombre(a)}`, milieu(A, D).x + 0.5, milieu(A, D).y + 0.5, 'milieu', 'black', 1, 'middle', true))
      this.question = `Les droites $(${nom[1]}${nom[2]})$ et $(${nom[3]}${nom[4]})$ sont parallèles.
      
      Calculer $${nom[3]}${nom[4]}$.<br>
      
      `
      this.correction = ` Le triangle $${nom[0]}${nom[3]}${nom[4]}$ est un agrandissement du triangle $${nom[0]}${nom[1]}${nom[2]}$.<br>
    Le coefficient d'agrandissement est  donné par :  $\\dfrac{${nom[0]}${nom[3]}}{${nom[0]}${nom[1]}}=\\dfrac{${texNombre(a)}}{${b}}=${texNombre(a / b)}$.<br>
    On en déduit que les longueurs du triangle $${nom[0]}${nom[3]}${nom[4]}$ sont $${texNombre(a / b)}$ fois plus grandes que les longueurs du triangle $${nom[0]}${nom[1]}${nom[2]}$. <br>
        Ainsi, $${nom[3]}${nom[4]}=${texNombre(a / b)}\\times ${c}=${texNombre(a * c / b)}$.
                  <br>`
      this.reponse = calculANePlusJamaisUtiliser(a * c / b)
      this.canReponseACompleter = `$${nom[3]}${nom[4]}=\\ldots$`
    } else {
      nom = creerNomDePolygone(5, ['QD'])
      k = choice([1.5, 2, 2.5])
      b = randint(2, 5) * 2//
      a = k * b
      c = randint(2, 6, b)//

      A = point(0, 0, nom[0], 'above')
      B = pointAdistance(A, c, -30, nom[1], 'below')
      C = pointAdistance(B, b, 110, nom[2], 'above')

      D = pointAdistance(A, k * c, 150, nom[3], 'above')
      E = pointAdistance(D, a, -70, nom[4], 'below')

      // pol = polygoneAvecNom(A, D, C)
      objets = []
      objets.push(segment(B, D), segment(D, E), segment(C, E), segment(B, C), labelPoint(A, B, C, D, E))
      objets.push(texteParPosition(`${texNombre(b)}`, milieu(B, C).x + 0.5, milieu(B, C).y, 'milieu', 'black', 1, 'middle', true),
        texteParPosition(`${texNombre(c)}`, milieu(A, B).x, milieu(A, B).y - 0.5, 'milieu', 'black', 1, 'middle', true),
        texteParPosition(`${texNombre(a)}`, milieu(D, E).x - 0.8, milieu(D, E).y, 'milieu', 'black', 1, 'middle', true))
      this.question = `Les droites $(${nom[1]}${nom[2]})$ et $(${nom[3]}${nom[4]})$ sont parallèles.<br>
      
      Calculer $${nom[3]}${nom[0]}$.<br>

      `
      this.correction = ` Le triangle $${nom[0]}${nom[3]}${nom[4]}$ est un agrandissement du triangle $${nom[0]}${nom[1]}${nom[2]}$.<br>
       Le coefficient d'agrandissement est  donné par : $\\dfrac{${nom[3]}${nom[4]}}{${nom[2]}${nom[1]}}=\\dfrac{${texNombre(a)}}{${b}}=${texNombre(a / b)}$.<br>
       On en déduit que les longueurs du triangle $${nom[0]}${nom[3]}${nom[4]}$ sont $${texNombre(a / b)}$ fois plus grandes que les longueurs du triangle $${nom[0]}${nom[1]}${nom[2]}$. <br>
           Ainsi, $${nom[3]}${nom[0]}=${texNombre(a / b)}\\times ${c}=${texNombre(a * c / b)}$.
                     <br>`
      this.reponse = calculANePlusJamaisUtiliser(a * c / b)
      this.canReponseACompleter = `$${nom[3]}${nom[0]}=\\ldots$`
    }

    this.question += mathalea2d(Object.assign({}, fixeBordures(objets, { rxmin: -0.1 * c, rymin: -0.75 * c, rxmax: 0.1 * c, rymax: 0.1 * c }), { pixelsParCm: 8, mainlevee: false, amplitude: 0.5, scale: 0.2, style: 'margin: auto' }), objets)
    this.canEnonce = this.question// 'Compléter'
  }
}
