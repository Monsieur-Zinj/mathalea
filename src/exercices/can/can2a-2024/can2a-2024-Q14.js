import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { texPrix } from '../../../lib/format/style'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Calculer un prix après des évolutions successives'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'd51f8'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = true
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteApres: '€' }
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      const valeurs = 100
      this.question = `Un article à $${valeurs}$ € subit une hausse de $10\\,\\%$ puis une baisse de $10\\,\\%$.<br>
        Son nouveau prix est maintenant de $100$ € ou $99$ € ?`

      this.correction = ` $10\\,\\%$ de  $100$ € est égal à $10$ €. <br>
       Après la hausse de $10\\,\\%$, le prix est de $100$ € $+$ $10$ € $=110$ €.<br>
       $10\\,\\%$ de  $110$ € est égal à $11$ €. <br>
       Après la baisse de $10\\,\\%$, le prix est de  $110$ € $-$ $11$ € $=99$ €.<br>
       Le nouveau prix est $${miseEnEvidence('99')}$ €. `
      this.reponse = 99
      this.canEnonce = `Un article à $${texNombre(valeurs)}$ € subit une hausse de $10\\,\\%$ puis une baisse de $10\\,\\%$.<br>
      Son nouveau prix est maintenant de $100$ € ou $99$ € ?`
      this.canReponseACompleter = ''
    } else {
      const valeurs = choice([[100, 10, 99], [1000, 1, 999.9], [1000, 10, 990], [10, 10, 9.9], [1, 10, 0.99], [100, 50, 75], [10, 50, 7.50]])
      const val1 = valeurs[0] + valeurs[0] * valeurs[1] / 100

      this.reponse = valeurs[2]

      this.question = `Un article à $${texNombre(valeurs[0])}$ € subit une hausse de $${valeurs[1]}\\,\\%$ puis une baisse de $${valeurs[1]}\\,\\%$.
        <br> Son nouveau prix est maintenant de : `
      this.correction = ` $${valeurs[1]}\\,\\%$ de  $${texNombre(valeurs[0])}$ € est égal à $${texNombre(valeurs[0] * valeurs[1] / 100, 2)}$ €. <br>
        Après la hausse de $${valeurs[1]}\\,\\%$, le prix est de $${texNombre(valeurs[0])}$ € $+$ $${texNombre(valeurs[0] * valeurs[1] / 100, 2)}$ € $=${texNombre(val1, 2)}$ €.<br>
        $${valeurs[1]}\\,\\%$ de  $${texNombre(val1)}$ € est égal à $${texNombre(val1 * valeurs[1] / 100, 2)}$ €. <br>
        Après la baisse de $${valeurs[1]}\\,\\%$, le prix est de  $${texNombre(val1)}$ € $-$ $${texNombre(val1 * valeurs[1] / 100, 2)}$ € $=${texNombre((val1 - val1 * valeurs[1] / 100))}$ €.<br>
        Le nouveau prix est $${miseEnEvidence(texPrix(valeurs[2]))}$ €. `
      this.canEnonce = `Un article à $${texNombre(valeurs[0])}$ € subit une hausse de $${texNombre(valeurs[1])}\\,\\%$ puis une baisse de $${texNombre(valeurs[1])}\\,\\%$.<br>
        Son nouveau prix est maintenant de :`
      this.canReponseACompleter = '$\\ldots$ €'
      if (!this.interactif) {
        this.question += '$\\ldots$ €'
      }
    }
  }
}
