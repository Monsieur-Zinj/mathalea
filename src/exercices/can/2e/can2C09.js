import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { segment, segmentAvecExtremites } from '../../../lib/2d/segmentsVecteurs.js'
import { stringNombre } from '../../../lib/outils/texNombre'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { milieu, point } from '../../../lib/2d/points.js'
import { randint } from '../../../modules/outils.js'
import { fraction } from '../../../modules/fractions.js'
import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../deprecatedExercice.js'
import { codageSegments } from '../../../lib/2d/codages.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { pgcd } from '../../../lib/outils/primalite'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'

export const titre = 'Calculer le "milieu" entre 1 et une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can3C07
 * Date de publication sptembre 2021
 */
export const uuid = '5da59'
export const ref = 'can2C09'
export const refs = {
  'fr-fr': ['can2C09'],
  'fr-ch': []
}
export default function MilieuEntre1EtFraction () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur01 inline'
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { fractionIrreductible: true }

  this.nouvelleVersion = function () {
    const listeFractions1 = [
      [10, 3], [5, 4], [7, 4], [10, 7], [11, 7], [12, 7], [9, 7], [13, 7], [11, 8], [11, 9], [7, 6], [12, 11], [4, 3],
      [7, 5], [13, 7], [13, 9], [13, 11], [13, 12], [14, 11]
    ] // Couples de nombres premiers entre eux >1
    const fractionR = choice(listeFractions1)
    const n = fractionR[0]
    const d = fractionR[1]
    // Ajouts par J-C
    const bonneFraction = fraction(n, d)
    const un = fraction(d, d)
    const unPlusBonneFraction = bonneFraction.sommeFraction(un)
    const half = fraction(1, 2)
    const resultat = unPlusBonneFraction.produitFraction(half)
    // Fin ajouts
    const A = point(0, 0, '1', 'below')
    const C = point(randint(8, 12), 0)
    const B = milieu(A, C, 'M', 'below')
    const objets = []
    objets.push(segmentAvecExtremites(A, B), segmentAvecExtremites(B, C), codageSegments('||', 'blue', A, B, B, C))
    objets.push(texteParPosition(`${stringNombre(1)}`, 0, -0.6))
    objets.push(texteParPosition(`${stringNombre(n)}`, C.x, C.y - 0.5))
    objets.push(segment(point(C.x - 0.3, C.y - 0.8), point(C.x + 0.3, C.y - 0.8)))
    objets.push(texteParPosition('M', B.x, B.y - 0.5))
    // objets.push(texteParPosition(`---`,C.x ,C.y-0.7))
    objets.push(texteParPosition(`${stringNombre(d)}`, C.x, C.y - 1.1))
    // objets.push(latexParCoordonnees(fraction(n, d).texFraction, C.x, -1, 'black', 20, 20, 'white', 6))
    //, labelPoint(B)

    this.question = `Donner l'abscisse du point $M$ sous forme d’une fraction irréductible.<br>
    `
    this.question += mathalea2d({
      xmin: -0.5,
      ymin: -2,
      xmax: C.x + 1,
      ymax: 1,
      pixelsParCm: 30,
      mainlevee: false,
      amplitude: 0.4,
      scale: 0.6,
      style: 'margin: auto'
    }, objets)
    /* Avant
    // this.correction = `On calcule la moyenne de $1$ et $${texFractionFromString(n, d)}$ :<br>
    $x_I=\\dfrac{1+${texFractionFromString(n, d)}}{2}=
    \\dfrac{${texFractionFromString(d, d)}+${texFractionFromString(n, d)}}{2}=
    ${texFractionFromString(n + d, d)}\\times \\dfrac{1}{2}=
      ${texFractionFromString(d + n, 2 * d)} ${simplificationDeFractionAvecEtapes(d + n, 2 * d)}$ <br><br>`
    this.correction += texteEnCouleur(` Mentalement : <br>
      On calcule d'abord  $1+${texFractionFromString(n, d)}$ en n'oubliant pas que $1=\\dfrac{${d}}{${d}}$, puis on multiplie le résultat par $\\dfrac{1}{2}$. `)

      this.reponse = texFractionReduite(d + n, 2 * d)
      */
    // Après
    this.correction = `On calcule la moyenne de $1$ et $${bonneFraction.texFraction}$ :<br>
    $x_I=\\dfrac{1+${bonneFraction.texFraction}}{2}=
    \\dfrac{${un.texFraction}+${bonneFraction.texFraction}}{2}=
        ${unPlusBonneFraction.texFraction}\\times ${half.texFraction}=
        ${pgcd(d + n, 2 * d) === 1 ? `${miseEnEvidence(resultat.texFraction)}` : `${resultat.texFraction}`} ${resultat.texSimplificationAvecEtapes(false, '#f15929')}$ <br><br>`
    this.correction += texteEnCouleur(` Mentalement : <br>
        On calcule d'abord $1+${bonneFraction.texFraction}$ en n'oubliant pas que $1=${un.texFraction}$, puis on multiplie le résultat par $${half.texFraction}$.`)

    this.reponse = resultat.simplifie()
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
