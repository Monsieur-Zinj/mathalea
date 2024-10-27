import { choice } from '../../../lib/outils/arrayOutils'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import Decimal from 'decimal.js'
import { randint } from '../../../modules/outils.js'
import FractionEtendue from '../../../modules/FractionEtendue'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Écrire sous la forme d’un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '19/12/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '07/02/2024'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export const uuid = '802cc'
export const ref = 'can5P06'
export const refs = {
  'fr-fr': ['can5P06'],
  'fr-ch': []
}
export default function ÉcrirePourcentage () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ' '
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    const listeFractions1 = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
      [1, 10], [3, 10], [7, 10], [9, 10], [3, 25], [9, 25], [13, 25], [9, 50], [17, 50], [9, 20], [3, 20], [17, 20]]
    switch (choice(['a', 'b', 'c', 'd'])) { //
      case 'a':
        {
          const a = new Decimal(randint(10, 99)).div(100)
          this.question = `Compléter : $${texNombre(a)}=$`
          if (this.interactif) { this.optionsChampTexte = { texteApres: ' $\\%$' } } else { this.question += `${sp(1)} $\\ldots${sp(1)}\\%$` }
          this.correction = `$${texNombre(a)}=\\dfrac{${texNombre(a * 100, 0)}}{100}=${miseEnEvidence(texNombre(a * 100))} ${sp()}\\%$`
          this.reponse = a.mul(100)
          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$${texNombre(a)}=.... ${sp()}\\%$` }
        break
      case 'b':
        {
          const a = randint(0, 99)
          const dec = new Decimal(a).div(1000)
          const pourc = new Decimal(a).div(10)
          this.question = `Compléter : $${texNombre(dec, 3)}=$`
          if (this.interactif) { this.optionsChampTexte = { texteApres: ' $\\%$' } } else { this.question += `${sp(1)} $\\ldots${sp(1)}\\%$` }
          this.correction = `$${texNombre(dec, 3)}=\\dfrac{${texNombre(pourc, 2)}}{100}=${miseEnEvidence(texNombre(pourc, 2))} ${sp()}\\%$`
          this.reponse = pourc
          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$${texNombre(dec, 3)}=.... ${sp()}\\%$`
        }
        break

      case 'c':
        {
          const a = randint(0, 99)
          const dec = new Decimal(a).div(10000)
          const pourc = new Decimal(a).div(100)
          this.question = `Compléter : $${texNombre(dec, 4)}=$`
          if (this.interactif) { this.optionsChampTexte = { texteApres: ' $\\%$' } } else { this.question += `${sp(1)} $\\ldots${sp(1)}\\%$` }
          this.correction = `$${texNombre(dec, 4)}=\\dfrac{${texNombre(pourc, 3)}}{100}=${miseEnEvidence(texNombre(pourc, 3))} ${sp()}\\%$`
          this.reponse = pourc
          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$${texNombre(dec, 4)}=.... ${sp()}\\%$`
        }
        break
      case 'd':
        {
          const fraction = choice(listeFractions1)
          const n = fraction[0]
          const d = fraction[1]
          const frac = new FractionEtendue(n, d)

          this.question = `Compléter : $${frac.texFraction}=$`
          if (this.interactif) { this.optionsChampTexte = { texteApres: ' $\\%$' } } else { this.question += `${sp(1)} $\\ldots${sp(1)}\\%$` }
          this.correction = `$${frac.texFraction}=\\dfrac{${texNombre(n)}\\times ${texNombre(100 / d, 0)}}{${texNombre(d)}\\times ${texNombre(100 / d, 0)}}=
        \\dfrac{${texNombre((n * 100) / d, 0)}}{100}=${miseEnEvidence(texNombre((n * 100) / d, 0))} ${sp()}\\%$`
          this.reponse = (n * 100) / d
          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$${frac.texFraction}=.... ${sp()}\\%$` }
        break
    }
  }
}
