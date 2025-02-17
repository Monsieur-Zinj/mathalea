import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { signe } from '../../../lib/outils/nombres'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Développer avec la simple distributivité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Gilles Mora
 */
export const uuid = '56a2d'
export const ref = 'can4L05'
export const refs = {
  'fr-fr': ['can4L05'],
  'fr-ch': []
}
export default function DeveloppementNiveau1 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.date = 1635092507483
  this.nouvelleVersion = function () {
    this.formatChampTexte = ''
    let a, b, k, inconnue
    switch (randint(1, 2)) {
      case 1:// developpement k*(a+b)
        a = randint(1, 4)
        b = randint(1, 9) * choice([-1, 1])
        k = randint(2, 7) * choice([-1, 1])
        inconnue = choice(['x', 'y'])
        if (a === 1) {
          // ne pas écrire 1x
          this.question = `Développer $A=(${inconnue}${ecritureAlgebrique(b)})\\times${ecritureParentheseSiNegatif(k)}$.`
          this.correction = ` $A=(${inconnue}${ecritureAlgebrique(b)})\\times${ecritureParentheseSiNegatif(k)}=${k}\\times ${inconnue}+${ecritureParentheseSiNegatif(k)}\\times${ecritureParentheseSiNegatif(b)}=${k * a}${inconnue}${ecritureAlgebrique(k * b)}$`
          this.reponse = `${k * a}${inconnue}${ecritureAlgebrique(k * b)}`
        } else {
          this.question = `Développer $A=(${a}${inconnue}${ecritureAlgebrique(b)})\\times${ecritureParentheseSiNegatif(k)}$.`
          this.correction = `$A=(${a}${inconnue}${ecritureAlgebrique(b)})\\times${ecritureParentheseSiNegatif(k)}=${k}\\times ${a}${inconnue}+${ecritureParentheseSiNegatif(k)}\\times${ecritureParentheseSiNegatif(b)}=${k * a}${inconnue}${ecritureAlgebrique(k * b)}$`
          this.reponse = `${k * a}${inconnue}${ecritureAlgebrique(k * b)}`
        }
        break

      case 2:// developpement kx*(a+b)
        a = randint(1, 4)
        b = randint(1, 9) * choice([-1, 1])
        k = randint(2, 7) * choice([-1, 1])
        inconnue = choice(['x', 'y'])
        if (a === 1) {
          // ne pas écrire 1x
          this.question = `Développer $A=${k}${inconnue}(${inconnue}${ecritureAlgebrique(b)})$.`
          this.correction = `$A=${k}${inconnue}(${inconnue}${ecritureAlgebrique(b)})=${k}${inconnue}\\times ${inconnue} ${signe(k * b)}${k}${inconnue}\\times ${Math.abs(b)}=${k * a}${inconnue}^2${ecritureAlgebrique(k * b)}${inconnue}$`
          this.reponse = `${k * a}${inconnue}^2${ecritureAlgebrique(k * b)}${inconnue}`
        } else {
          this.question = `Développer $A=${k}${inconnue}(${a}${inconnue}${ecritureAlgebrique(b)})$.`
          if (k > 0) {
            this.correction = `$A=${k}${inconnue}(${a}${inconnue}${ecritureAlgebrique(b)})=${k}${inconnue}\\times ${a}${inconnue} + ${k}${inconnue}\\times ${ecritureParentheseSiNegatif(b)}=${k * a}${inconnue}^2${ecritureAlgebrique(k * b)}${inconnue}$`
            this.reponse = `${k * a}${inconnue}^2${ecritureAlgebrique(k * b)}${inconnue}`
          } else {
            this.correction = `$A=${k}${inconnue}(${a}${inconnue}${ecritureAlgebrique(b)})=${k}${inconnue}\\times ${a}${inconnue} + (${k}${inconnue})\\times ${ecritureParentheseSiNegatif(b)}=${k * a}${inconnue}^2${ecritureAlgebrique(k * b)}${inconnue}$`
            this.reponse = `${k * a}${inconnue}^2${ecritureAlgebrique(k * b)}${inconnue}`
          }
        }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
