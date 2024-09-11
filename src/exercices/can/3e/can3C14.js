import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils.js'
import Decimal from 'decimal.js'
import Exercice from '../../deprecatedExercice.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { pgcd } from '../../../lib/outils/primalite'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Passer d\'un décimal à une fraction irréductible'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '31/10/2022'
/*!
 * @author Gilles Mora
 */

export const uuid = '3f875'
export const ref = 'can3C14'
export const refs = {
  'fr-fr': ['can3C14'],
  'fr-ch': []
}
export default function DecimalVersFractionIr () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur01 inline'
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { fractionIrreductible: true }

  this.nouvelleVersion = function () {
    let a, d, maFraction, d1
    switch (choice([1, 2, 3])) { //, 2, 3
      case 1:// division par 10
        a = randint(1, 39, [10, 20, 30])
        d = new Decimal(a).div(10)
        maFraction = new FractionEtendue(a, 10)
        this.question = `Écrire $${texNombre(d, 1)}$ sous la forme d'une fraction irréductible.`
        this.correction = `
        $${texNombre(d, 1)}=${pgcd(a, 10) === 1 ? `${miseEnEvidence(maFraction.texFraction)}` : `${maFraction.texFraction}`} ${maFraction.texSimplificationAvecEtapes(false, '#f15929')}$
        `
        this.reponse = maFraction.simplifie()

        break
      case 2:// division par 100
        a = randint(1, 19, 10)
        d = new Decimal(a).div(100)
        maFraction = new FractionEtendue(a, 100)
        this.question = `Écrire $${texNombre(d, 2)}$ sous la forme d'une fraction irréductible.`
        this.correction = `
        $${texNombre(d, 2)}=${pgcd(a, 10) === 1 ? `${miseEnEvidence(maFraction.texFraction)}` : `${maFraction.texFraction}`} ${maFraction.texSimplificationAvecEtapes(false, '#f15929')}$
        `
        this.reponse = maFraction.simplifie()
        break

      case 3:// 0,25 et 0,75
        a = 2 * randint(0, 19) + 1
        d = new Decimal(a).div(4)
        maFraction = new FractionEtendue(a, 4)
        d1 = d.sub(Math.floor(a / 4))
        this.question = `Écrire $${texNombre(d, 2)}$ sous la forme d'une fraction irréductible.`
        if (a === 1 || a === 3) {
          this.correction = `$${texNombre(d, 3)}
        =${miseEnEvidence(maFraction.texFractionSimplifiee)}$ `
        } else {
          this.correction = `$${texNombre(d, 3)}=${Math.floor(a / 4)}+${texNombre(d.sub(Math.floor(a / 4)))}
        =\\dfrac{${Math.floor(a / 4) * 4}}{4}+${new FractionEtendue(d1 * 100, 100).simplifie().texFraction}=${miseEnEvidence(maFraction.texFractionSimplifiee)}$ `
        }
        this.reponse = maFraction.simplifie()
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
