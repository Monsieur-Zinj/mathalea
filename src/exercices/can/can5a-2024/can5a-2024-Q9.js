import Exercice from '../../Exercice'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { context } from '../../../modules/context'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Convertir des longueurs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '1bb1e'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = true
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = '0,7'
      this.question = 'Complète : <br> $7$ dm $=$ '
      if (this.interactif) {
        this.optionsChampTexte = { texteApres: 'm' }
      } else { this.question += `${context.isHtml ? '$\\ldots$ m' : ''}` }
      this.correction = ` Comme $1$ m $=10$ dm, alors $1$ dm $=0,1$ m.<br>
      Ainsi pour passer des "dm" au "m", on divise par $10$.<br>
        Comme : $7\\div 10 =0,7$, alors $7$ dm$=${miseEnEvidence('0,7')}$ m. `
      this.canEnonce = 'Complète.'
      this.canReponseACompleter = ' $7$ dm $=\\ldots$ m'
    } else {
      if (choice([true, false])) {
        const a = randint(3, 15)
        this.reponse = new Decimal(a).div(10)
        this.question = `Complète : <br>$${a}$ dm $=$`
        if (this.interactif) {
          this.optionsChampTexte = { texteApres: 'm' }
        } else { this.question += `${context.isHtml ? '$\\ldots$ m' : ''}` }
        this.correction = `
         Comme $1$ m $=10$ dm, alors $1$ dm $=0,1$ m.<br>
        Ainsi pour passer des "dm" au "m", on divise par $10$.<br>
      Comme : $${a}\\div 10 =${texNombre(a / 10, 1)}$, alors $${a}$ dm$=${miseEnEvidence(texNombre(a / 10, 1))}$ m.  `
        this.canEnonce = 'Complète.'
        this.canReponseACompleter = `$${a}$ dm $=\\ldots$ m`
      } else {
        const a = randint(15, 60)
        this.reponse = a * 100
        this.question = `Complète : <br> $${texNombre(a, 0)}$ m $=$ `
        if (this.interactif) {
          this.optionsChampTexte = { texteApres: 'cm' }
        } else { this.question += `${context.isHtml ? '$\\ldots$ cm' : ''}` }
        this.correction = ` Comme $1$ m $=100$ cm,  pour passer des "m" au "cm", on multiplie par $100$.<br>
            Comme : $${texNombre(a, 1)}\\times 100 =${texNombre(a * 100, 0)}$, alors $${texNombre(a, 2)}$ m$=${miseEnEvidence(texNombre(this.reponse, 0))}$ cm.`
        this.canEnonce = 'Complète.'
        this.canReponseACompleter = ` $${texNombre(a, 0)}$ m $= \\ldots$ cm`
      }
    }
  }
}
