import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Connaître les tables de multiplication (avec des divisions)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '24/01/2023'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * Date de publication
*/

export const uuid = 'd61d9'
export const ref = 'canc3C14'
export const refs = {
  'fr-fr': ['canc3C14'],
  'fr-ch': []
}
export default function TableDivisions () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = KeyboardType.clavierNumbers

  this.nouvelleVersion = function () {
    switch (choice([1, 1, 2])) {
      case 1:
        { const a = randint(2, 9)
          const b = randint(4, 10)
          const c = a * b
          if (choice([true, false])) {
            this.question = `Compléter : <br>$${c}\\div .... =${b}$`
            this.correction = `$${c}\\div ${miseEnEvidence(a)} =${b}$`
            this.canEnonce = 'Compléter.'
            this.canReponseACompleter = `$${c}\\div .... =${b}$`
            this.reponse = a
          } else {
            this.question = `Compléter :<br> $ .... \\div ${a}=${b}$`
            this.correction = `$ ${miseEnEvidence(c)} \\div ${a}=${b}$`
            this.canEnonce = 'Compléter.'
            this.canReponseACompleter = `$ .... \\div ${a}=${b}$`
            this.reponse = c
          }
        }
        break

      case 2:
        { const a = randint(3, 9)
          const b = randint(5, 9)
          const c = a * b
          this.reponse = b
          this.question = `Calculer $${c} \\div ${a}$.`
          this.correction = `$${c} \\div ${a}=${miseEnEvidence(b)}$`
          this.canEnonce = this.question
          this.canReponseACompleter = ''
        }
        break
    }
  }
}
