import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, rienSi1, ecritureAlgebriqueSauf1 } from '../../../lib/outils/ecritures'
import { randint } from '../../../modules/outils.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Déterminer un coefficient directeur'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '32d90'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = '-2'
      this.question = 'Coefficient directeur de la droite d’équation $y=-2x+3$<br>'
      this.correction = `L'équation de la droite est de la forme $y=mx+p$.<br>
     Le coefficient directeur est $m$ et l'ordonnée à l'origine est $p$. <br>
    Le coefficient directeur de la droite est donc $m=${miseEnEvidence('-2')}$.`
    } else {
      const a = randint(-9, 9, 0)
      const b = randint(-9, 9, 0)
      const choix = choice([true, false])
      this.reponse = a
      this.question = `Coefficient directeur de la droite d’équation ${choix ? `$y=${rienSi1(a)}x${ecritureAlgebrique(b)}$` : `$y=${b}${ecritureAlgebriqueSauf1(a)}x$`}`
      this.correction = `L'équation de la droite est de la forme $y=mx+p$.<br>
       Le coefficient directeur est $m$ et l'ordonnée à l'origine est $p$. <br>
      Le coefficient directeur de la droite est donc $m=${miseEnEvidence(this.reponse)}$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
