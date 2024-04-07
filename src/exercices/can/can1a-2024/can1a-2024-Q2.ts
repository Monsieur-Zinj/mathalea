import Exercice from '../../Exercice'
import { texteEnCouleurEtGras } from '../../../lib/outils/embellissements'
import { propositionsQcm } from '../../../lib/interactif/qcm'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, reduirePolynomeDegre3 } from '../../../lib/outils/ecritures'
export const titre = 'Déterminer un point sur une courbe'
export const interactifReady = true
export const interactifType = 'qcm'
export const uuid = '5157a'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class PointsCourbe extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.formatInteractif = 'qcm'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    // const [aa, bb, cc] = this.canOfficielle ? [5, 'dixièmes', 10] : choice([[randint(2, 50), 'dixièmes', 10], [randint(20, 500), 'centièmes', 100], [randint(200, 5000), 'millièmes', 1000]])
    const a = this.canOfficielle ? -1 : randint(-5, 5, 0)
    const abs = this.canOfficielle ? -2 : randint(-3, 3, 0)
    const ord = this.canOfficielle ? 3 : choice([abs ** 2 + a, abs ** 2 + a + choice([-1, 1])])
    // ça sert à rien c'est un qcm, les réponses sont gérées par les cases à cocher.
    /*
    if (this.canOfficielle) {
      this.reponse = 'VRAI'
    } else {
      this.reponse = ord === abs ** 2 + a ? 'VRAI' : 'FAUX'
    }
     */
    this.correction = `Le point $A$ est sur la parabole si son ordonnée est égale à l'image de son abscisse. <br>
    $\\begin{aligned}
        f(${abs})&=${ecritureParentheseSiNegatif(abs)}^2${ecritureAlgebrique(a)}\\\\
        &=${abs ** 2 + a}
        \\end{aligned}$
        <br>
        ${abs ** 2 + a === ord
? `Le point $A$ est bien sur la parabole.<br> L'affirmation est ${texteEnCouleurEtGras('VRAIE')}`
        : `Puisque $${abs ** 2 + a} \\neq ${ord}$, le point $A$ n'est pas sur la parabole. <br>L'affirmation est ${texteEnCouleurEtGras('FAUSSE')}`}`

    this.question = `Affirmation : <br>
    Le point $A(${abs}\\,;\\,${ord})$ appartient à la parabole d'équation $y=${reduirePolynomeDegre3(0, 1, 0, a)}$ `
    // c'est ça qui fait le this.reponse !
    this.autoCorrection[0] = {
      options: { ordered: true },
      enonce: this.question,
      propositions: [
        {
          texte: 'VRAI ',
          statut: ord === abs ** 2 + a
        },
        {
          texte: 'FAUX',
          statut: ord !== abs ** 2 + a
        }
      ]
    }
    const qcm = propositionsQcm(this, 0)
    this.question += qcm.texte

    this.canEnonce = `Affirmation : <br>
    Le point $A(${abs}\\,;\\,${ord})$ appartient à la parabole d'équation $y=${reduirePolynomeDegre3(0, 1, 0, a)}$ `
    this.canReponseACompleter = '$\\Box$ VRAI <br>$\\Box$ FAUX'
  }
}
