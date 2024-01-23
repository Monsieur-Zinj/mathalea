import { choice } from '../../../lib/outils/arrayOutils'
import { deprecatedTexFraction } from '../../../lib/outils/deprecatedFractions.js'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Écrire sous la forme d’un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '19/12/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export const uuid = '802cc'
export const ref = 'can5P06'
export default function ÉcrirePourcentage () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let a, b, fraction, n, d
    const listeFractions1 = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
      [1, 10], [3, 10], [7, 10], [9, 10], [3, 25], [9, 25], [13, 25], [9, 50], [17, 50], [9, 20], [3, 20], [17, 20]]
    switch (choice(['a', 'b', 'c'])) { //
      case 'a':
        a = calculANePlusJamaisUtiliser(randint(10, 99) / 100)
        this.question = `Compléter : $${texNombre(a)}=$`
        if (this.interactif) { this.optionsChampTexte = { texteApres: ' $\\%$' } } else { this.question += `${sp(1)} $\\ldots${sp(1)}\\%$` }
        this.correction = `$${texNombre(a)}=\\dfrac{${texNombre(a * 100)}}{100}=${texNombre(a * 100)} ${sp()}\\%$`
        this.reponse = a * 100
        this.canEnonce = 'Compléter.'
        this.canReponseACompleter = `$${texNombre(a)}=.... ${sp()}\\%$`
        break
      case 'b':
        a = calculANePlusJamaisUtiliser(randint(0, 9) / 100)
        b = calculANePlusJamaisUtiliser(randint(0, 9) / 1000)
        if (a === 0 && b === 0) { b = 1 }
        this.question = `Compléter : $${texNombre(a + b)}=$`
        if (this.interactif) { this.optionsChampTexte = { texteApres: ' $\\%$' } } else { this.question += `${sp(1)} $\\ldots${sp(1)}\\%$` }
        this.correction = `$${texNombre(a + b)}=\\dfrac{${texNombre((a + b) * 100)}}{100}=${texNombre((a + b) * 100)} ${sp()}\\%$`
        this.reponse = (a + b) * 100
        this.canEnonce = 'Compléter.'
        this.canReponseACompleter = `$${texNombre(a + b)}=.... ${sp()}\\%$`
        break
      case 'c':
        fraction = choice(listeFractions1)
        n = fraction[0]
        d = fraction[1]

        this.question = `Compléter : $${deprecatedTexFraction(texNombre(n), d)}=$`
        if (this.interactif) { this.optionsChampTexte = { texteApres: ' $\\%$' } } else { this.question += `${sp(1)} $\\ldots${sp(1)}\\%$` }
        this.correction = `$${deprecatedTexFraction(n, d)}=\\dfrac{${texNombre(n)}\\times ${texNombre(100 / d)}}{${texNombre(d)}\\times ${texNombre(100 / d)}}=
        \\dfrac{${texNombre((n * 100) / d)}}{100}=${texNombre((n * 100) / d)} ${sp()}\\%$`
        this.reponse = (n * 100) / d
        this.canEnonce = 'Compléter.'
        this.canReponseACompleter = `$${deprecatedTexFraction(texNombre(n), d)}=.... ${sp()}\\%$`
        break
    }
  }
}
