import { choice } from '../../../lib/outils/arrayOutils'
import { arrondi } from '../../../lib/outils/nombres'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Arrondir au dixième ou au centième'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/*!
 * Jean-Claude Lhote
 * Publié le 11 / 09 / 2021
 * Référence can6N06
 */
export const uuid = 'ad44e'
export const ref = 'can6N06'
export const refs = {
  'fr-fr': ['can6N06'],
  'fr-ch': []
}
export default function ArrondiDixiemeCentieme () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.consigne = ''
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    const a = randint(1, 20)
    const b = randint(0, 9, 5)
    const c = randint(1, 9, b)
    const e = randint(1, 9)
    const d = calculANePlusJamaisUtiliser(a + b * 0.1 + c * 0.01 + e * 0.001)
    if (choice([true, false])) {
      this.question = `Quel est l'arrondi au dixième de $${texNombre(d)}$ ?`
      if (c > 4) {
        this.correction = `Pour arrondir au dixième, on regarde le chiffre des centièmes : $${c}$.<br>
     Comme $${c}\\geqslant 5$, alors l'arrondi au dixième de $${texNombre(d)}$ est $${texNombre(arrondi(d, 1))}$.`
        this.reponse = arrondi(d, 1)
      } else {
        this.correction = `Pour arrondir au dixième, on regarde le chiffre des centièmes : $${c}$.<br>
        Comme $${c}< 5$, alors l'arrondi au dixième de $${texNombre(d)}$  est $${texNombre(arrondi(d, 1))}$.`
        this.reponse = arrondi(d, 1)
      }
    } else {
      this.question = `Quel est l'arrondi au centième de $${texNombre(d)}$ ?`
      if (e > 4) {
        this.correction = `Pour arrondir au centième, on regarde le chiffre des millièmes : $${e}$.<br>
     Comme $${e}\\geqslant 5$, alors l'arrondi au centième de $${texNombre(d)}$ est $${texNombre(arrondi(d, 2))}$.`
        this.reponse = arrondi(d, 2)
      } else {
        this.correction = `Pour arrondir au centième, on regarde le chiffre des millièmes : $${e}$.<br>
        Comme $${e}< 5$, alors l'arrondi au centième de $${texNombre(d)}$ est $${texNombre(arrondi(d, 2))}$.`
        this.reponse = arrondi(d, 2)
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
