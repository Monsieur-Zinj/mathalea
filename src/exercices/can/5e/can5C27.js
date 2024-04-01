import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureNombreRelatif, ecritureNombreRelatifc } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const interactifType = 'mathLive'
export const interactifReady = true
export const titre = 'Trouver un  entier relatif (addition à trou)'
export const dateDePublication = '19/10/2023'
/*!
 * @author  Gilles Mora (J'ai repris l'ex 5R20-2)
 *
 * Référence can5C27
 */
export const uuid = '2745a'
export const refs = {
  'fr-fr': ['can5C27'],
  'fr-ch': []
}
export default function AdditionRelatifATrou () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.sup = 20
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    this.formatChampTexte = 'largeur15 inline'
    this.formatInteractif = 'calcul'

    let a = randint(1, this.sup)
    let b = randint(1, this.sup)
    const k = choice([[-1, -1], [-1, 1], [1, -1]]) // Les deux nombres relatifs ne peuvent pas être tous les deux positifs
    a = a * k[0]
    b = b * k[1]
    const termes = [ecritureNombreRelatif(a), '\\ldots\\ldots', ecritureNombreRelatifc(a), ecritureNombreRelatifc(b)]
    const rang1 = randint(0, 1)
    const rang2 = 1 - rang1
    this.question = 'Quel nombre doit-on écrire pour que l\'égalité soit correcte ? <br>'
    this.question += '$ ' + termes[rang1] + ' + ' + termes[rang2] + ' = ' + ecritureNombreRelatif(a + b) + ' $'

    this.correction = '$ ' + termes[rang1 + 2] + ' + ' + termes[rang2 + 2] + ' = ' + ecritureNombreRelatifc(a + b) + ' $'
    this.reponse = b

    this.canEnonce = 'Compléter.'
    this.canReponseACompleter = '$ ' + termes[rang1] + ' + ' + termes[rang2] + ' = ' + ecritureNombreRelatif(a + b) + ' $'
  }
}
