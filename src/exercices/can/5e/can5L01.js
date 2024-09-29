import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Trouver $a+1$ ou $a-1$ connaissant $2a$'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * Date de publication
*/
export const uuid = 'cc70a'
export const ref = 'can5L01'
export const refs = {
  'fr-fr': ['can5L01'],
  'fr-ch': []
}
export default function MoitiePlusOuMoinsUn () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur01 inline'
  this.nouvelleVersion = function () {
    const a = randint(21, 35, 30) / 10
    if (choice([true, false])) {
      this.reponse = calculANePlusJamaisUtiliser(a / 2 + 1)
      this.question = `On a  $2\\times a=${texNombre(a)}$, combien vaut $a+1$ ?`
      this.correction = `$2\\times a=${texNombre(a)}$, donc le nombre $a$ est égal à $\\dfrac{${texNombre(a)}}{2}=${texNombre(a / 2)}$.<br>Donc $a+1=${texNombre(a / 2)}+1=${texNombre(a / 2 + 1)}$.`
    } else {
      this.reponse = calculANePlusJamaisUtiliser(a / 2 - 1)
      this.question = `On a  $2\\times a=${texNombre(a)}$, combien vaut $a-1$ ?`
      this.correction = `$2\\times a=${texNombre(a)}$, donc le nombre $a$ est égal à $\\dfrac{${texNombre(a)}}{2}=${texNombre(a / 2)}$.<br>Donc $a-1=${texNombre(a / 2)}-1=${texNombre(a / 2 - 1)}$.`
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
