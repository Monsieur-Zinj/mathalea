import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Convertir en mètres'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 * Référence can6M03
 */
export const uuid = 'd52aa'
export const ref = 'can6M03'
export const refs = {
  'fr-fr': ['can6M03'],
  'fr-ch': []
}
export default function ConvertirEnM () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let a
    if (choice([true, false])) {
      a = randint(0, 5) * 10 + randint(1, 9)
      this.reponse = calculANePlusJamaisUtiliser(a * 1000)
      this.question = `$${a}$ km font combien de mètres ?`
      this.correction = `Comme $1$ km $=1000$ m, $${a}$ km = $${texNombre(this.reponse)}$ m.`
      this.formatChampTexte = ''
      this.optionsChampTexte = { texteApres: ' m' }
    } else {
      a = randint(11, 24) * 10 + randint(0, 9)
      this.reponse = calculANePlusJamaisUtiliser(a / 100)
      this.question = `$${a}$ cm font combien de mètres ?`
      this.correction = `Comme $1$ cm $=0,01$ m, $${a}$ cm = $${texNombre(this.reponse)}$ m.`
      this.formatChampTexte = ''
      this.optionsChampTexte = { texteApres: ' m' }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ m'
  }

  // this.besoinFormulaireNumerique = ['Type de questions', 2, '1 : km vers m\n2 : cm vers m']
}
