import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Déterminer une image par une fonction affine (non définie explicitement)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '30/04/2024'
export const uuid = 'b9c80'
export const refs = {
  'fr-fr': ['can2F20'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class ImageFctAff extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    // this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    const nom = ['f', 'g', 'h']
    const nomF = choice(nom)
    const x1 = randint(1, 10)
    const x2 = x1 + 1
    const imx1 = randint(1, 5)
    const imx2 = randint(imx1 + 1, 10)
    const val = x2 + 1

    this.reponse = texNombre(2 * imx2 - imx1)
    this.question = `$${nomF}$ est une fonction affine vérifiant $${nomF}(${x1})=${imx1}$ et $${nomF}(${x2})=${imx2}$.<br>`
    if (this.interactif) { this.question += `$${nomF}(${val})=$` } else { this.question += `Quelle est la valeur de $${nomF}(${val})$ ?` }
    this.correction = `Les images données permettent d'établir qu'une augmentation d'une unité en abscisse   augmentent l'ordonnée de  $${imx2 - imx1}$ unités.<br>
          Ainsi, l'image de $${val}$ par $${nomF}$ est $${imx2}+${imx2 - imx1}=${miseEnEvidence(texNombre(2 * imx2 - imx1))}$.`

    this.canEnonce = `$${nomF}$ est une fonction affine vérifiant $${nomF}(${x1})=${imx1}$ et $${nomF}(${x2})=${imx2}$.`
    this.canReponseACompleter = `$${nomF}(${val})=\\ldots$`
  }
}
