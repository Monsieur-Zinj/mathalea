import { texteParPosition } from '../../../lib/2d/textes.ts'
import Pyramide from '../../../modules/pyramide.js'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
export const titre = 'Calculer dans une pyramide multiplicative'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '09/05/2022'
/*!
 * @author  Jean-Claude Lhote
 *
 *
 */
export const uuid = 'a905f'
export const ref = 'can6C33'
export const refs = {
  'fr-fr': ['can6C33'],
  'fr-ch': []
}
export default function PyramideMul3Etages () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.typeExercice = 'simple'
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    const pyr = new Pyramide({ operation: '*', nombreEtages: 3, rangeData: [2, 5], exclusions: [0] })
    pyr.isVisible = [[false], [false, false], [true, true, true]]
    this.question = `Chaque case contient le produit des deux cases sur lesquelles elle repose. Quel est le nombre qui correspond à * ?<br>
    ${mathalea2d({ xmin: 0, ymin: 0, xmax: 12, ymax: 3.5, scale: 0.6 }, pyr.representeMoi(0, 0), texteParPosition('*', 6, 2.5))}`
    this.reponse = pyr.valeurs[0][0]
    pyr.isVisible = [[true], [true, true], [true, true, true]]
    this.correction = `Le nombre qui se trouve au sommet de la pyramide est : ${this.reponse}<br>
    ${mathalea2d({ xmin: 0, ymin: 0, xmax: 12, ymax: 3.5, scale: 0.6 }, pyr.representeMoi(0, 0))}`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
