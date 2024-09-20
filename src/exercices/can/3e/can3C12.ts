import Exercice from '../../Exercice'
import { calculCompare } from '../../../lib/interactif/comparisonFunctions'
import { randint, listeQuestionsToContenu } from '../../../modules/outils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Encadrer une racine carrée'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModificationImportante = '20/09/2024'
/*!
 * @author Gilles Mora
 */
export const uuid = '0ad86'
export const ref = 'can3C12'
export const refs = {
  'fr-fr': ['can3C12'],
  'fr-ch': []
}
export default class EncadreRacine extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.spacing = 1.5
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = false
    // this.optionsDeComparaison = { ensembleDeNombres: true }
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.spacingCorr = 1.5
    this.listeCanReponsesACompleter = []

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''

      const a = randint(3, 125, [4, 9, 16, 25, 36, 49, 64, 81, 100, 121])

      texte = 'Compléter par deux entiers consécutifs.<br>'
      if (this.interactif) {
        texte += remplisLesBlancs(this, i, ` %{champ1} < \\sqrt{${a}} <  %{champ2}`, KeyboardType.clavierDeBase)
      } else { texte += `$\\ldots < \\sqrt{${a}} < \\ldots$` }
      this.correction = `On encadre $${a}$ par deux carrés d'entiers : <br>
$${Math.floor(Math.sqrt(a))}^2< ${a} < ${Math.ceil(Math.sqrt(a))}^2$<br>`

      if (this.correctionDetaillee) {
        this.correction += `En prenant la racine carrée de chacun de ces nombres, on obtient : <br>
   $\\sqrt{${Math.floor(Math.sqrt(a))}^2}< \\sqrt{${a}} < \\sqrt{${Math.ceil(Math.sqrt(a))}^2}$ (on ne change pas le sens des inégalités en prenant les racines carrées)<br>`
      }
      this.correction += ` On en déduit  : $${miseEnEvidence(texNombre(Math.floor(Math.sqrt(a)), 0))}<\\sqrt{${a}}< ${miseEnEvidence(texNombre(Math.ceil(Math.sqrt(a)), 0))}$
     `

      handleAnswers(this, i, {
        bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
        champ1: { value: `${Math.floor(Math.sqrt(a))}`, compare: calculCompare },
        champ2: { value: `${Math.ceil(Math.sqrt(a))}`, compare: calculCompare }
      },
      { formatInteractif: 'mathlive' }
      )

      this.canEnonce = 'Compléter par deux entiers consécutifs.'
      this.canReponseACompleter = `$\\ldots < \\sqrt{${a}} <\\ldots$`
      if (this.questionJamaisPosee(i, a)) {
        this.listeCorrections.push(this.correction)
        this.listeQuestions.push(texte)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
