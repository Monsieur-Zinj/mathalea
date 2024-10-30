import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Déterminer un nombre à partir de son nombre de centaines, dizaines'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '01/07/2022'
export const dateDeModifImportante = '26/10/2024'
/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6N02
 */
export const uuid = '75d40'
export const ref = 'can6N02'
export const refs = {
  'fr-fr': ['can6N02'],
  'fr-ch': []
}
export default function RecomposerEntierSimple () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const c = randint(2, 30)
    const d = randint(2, 30)
    switch (choice([1, 2])) { //
      case 1:
        this.reponse = c * 100
        this.question = `Écrire le nombre égal à $${c}$ centaines.`
        this.correction = `$${c} \\times 100 =${miseEnEvidence(texNombre(c * 100))}$`
        break

      case 2:
        this.reponse = d * 10
        this.question = `Écrire le nombre égal à $${texNombre(d)}$ dizaines. `
        this.correction = `$${texNombre(d)} \\times 10 = ${miseEnEvidence(texNombre(d * 10))}$`
        break
    }
    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
