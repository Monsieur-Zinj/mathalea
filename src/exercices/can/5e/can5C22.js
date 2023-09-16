import { choice } from '../../../lib/outils/arrayOutils.js'
import { texNombre } from '../../../lib/outils/texNombre.js'
import { randint } from '../../../modules/outils.js'
import Decimal from 'decimal.js'
import Exercice from '../../Exercice.js'
import FractionEtendue from '../../../modules/FractionEtendue.js'
export const titre = 'Passer d\'un décimal à une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '31/10/2022'
/*!
 * @author Gilles Mora
 */

export const uuid = '67f09'
export const ref = 'can5C22'
export default function DecimalVersFraction () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let a, d, maFraction
    this.formatChampTexte = 'largeur15 inline'
    this.formatInteractif = 'fractionEgale'
    a = randint(1, 39, [10, 20, 30])
    switch (choice([1, 2, 3])) {
      case 1:// division par 10
        d = new Decimal(a).div(10)
        maFraction = new FractionEtendue(a, 10)
        this.correction = `Il y a plusieurs réponses possibles (une fraction simplifiée, une fraction non simplifiée, une fraction décimale). <br>
        $${texNombre(d, 1)}=\\dfrac{${texNombre(d * 10, 0)}}{10}${maFraction.texSimplificationAvecEtapes()}$ `
        break
      case 2:// division par 100
        d = new Decimal(a).div(100)
        maFraction = new FractionEtendue(a, 100)
        this.correction = `Il y a plusieurs réponses possibles (une fraction simplifiée, une fraction non simplifiée, une fraction décimale). <br>
        $${texNombre(d, 2)}=\\dfrac{${texNombre(d * 100, 2)}}{100}${maFraction.texSimplificationAvecEtapes()}$ `
        break

      case 3:// division par 1000
        a = choice([a, randint(201, 299, [210, 220, 230, 240, 250, 260, 270, 280, 290])])
        d = new Decimal(a).div(1000)
        maFraction = new FractionEtendue(a, 1000)
        this.correction = `Il y a plusieurs réponses possibles (une fraction simplifiée, une fraction non simplifiée, une fraction décimale). <br>
        $${texNombre(d, 3)}=\\dfrac{${texNombre(d * 1000, 3)}}{1000}${maFraction.texSimplificationAvecEtapes()}$ `
        break
    }
    this.question = `Écrire $${texNombre(d, 3)}$ sous la forme d'une fraction.`
    this.reponse = maFraction
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
