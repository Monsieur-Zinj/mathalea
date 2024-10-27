import { rienSi1 } from '../../../lib/outils/ecritures'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Calculer avec une puissance de 10'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Créé pendant l'été 2021
 * Référence can3C05
 * Date de publication
*/
export const uuid = 'ce089'
export const ref = 'can3C05'
export const refs = {
  'fr-fr': ['can3C05'],
  'fr-ch': []
}
export default function CalculPuissance10 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(1, 6)
    const n = calculANePlusJamaisUtiliser(2 * randint(1, 6) + 1) / 2
    const N = calculANePlusJamaisUtiliser(2 * randint(1, 6, a) + 1) / 2
    const c = randint(1, 3)
    const d = randint(1, 3)
    this.question = `Calculer sous forme décimale $B=${texNombre(n)}\\times 10^{${rienSi1(c)}}+${texNombre(N)}\\times 10^{${rienSi1(d)}}$.`
    this.correction = `$B=${texNombre(n)}\\times 10^{${rienSi1(c)}}+${texNombre(N)}\\times 10^{${rienSi1(d)}}=${texNombre(n * 10 ** c)}+${texNombre(N * 10 ** d)}=${texNombre(n * 10 ** c + N * 10 ** d)}$.`
    this.reponse = calculANePlusJamaisUtiliser(n * 10 ** c + N * 10 ** d)
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
