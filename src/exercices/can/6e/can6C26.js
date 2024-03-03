import { choice } from '../../../lib/outils/arrayOutils'
import { deprecatedTexFraction } from '../../../lib/outils/deprecatedFractions.js'
import { arrondi } from '../../../lib/outils/nombres'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Multiplier ou diviser par 10, 100,  1000 ou 0,1 ou 0,01'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora & Jean-Claude Lhote
 * Référence can6C26
 * Date de publication 21/10/2021
*/
export const uuid = '31096'
export const ref = 'can6C26'
export const refs = {
  'fr-fr': ['can6C26'],
  'fr-ch': []
}
export default function MultiplierDiviserPar10Par100Par1000 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    let a, b, den, resultat
    switch (choice([1, 2, 3])) { //, 2, 3
      case 1:// multiplier par 10, 100 ou 1000
        a = choice([randint(11, 99), randint(100, 999)])
        a /= choice([10, 100, 1000, 10000])
        b = choice([10, 100, 1000])
        resultat = arrondi(a * b, 3)
        this.question = `Calculer $${texNombre(a, 4)}\\times ${texNombre(b, 0)}$.`
        this.correction = `$${texNombre(a, 4)}\\times ${texNombre(b, 0)} = ${texNombre(resultat, 3)}$`
        this.reponse = resultat
        break

      case 2:// multiplier par 0,1....
        a = randint(10, 1000)
        b = choice([0.1, 0.01, 0.001])
        resultat = arrondi(a * b, 3)
        this.question = `Calculer $${texNombre(a, 0)}\\times${texNombre(b, 3)}$.`
        this.correction = `$${texNombre(a)}\\times ${texNombre(b, 3)} = ${texNombre(resultat, 3)}$`
        this.reponse = resultat
        break
      case 3:// multiplier par 10, 100 et fractions /10, /100....
        a = choice([randint(11, 99), randint(100, 999), randint(2, 9)])
        den = choice([10, 100, 1000])
        b = choice([10, 100, 1000])
        resultat = arrondi(a * b / den, 3)
        this.question = `Calculer $${deprecatedTexFraction(a, den)}\\times${texNombre(b)}$.`
        this.correction = `$${deprecatedTexFraction(a, den)} \\times ${texNombre(
                b)} = ${deprecatedTexFraction(a * b, den)} = ${texNombre((a / den) * b, 3)}$`
        this.reponse = resultat
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}

//
//    v = choice(listeviennoiserie)
//   p = v[0]
//   s = v[1]
