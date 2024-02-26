import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Calculer une expression pour une valeur particulière'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ca76e'
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
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore'
    this.formatInteractif = 'calcul'
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.question = 'Valeur de $9x+2$ pour $x=-2$ '
      this.correction = `Pour $x=-2$, on obtient :  <br>
          $9\\times(-2)+2=-18+2=${miseEnEvidence('-16')}$.`
      this.reponse = '-16'
    } else {
      const a = randint(2, 6)
      const b = randint(3, 5)
      const truc = randint(-4, -2)
      const choix = choice([true, false])
      this.question = `Valeur de ${choix ? `$${a}+${b}x$` : `$${b}x+${a}$`} pour $x=${truc}$ `
      this.correction = `Pour $x=${truc}$, on obtient :  
            ${choix ? `$${a}+${b}x=${a}+${b}\\times(${truc})=${miseEnEvidence(a + b * truc)}$.` : `$${b}x+${a}=${b}\\times(${truc})+${a}=${miseEnEvidence(a + b * truc)}$.`}
            `
      this.reponse = a + b * truc
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
