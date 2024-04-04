import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { factorisationCompare } from '../../../lib/interactif/comparisonFunctions'
import { choice } from '../../../lib/outils/arrayOutils'
import { reduireAxPlusB, rienSi1 } from '../../../lib/outils/ecritures'
export const titre = 'Factoriser avec une égalité remarquable'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '04/04/2024'
export const uuid = 'a1cb3'
export const refs = {
  'fr-fr': ['can2L12'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class FatorisationEgR extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.clavierDeBaseAvecFractionPuissanceCrochets
    this.formatInteractif = 'calcul'
    this.compare = factorisationCompare
  }

  nouvelleVersion () {
    switch (choice([1, 3])) {
      case 1 :// (ax+b)^2
        {
          const a = randint(1, 2)
          const b = randint(1, 6)
          const choix = choice([true, false])
          this.reponse = `(${reduireAxPlusB(a, b)})^2`
          this.question = ` Factoriser  : ${this.interactif ? '<br>' : ''} ${choix
? `$${rienSi1(a ** 2)}x^2+${reduireAxPlusB(2 * a * b, b ** 2)}$${this.interactif ? ' $=$' : '.'}`
      : `$${reduireAxPlusB(2 * a * b, b ** 2)}+${rienSi1(a ** 2)}x^2$${this.interactif ? ' $=$' : '.'}`}`//
          this.correction = `On reconnaît le développement de l'égalité remarquable : <br>
          $(a+b)^2=a^2+2ab+b^2$ avec $a=${rienSi1(a)}x$ et $b=${b}$.<br>
          On a donc :
     
      ${choix
        ? `$${rienSi1(a ** 2)}x^2+${reduireAxPlusB(2 * a * b, b ** 2)}=${miseEnEvidence(`(${reduireAxPlusB(a, b)})^2`)}$`
              : `$${reduireAxPlusB(2 * a * b, b ** 2)}+${rienSi1(a ** 2)}x^2=${miseEnEvidence(`(${reduireAxPlusB(a, b)})^2`)}$`}`
        }
        break
      case 2 :// (a-b)^2
        {
          const a = randint(1, 2)
          const b = randint(1, 6)
          const choix = choice([true, false])
          this.reponse = `(${reduireAxPlusB(a, -b)})^2`
          this.question = ` Factoriser  : ${this.interactif ? '<br>' : ''} ${choix
? `$${rienSi1(a ** 2)}x^2-${reduireAxPlusB(2 * a * b, b ** 2)}$${this.interactif ? ' $=$' : '.'}`
    : `$${reduireAxPlusB(-2 * a * b, b ** 2)}+${rienSi1(a ** 2)}x^2$${this.interactif ? ' $=$' : '.'}`}`//
          this.correction = `On reconnaît le développement de l'égalité remarquable : <br>
        $(a-b)^2=a^2-2ab+b^2$ avec $a=${rienSi1(a)}x$ et $b=${b}$.<br>
        On a donc :
   
    ${choix
      ? `$${rienSi1(a ** 2)}x^2${reduireAxPlusB(-2 * a * b, b ** 2)}=${miseEnEvidence(`(${reduireAxPlusB(a, -b)})^2`)}$`
            : `$${reduireAxPlusB(-2 * a * b, b ** 2)}+${rienSi1(a ** 2)}x^2=${miseEnEvidence(`(${reduireAxPlusB(a, -b)})^2`)}$`}`
        }
        break
      case 3 :// a^2-b^2
        {
          const a = randint(1, 3)
          const b = randint(1, 10)
          const choix = choice([true, false])
          this.reponse = choix ? `(${reduireAxPlusB(a, -b)})(${reduireAxPlusB(a, b)})` : `(${reduireAxPlusB(a, b)})(${reduireAxPlusB(-a, b)})`
          this.question = ` Factoriser  : ${this.interactif ? '<br>' : ''} ${choix
  ? `$${rienSi1(a ** 2)}x^2-${b ** 2}$${this.interactif ? ' $=$' : '.'}`
      : `$${b ** 2}-${rienSi1(a ** 2)}x^2$${this.interactif ? ' $=$' : '.'}`}`//
          this.correction = `On reconnaît le développement de l'égalité remarquable : <br>
          $(a+b)(a-b)=a^2-b^2$ avec $a=${choix ? `${rienSi1(a)}x` : `${b}`}$ et $b=${choix ? `${b}` : `${rienSi1(a)}x`}$.<br>
          On a donc :
      ${choix
        ? `$${rienSi1(a ** 2)}x^2-${b ** 2}=${miseEnEvidence(`(${reduireAxPlusB(a, -b)})(${reduireAxPlusB(a, b)})`)}$`
              : `$${b ** 2}-${rienSi1(a ** 2)}x^2=${miseEnEvidence(`(${b}+${rienSi1(a)}x)(${b}-${rienSi1(a)}x)`)}$`}`
        }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
