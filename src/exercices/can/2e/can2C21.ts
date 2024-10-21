import Exercice from '../../Exercice'
import { randint, listeQuestionsToContenu } from '../../../modules/outils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import Decimal from 'decimal.js'
export const titre = 'Déterminer des racines carrées ou des carrés parfaits (décimaux)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '21/10/2024'
/*!
 * @author Gilles Mora
 */
export const uuid = 'bd96a'
export const ref = 'can2C21'
export const refs = {
  'fr-fr': ['can2C21'],
  'fr-ch': []
}
export default class calculsRacinesCarresPafaitsDecimaux extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.spacing = 1.5
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let a, b
      let reponse
      switch (randint(1, 2)) {
        case 1:
          a = new Decimal(randint(1, 12, 10)).div(10)
          b = a.pow(2)
          reponse = texNombre(a, 2)
          texte = 'Compléter.<br>'
          if (this.interactif) {
            handleAnswers(this, i,
              {
                champ1: { value: reponse, compare: fonctionComparaison, options: { nombreDecimalSeulement: true } }

              }
            )
            texte += remplisLesBlancs(this, i, `\\sqrt{${texNombre(b, 2)}} = %{champ1}`, KeyboardType.clavierNumbers)
          } else { texte += `$\\sqrt{${texNombre(b, 2)}} = \\ldots$` }
          texteCorr = `$\\sqrt{${texNombre(b, 2)}} =${miseEnEvidence(texNombre(a, 2))}$`

          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$\\sqrt{${texNombre(b, 2)}} = \\ldots$`
          this.listeCanEnonces.push(this.canEnonce)
          this.listeCanReponsesACompleter.push(this.canReponseACompleter)
          break

        case 2:
          a = new Decimal(randint(1, 12, 10)).div(10)
          b = a.pow(2)
          reponse = texNombre(b, 2)
          texte = 'Compléter.<br>'
          if (this.interactif) {
            handleAnswers(this, i,
              {
                champ1: { value: reponse }
              }
            )
            texte += remplisLesBlancs(this, i, `\\sqrt{%{champ1}} = ${texNombre(a, 2)}`, KeyboardType.clavierDeBaseAvecFraction)
          } else { texte += `$\\sqrt{\\ldots} =${texNombre(a, 2)} $` }
          texteCorr = `On a $${texNombre(a, 2)}^2=${texNombre(b, 2)}$. <br>
          Donc $\\sqrt{${miseEnEvidence(texNombre(b, 2))}} =${texNombre(a, 2)}$.`

          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$\\sqrt{\\ldots} =${texNombre(a, 2)} $`
          this.listeCanEnonces.push(this.canEnonce)
          this.listeCanReponsesACompleter.push(this.canReponseACompleter)
          break
      }
      if (this.questionJamaisPosee(i, texte)) {
        this.listeCorrections.push(texteCorr)
        this.listeQuestions.push(texte)

        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
