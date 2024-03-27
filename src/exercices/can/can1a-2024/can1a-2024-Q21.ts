import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { propositionsQcm } from '../../../lib/interactif/qcm'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Calculer la somme des termes d\'une suite géométrique'
export const interactifReady = true
export const interactifType = 'qcm'
export const uuid = 'aa8e3'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class SommeTermesSG extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.formatInteractif = 'qcm'
    this.canOfficielle = true
  }

  nouvelleVersion () {
    const n = this.canOfficielle ? 16 : randint(12, 25)
    const choix = choice([true, false])
    let premierTerme = choice(['1', 'q'])
    if (this.canOfficielle) {
      this.reponse = `\\dfrac{1-q^{${n}+1}}{1-q}$`
      premierTerme = '1'
    } else {
      this.reponse = choix === true ? '$\\dfrac{1-q^{17}}{1-q}$' : '$\\dfrac{1-q^{16}}{1-q}$'
    }
    this.correction = `Il s'agit de la somme des termes d'une suite géométrique de raison $q$ et de premier terme ${premierTerme === '1' ? '$1$ ' : '$q$ '}.<br>
   Comme cette somme se calcule par $\\dfrac{1-q^{\\text{nombre de termes}}}{1-q}$, 
   on obtient ${premierTerme === '1'
? `$1+q+q^2+\\ldots+q^{${n}}=${miseEnEvidence(`\\dfrac{1-q^{${n + 1}}}{1-q}`)}$ `
   : `$q+q^2+\\ldots+q^{${n}}=${miseEnEvidence(`\\dfrac{1-q^{${n}}}{1-q}`)}$ `}`
    this.autoCorrection[0] = {
      options: { ordered: true },
      propositions: [
        {
          texte: `$\\dfrac{1-q^{${n}}}{1-q}$ `,
          statut: premierTerme !== '1'
        },
        {
          texte: `$\\dfrac{1-q^{${n + 1}}}{1-q}$`,
          statut: premierTerme === '1'
        }
      ]

    }
    const qcm = propositionsQcm(this, 0)

    this.question = `$q\\neq 1$ <br>
    ${premierTerme === '1' ? `$1+q+q^2+\\ldots+q^{${n}}=$ ` : `$q+q^2+\\ldots+q^{${n}}=$ `}` + qcm.texte

    this.canEnonce = `$q\\neq 1$ <br>
    ${premierTerme === '1' ? `$1+q+q^2+\\ldots+q^{${n}}=$ ` : `$q+q^2+\\ldots+q^{${n}}=$ `}`
    this.canReponseACompleter = `$\\Box$ $\\dfrac{1-q^{${n + 1}}}{1-q}$ <br>$\\Box$ $\\dfrac{1-q^{${n}}}{1-q}$`
  }
}
