import { randint } from '../../../modules/outils.js'
import { Yohaku } from '../../../lib/outils/Yohaku'
import Exercice from '../../deprecatedExercice.js'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
export const titre = 'Trouver une valeur dans un Yohaku (additif)'
export const interactifReady = true
export const interactifType = 'mathLive'
// export const amcReady = true
// export const amcType = 'AMCNum'
export const dateDePublication = '10/08/2022'
export const dateDeModificationImportante = '16/12/2023'

export const uuid = '892f2'
export const ref = 'can6C39'
export const refs = {
  'fr-fr': ['can6C39'],
  'fr-ch': []
}
/**
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function YohakuCan6b () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    this.autoCorrection = []
    this.listeQuestions = []
    this.listeCorrections = []
    const laCase = randint(0, 3)
    const yohaku1 = new Yohaku({ type: 'entiers', largeur: 2, hauteur: 2, taille: 2, operation: 'multiplication', valeurMax: 10, solution: false, cellules: [] })
    // on calcule les résultats
    yohaku1.calculeResultats()
    // On mémorise la réponse
    this.reponse = yohaku1.cellules[laCase]
    // On blanchit la case inconnue avant la représentation
    yohaku1.cellulesPreremplies = [...yohaku1.cellules.map((el, i) => i === laCase ? '' : el)]
    this.listeQuestions[0] = 'Les nombres en bout de ligne ou de colonne sont les sommes des nombres contenus dans la ligne ou la colonne.<br>'
    this.listeQuestions[0] += `Donner la valeur de la case vide.
    <br>${yohaku1.representation({ numeroExercice: this.numeroExercice, question: 0, isInteractif: this.interactif, classes: 'college6e' })}`
    yohaku1.solution = true
    this.listeCorrections[0] = `la valeur de la case vide est : ${this.reponse}<br>`
    // On remet la valeur de la case avant de représenter le tableau pour la correction
    yohaku1.cellules[laCase] = this.reponse
    const reponse = [`L${1 + Math.floor(laCase / 2)}C${1 + laCase % 2}`, { value: this.reponse }]
    handleAnswers(this, 0, Object.fromEntries([reponse]))
    this.listeCorrections[0] += yohaku1.representation({ numeroExercice: this.numeroExercice, question: 0, isInteractif: this.interactif, classes: 'college6e' })
    this.canEnonce = this.listeQuestions[0]
    this.canReponseACompleter = ''
  }
}
