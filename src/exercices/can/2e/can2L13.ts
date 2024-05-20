import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, ecritureParentheseSiNegatif, reduireAxPlusB, reduirePolynomeDegre3, rienSi1 } from '../../../lib/outils/ecritures'
export const titre = 'Développer avec la double distributivité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '07/04/2024'
export const uuid = '69fed'
export const refs = {
  'fr-fr': ['can2L13'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class DeveloppementDouble extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.clavierDeBaseAvecFractionPuissanceCrochets
    this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    switch (choice([1, 2, 3])) {
      case 1 :// (ax+b)(cx+d) avec a et c =1
        {
          const a = 1
          const b = randint(-10, 10, 0)
          const c = 1
          const d = randint(-10, 10, [0, b, -b])
          this.reponse = `${a * c}x^2+${b * c + a * d}x+${b * d}`
          this.reponse = { reponse: { value: this.reponse, compare: fonctionComparaison } }
          this.question = `Développer et réduire l'expression $(${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)})$.<br>`
          this.correction = `$\\begin{aligned}
            (${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)})&=${rienSi1(a * c)}x^2${ecritureAlgebriqueSauf1(a * d)}x${ecritureAlgebriqueSauf1(b * c)}x${ecritureAlgebrique(b * d)}\\\\
            &=${miseEnEvidence(reduirePolynomeDegre3(0, a * c, b * c + a * d, b * d))}
            \\end{aligned}$`
          this.correction += `<br>Le terme en $x^2$ vient de $${rienSi1(a)}x\\times ${c === 1 ? 'x' : `${ecritureParentheseSiNegatif(c)}x`}=${rienSi1(a * c)}x^2$.`
          this.correction += `<br>Le terme en $x$ vient de la somme de $${rienSi1(a)}x \\times ${ecritureParentheseSiNegatif(d)}$ et de $${b} \\times ${c === 1 ? 'x' : `${ecritureParentheseSiNegatif(c)}x`}$.`
          this.correction += `<br>Le terme constant vient de $${b}\\times ${ecritureParentheseSiNegatif(d)}= ${b * d}$.`
        }
        break
      case 2 :// (ax+b)(cx+d) avec a et c différent de 1
        { const a = randint(2, 4)
          const b = randint(-3, 3, 0)
          const c = randint(2, 4)
          const d = randint(-10, 10, [0, b, -b])
          this.reponse = `${a * c}x^2+${b * c + a * d}x+${b * d}`
          this.reponse = { reponse: { value: this.reponse, compare: fonctionComparaison } }
          this.question = `Développer et réduire l'expression $(${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)})$.<br>`
          this.correction = `$\\begin{aligned}
            (${reduireAxPlusB(a, b)})(${reduireAxPlusB(c, d)})&=${rienSi1(a * c)}x^2${ecritureAlgebriqueSauf1(a * d)}x${ecritureAlgebriqueSauf1(b * c)}x${ecritureAlgebrique(b * d)}\\\\
            &=${miseEnEvidence(reduirePolynomeDegre3(0, a * c, b * c + a * d, b * d))}
            \\end{aligned}$`
          this.correction += `<br>Le terme en $x^2$ vient de $${rienSi1(a)}x\\times ${c === 1 ? 'x' : `${ecritureParentheseSiNegatif(c)}x`}=${rienSi1(a * c)}x^2$.`
          this.correction += `<br>Le terme en $x$ vient de la somme de $${rienSi1(a)}x \\times ${ecritureParentheseSiNegatif(d)}$ et de $${b} \\times ${c === 1 ? 'x' : `${ecritureParentheseSiNegatif(c)}x`}$.`
          this.correction += `<br>Le terme constant vient de $${b}\\times ${ecritureParentheseSiNegatif(d)}= ${b * d}$.`
        }
        break
      case 3 :// a^2-b^2
        { const a = randint(1, 2)
          const b = randint(-3, 3, 0)
          const c = randint(1, 2)
          const d = randint(-10, 10, [0, b])
          this.reponse = `${a * c}x^2+${b * c + a * d}x+${b * d}`
          this.reponse = { reponse: { value: this.reponse, compare: fonctionComparaison } }
          this.question = `Développer et réduire l'expression $(${b}${ecritureAlgebriqueSauf1(a)}x)(${reduireAxPlusB(c, d)})$.<br>`
          this.correction = `$\\begin{aligned}
            (${b}${ecritureAlgebriqueSauf1(a)}x)(${reduireAxPlusB(c, d)})&=${rienSi1(b * a)}x${ecritureAlgebrique(b * d)}${ecritureAlgebriqueSauf1(a * c)}x^2${ecritureAlgebrique(a * d)}x\\\\
            &=${miseEnEvidence(reduirePolynomeDegre3(0, a * c, b * c + a * d, b * d))}
            \\end{aligned}$`
          this.correction += `<br>Le terme en $x^2$ vient de $${rienSi1(a)}x\\times ${c === 1 ? 'x' : `${ecritureParentheseSiNegatif(c)}x`}=${rienSi1(a * c)}x^2$.`
          this.correction += `<br>Le terme en $x$ vient de la somme de $${rienSi1(a)}x \\times ${ecritureParentheseSiNegatif(d)}$ et de $${b} \\times ${c === 1 ? 'x' : `${ecritureParentheseSiNegatif(c)}x`}$.`
          this.correction += `<br>Le terme constant vient de $${b}\\times ${ecritureParentheseSiNegatif(d)}= ${b * d}$.`
        }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
