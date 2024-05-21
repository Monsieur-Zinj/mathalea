import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { context } from '../../../modules/context'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import FractionEtendue from '../../../modules/FractionEtendue'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'

export const titre = 'Convertir des dm en m et réciproquement'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '1bb1e'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBase
    this.canOfficielle = false
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.formatInteractif = 'mathlive'
      this.compare = fonctionComparaison
      this.reponse = new FractionEtendue(7, 10).texFraction
      this.question = 'Complète : <br> $7$ dm $=$ '
      this.correction = ` Comme $1$ m $=10$ dm, alors $1$ dm $=0,1$ m.<br>
      Ainsi, pour passer des "dm" au "m", on divise par $10$.<br>
        Comme $7\\div 10 =0,7$, alors $7$ dm$=${miseEnEvidence('0,7')}$ m. `
      this.canReponseACompleter = ' $7$ dm $=\\ldots$ m'
      if (this.interactif) {
        this.optionsChampTexte = { texteApres: 'm' }
      } else { this.question += `${context.isHtml ? '$\\ldots$ m' : ''}` }
    } else {
      if (choice([true, false])) {
        this.formatInteractif = 'mathlive'
        this.compare = fonctionComparaison
        const a = randint(3, 15)
        this.reponse = new FractionEtendue(a, 10).texFraction
        this.question = `Complète : <br>$${a}$ dm $=$`
        this.correction = `
         Comme $1$ m $=10$ dm, alors $1$ dm $=0,1$ m.<br>
        Ainsi, pour passer des "dm" au "m", on divise par $10$.<br>
      Comme $${a}\\div 10 =${texNombre(a / 10, 1)}$, alors $${a}$ dm$=${miseEnEvidence(texNombre(a / 10, 1))}$ m.  `
        this.canReponseACompleter = `$${a}$ dm $=\\ldots$ m`
        if (this.interactif) {
          this.optionsChampTexte = { texteApres: 'm' }
        } else { this.question += `${context.isHtml ? '$\\ldots$ m' : ''}` }
      } else {
        this.formatInteractif = 'mathlive'
        this.compare = fonctionComparaison
        const a = randint(15, 60)
        this.reponse = String(a * 10)
        this.question = `Complète : <br> $${texNombre(a, 0)}$ m $=$ `
        if (this.interactif) {
          this.optionsChampTexte = { texteApres: 'dm' }
        } else { this.question += `${context.isHtml ? '$\\ldots$ dm' : ''}` }
        this.correction = ` Comme $1$ m $=10$ dm,  pour passer des "m" au "dm", on multiplie par $10$.<br>
            Comme $${texNombre(a, 1)}\\times 10 =${texNombre(a * 100, 0)}$, alors $${texNombre(a, 2)}$ m$=${miseEnEvidence(texNombre(a * 100, 0))}$ dm.`
        this.canReponseACompleter = ` $${texNombre(a, 0)}$ m $= \\ldots$ dm`
      }
    }
    this.canEnonce = 'Complète.'
  }
}
