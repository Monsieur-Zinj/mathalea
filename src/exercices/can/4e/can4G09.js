import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import { Triangle } from '../../../modules/Triangle.js'
import { point } from '../../../lib/2d/points.js'
import { barycentre, polygone, polygoneAvecNom } from '../../../lib/2d/polygones.js'
import { rotation } from '../../../lib/2d/transformations.js'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites.js'
import { texteSurSegment } from '../../../lib/2d/codages.js'
import { codageAngleDroit } from '../../../lib/2d/angles.js'
import { sp } from '../../../lib/outils/outilString.js'
export const titre = 'Trouver la longueur d\'un côté de triangle rectangle'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '01/10/2023'

/**
 * @author Jean-Claude  Lhote
 * Référence can4G09
 * Date de publication 1/10/2023
 */
export const uuid = '96bcd'
export const refs = {
  'fr-fr': ['can4G09'],
  'fr-ch': []
}
export default function TripletsPythagoriciens () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = 'largeur15 inline'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.sup = 1
  this.besoinFormulaireNumerique = ['Type de question', 3, '1: calcul de l\'hypoténuse\n2: Calcul d\'un côté de l\'angle droit\n3: L\'un ou l\'autre']
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    const listeTripletsPythagoriciens = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
      [9, 12, 15],
      [12, 16, 20],
      [15, 20, 25]
    ]
    const triplet = choice(listeTripletsPythagoriciens)
    const triangle = new Triangle()
    const nom = Array.from(triangle.nom)
    const scale = 4 / triplet[1]
    const A = point(0, 0)
    const B = point(triplet[1] * scale, 0)
    const C = point(triplet[1] * scale, triplet[0] * scale)
    const abc = polygone(A, B, C)
    const O = barycentre(abc)
    const tri = rotation(abc, O, randint(0, 360))
    const a = tri.listePoints[0]
    const b = tri.listePoints[1]
    const c = tri.listePoints[2]
    const angleDroit = codageAngleDroit(a, b, c)
    a.nom = nom[0]
    b.nom = nom[1]
    c.nom = nom[2]
    const poly = polygoneAvecNom(a, b, c)
    const longueurAB = texteSurSegment(String(triplet[1]), b, a, 'black', 0.5, true)
    const longueurBC = texteSurSegment(String(triplet[0]), c, b, 'black', 0.5, true)
    const longueurCA = texteSurSegment(String(triplet[2]), a, c, 'black', 0.5, true)
    const objets = [poly, angleDroit]
    let index = this.sup === 1 ? 0 : this.sup === 2 ? 1 : choice([0, 1]) // on choisit le type de question ou on laisse le hasard (option mélange)
    this.question = `Dans le triangle $${nom.join('')}$ rectangle en $${nom[1]}$, `
    if (index === 0) { // calcul de l'hypoténuse
      index = choice([0, 1])
      objets.push(longueurAB, longueurBC)
      this.question += `$${nom[index * 2]}${nom[1]}=${triplet[(1 - index)]}$${sp(1)}cm, $${nom[1]}${nom[(1 - index) * 2]}=${triplet[index]}$${sp(1)}cm.<br>Calculer $${nom[0]}${nom[2]}$.`
      objets.push()
      this.correction = `D'après le théorème de Pythagore, $${nom[0]}${nom[2]}^2=${nom[0]}${nom[1]}^2+${nom[1]}${nom[2]}^2=${triplet[1]}^2+${triplet[0]}^2=${triplet[1] ** 2}+${triplet[0] ** 2}=${triplet[2] ** 2}$.<br>`
      this.correction += `D'où $${nom[0]}${nom[1]}=\\sqrt{${triplet[2] ** 2}}=${triplet[2]}$.`
      this.reponse = triplet[2]
      this.optionsChampTexte = { texte: `$${nom[0]}${nom[2]}$=`, texteApres: `${sp(1)}cm` }
    } else { // calcul d'un côté de l'angle droit
      const index2 = choice([0, 2])
      objets.push(longueurCA, index2 === 0 ? longueurAB : longueurBC)
      this.question += `$${nom[0]}${nom[2]}=${triplet[2]}$${sp(1)}cm, $${nom[index2]}${nom[1]}=${triplet[(2 - index2) / 2]}$${sp(1)}cm.<br>Calculer $${nom[2 - index2]}${nom[1]}$.`
      this.correction = `D'après le théorème de Pythagore, $${nom[0]}${nom[2]}^2=${nom[0]}${nom[1]}^2+${nom[1]}${nom[2]}^2$ soit $${triplet[2]}^2=${nom[2 - index2]}${nom[1]}^2+${triplet[(2 - index2) / 2]}^2$.<br>`
      this.correction += `Donc $${nom[2 - index2]}${nom[1]}^2=${triplet[2]}^2-${triplet[(2 - index2) / 2]}^2=${triplet[2] ** 2}-${triplet[(2 - index2) / 2] ** 2}=${triplet[index2 / 2] ** 2}$.<br>`
      this.correction += `D'où $${nom[2 - index2]}${nom[1]}=\\sqrt{${triplet[index2 / 2] ** 2}}=${triplet[index2 / 2]}$.`
      this.reponse = triplet[index2 / 2]
      this.optionsChampTexte = { texte: `$${nom[2 - index2]}${nom[1]}=$`, texteApres: `${sp(1)}cm` }
    }
    this.formatInteractif = 'calcul'
    this.formatChampTexte = 'largeur10 inline nospacebefore'
    const figure = mathalea2d(Object.assign({ scale: 0.6, style: 'display: inline;' }, fixeBordures(objets)), objets)
    this.question += figure
  }
}
