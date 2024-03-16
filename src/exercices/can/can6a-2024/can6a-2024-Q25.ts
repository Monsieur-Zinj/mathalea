import Exercice from '../../Exercice'
import { randint } from '../../../modules/outils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { numberCompare } from '../../../lib/interactif/comparisonFunctions'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { toutPourUnPoint } from '../../../lib/interactif/mathLive'

export const titre = 'Encadrer un décimal par deux entiers consécutifs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ffbe9'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Référence
*/

export default class EncadreParDeuxEntiers extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatInteractif = 'fillInTheBlank'
    this.formatChampTexte = 'largeur01'
    this.canOfficielle = true
  }

  nouvelleVersion () {
    let decimal: Decimal
    if (this.canOfficielle) {
      decimal = new Decimal('19.3')
    } else {
      decimal = new Decimal(randint(100, 400) + randint(2, 8)).div(10)
    }
    const entierInf = decimal.floor()
    const entierSup = decimal.ceil()
    this.consigne = `Encadre $${texNombre(decimal, 1)}$ par deux entiers consécutifs : `
    this.question = `%{champ1}\\lt ${texNombre(decimal, 1)}\\lt %{champ2}`
    this.canEnonce = 'Encadre par deux entiers consécutifs.'
    this.canReponseACompleter = `$\\ldots < ${texNombre(decimal, 1)} < \\ldots$`
    this.reponse = { bareme: toutPourUnPoint, champ1: { value: entierInf, compare: numberCompare }, champ2: { value: entierSup, compare: numberCompare } }
    this.correction = `$${miseEnEvidence(texNombre(entierInf, 0))} < ${texNombre(decimal, 1)} < ${miseEnEvidence(texNombre(entierSup, 0))}$`
  }
}
