import { codageAngleDroit } from '../../../lib/2d/angles.js'
import { afficheLongueurSegment } from '../../../lib/2d/codages.js'
import { point, pointAdistance } from '../../../lib/2d/points.js'
import { polygoneAvecNom } from '../../../lib/2d/polygones.js'
import { segment } from '../../../lib/2d/segmentsVecteurs.js'
import { rotation, similitude } from '../../../lib/2d/transformations.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { creerNomDePolygone } from '../../../lib/outils/outilString.js'
import Exercice from '../../deprecatedExercice.js'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Utiliser la trigonométrie'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can3G05
 * Date de publication
*/
export const uuid = 'c6b9c'
export const ref = 'can3G05'
export const refs = {
  'fr-fr': ['can3G05'],
  'fr-ch': []
}
export default function Trigo () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nbQuestions = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    const listeTriplet = [
      [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41], [11, 60, 61]
    ] // triplets Pythagore
    const triplet = choice(listeTriplet)
    const nom = creerNomDePolygone(3, ['QD'])
    const a = triplet[0]
    const b = triplet[1]
    const c = triplet[2]
    const A = point(0, 0, nom[0])
    const alpha = randint(0, 135)
    const B = rotation(pointAdistance(A, a, 0), A, alpha, nom[1])
    const C = similitude(A, B, 90, b / a, nom[2])
    const pol = polygoneAvecNom(A, B, C, 10 * c / 170) // 10 *c / 170 => on arrête à 10 pixels du points...  lié à pixelsParCm: 170 / c plus bas
    const objets = []
    objets.push(segment(A, B), segment(B, C), segment(A, C), codageAngleDroit(A, B, C))
    objets.push(afficheLongueurSegment(A, B, 'black', 0.5, ''), afficheLongueurSegment(B, C, 'black', 0.5, ''), afficheLongueurSegment(C, A, 'black', 0.5, ''))
    objets.push(pol[0], pol[1])
    switch (choice(['a', 'b', 'c', 'd', 'e', 'f'])) { //, 'b'
      case 'a':
        this.question = `Donner la valeur de $\\cos\\widehat{${nom[2]}}$  sous la forme d'une fraction irréductible.<br>

        `
        this.correction = ` Dans le triangle $${nom[0]}${nom[1]}${nom[2]}$ rectangle en $${nom[1]}$, on a : <br>
        $\\cos\\widehat{${nom[2]}}=\\dfrac{\\text{Côté adjacent à } \\widehat{${nom[2]}}}{\\text{Hypoténuse}}=\\dfrac{${b}}{${c}}.$
      <br>`
        this.reponse = `\\dfrac{${b}}{${c}}`
        break
      case 'b':
        this.question = `Donner la valeur de $\\sin\\widehat{${nom[2]}}$ sous forme d'une fraction irréductible.<br>
        `
        this.correction = ` Dans le triangle $${nom[0]}${nom[1]}${nom[2]}$ rectangle en $${nom[1]}$, on a : <br>
        $\\sin\\widehat{${nom[2]}}=\\dfrac{\\text{Côté opposé à } \\widehat{${nom[2]}}}{\\text{Hypoténuse}}=\\dfrac{${a}}{${c}}.$
      <br>`
        this.reponse = `\\dfrac{${a}}{${c}}`
        break
      case 'c':
        this.question = `Donner la valeur de $\\tan\\widehat{${nom[2]}}$ sous forme d'une fraction irréductible.<br>
        `
        this.correction = ` Dans le triangle $${nom[0]}${nom[1]}${nom[2]}$ rectangle en $${nom[1]}$, on a : <br>
        $\\tan\\widehat{${nom[2]}}=\\dfrac{\\text{Côté opposé à } \\widehat{${nom[2]}}}{\\text{Côté adjacent à } \\widehat{${nom[2]}}}=\\dfrac{${a}}{${b}}.$
      <br>`
        this.reponse = `\\dfrac{${a}}{${b}}`
        break
      case 'd':
        this.question = `Donner la valeur de  $\\cos\\widehat{${nom[0]}}$ sous forme d'une fraction irréductible.<br>
        `
        this.correction = ` Dans le triangle $${nom[0]}${nom[1]}${nom[2]}$ rectangle en $${nom[1]}$, on a : <br>
        $\\cos\\widehat{${nom[0]}}=\\dfrac{\\text{Côté adjacent à } \\widehat{${nom[0]}}}{\\text{Hypoténuse}}=\\dfrac{${a}}{${c}}.$
      <br>`

        this.reponse = `\\dfrac{${a}}{${c}}`
        break
      case 'e':
        this.question = `Donner la valeur de $\\sin\\widehat{${nom[0]}}$ sous forme d'une fraction irréductible.<br>
        `
        this.correction = ` Dans le triangle $${nom[0]}${nom[1]}${nom[2]}$ rectangle en $${nom[1]}$, on a :<br>
        $\\sin\\widehat{${nom[0]}}=\\dfrac{\\text{Côté opposé à } \\widehat{${nom[0]}}}{\\text{Hypoténuse}}=\\dfrac{${b}}{${c}}.$
      <br>`
        this.reponse = `\\dfrac{${b}}{${c}}`
        break
      case 'f':
        this.question = `Donner la valeur de $\\tan\\widehat{${nom[0]}}$ sous forme d'une fraction irréductible.<br>
        `
        this.correction = ` Dans le triangle $${nom[0]}${nom[1]}${nom[2]}$ rectangle en $${nom[0]}$, on a : <br>
        $\\tan\\widehat{${nom[0]}}=\\dfrac{\\text{Côté opposé à } \\widehat{${nom[0]}}}{\\text{Côté adjacent à } \\widehat{${nom[0]}}}=\\dfrac{${b}}{${a}}.$
      <br>`
        this.reponse = `\\dfrac{${b}}{${a}}`
        break
    }

    this.question += '<br>' + mathalea2d(Object.assign({}, fixeBordures(objets, { rxmin: -0.05 * c, rymin: -0.05 * c, rxmax: 0.05 * c, rymax: 0.05 * c }), {
      pixelsParCm: 170 / c,
      mainlevee: false,
      amplitude: 0.5,
      scale: 4 / c,
      style: 'margin: auto'
    }), objets)
    this.canEnonce = this.question.replaceAll('<br>', '\\\\') // 'Compléter'
    this.canReponseACompleter = ''
  }
}
