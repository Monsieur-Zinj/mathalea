import { choice, shuffle } from '../../../lib/outils/arrayOutils'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Déterminer un taux global d’évolution'
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
export const uuid = '9d51d'
export const ref = 'can2C12'
export const refs = {
  'fr-fr': ['can2C12'],
  'fr-ch': []
}
export default function TauxGlobal () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.optionsChampTexte = { texteApres: ' $\\%$' }
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let a, b, coeffG
    let listeCalculs = []

    switch (choice(['a', 'b', 'c', 'd'])) {
      case 'a':// augmente puis diminue
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 10)
        b = calculANePlusJamaisUtiliser(randint(1, 9) * 10)
        coeffG = (1 + a / 100) * (1 - b / 100)
        listeCalculs = [`$\\bullet$ $${texNombre(1 - a / 100)}\\times ${texNombre(1 - b / 100)}=${texNombre((1 - a / 100) * (1 - b / 100))}$${sp(4)}`,
`$\\bullet$ $${texNombre(1 + a / 100)}\\times ${texNombre(1 - b / 100)}=${texNombre((1 + a / 100) * (1 - b / 100))}$${sp(4)}`,
`$\\bullet$ $${texNombre(1 + a / 100)}\\times ${texNombre(1 + b / 100)}=${texNombre((1 + a / 100) * (1 + b / 100))}$${sp(4)}`,
`$\\bullet$ $${texNombre(a / 100)}\\times ${texNombre(b / 100)}=${texNombre((a / 100) * (b / 100))}$${sp(4)}`]
        listeCalculs = shuffle(listeCalculs)
        this.question = `  ${listeCalculs[0]}  ${listeCalculs[1]} <br>
 ${listeCalculs[2]}${listeCalculs[3]}<br>

En utilisant l'un des résultats précédents, déterminer le taux global d'évolution d'un article qui augmente de
$${a}${sp(1)}\\%$  dans un premier temps, puis qui diminue de $${b}${sp(1)}\\%$ dans un second temps. `
        this.correction = `Augmenter de $${a}${sp(1)}\\%$ revient à multiplier par $${texNombre(1 + a / 100)}$ et diminuer de $${b}${sp(1)}\\%$ revient à multiplier par $${texNombre(1 - b / 100)}$.<br>
Globalement cela revient donc à multiplier par $${texNombre(1 + a / 100)}\\times ${texNombre(1 - b / 100)}=${texNombre(coeffG)}$.<br>
Multiplier par $${texNombre(coeffG)}$ revient à multiplier par `
        if (coeffG > 1) {
          this.correction += ` $1+${texNombre(coeffG - 1)}$, ce qui revient à augmenter de $${texNombre((coeffG - 1) * 100)}${sp(1)}\\%$. <br>
          Le taux d'évolution global est donc : $${miseEnEvidence('+')} ${miseEnEvidence(`${texNombre((coeffG - 1) * 100)}${sp(1)}`)} \\%$.
`
        } else {
          this.correction += ` $1-${texNombre(1 - coeffG)}$. <br>
        Le taux d'évolution global est donc : $${miseEnEvidence(`${texNombre((coeffG - 1) * 100)}${sp(1)}`)} \\%$
`
        }
        this.reponse = calculANePlusJamaisUtiliser((coeffG - 1) * 100)
        break

      case 'b':// augmente puis augmente
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 10)
        b = calculANePlusJamaisUtiliser(randint(1, 9) * 10)
        coeffG = (1 + a / 100) * (1 + b / 100)
        listeCalculs = [`$\\bullet$ $${texNombre(1 - a / 100)}\\times ${texNombre(1 + b / 100)}=${texNombre((1 - a / 100) * (1 + b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(1 + a / 100)}\\times ${texNombre(1 + b / 100)}=${texNombre((1 + a / 100) * (1 + b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(1 + a / 100)}\\times ${texNombre(1 - b / 100)}=${texNombre((1 + a / 100) * (1 - b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(a / 100)}\\times ${texNombre(b / 100)}=${texNombre((a / 100) * (b / 100))}$${sp(4)}`]
        listeCalculs = shuffle(listeCalculs)
        this.question = `  ${listeCalculs[0]}  ${listeCalculs[1]} <br>
   ${listeCalculs[2]}${listeCalculs[3]}<br>

  En utilisant l'un des résultats précédents, déterminer le taux global d'évolution d'un article qui augmente de
  $${a}${sp(1)}\\%$  dans un premier temps, puis qui augmente de $${b}${sp(1)}\\%$ dans un second temps. `
        this.correction = `Augmenter de $${a}${sp(1)}\\%$ revient à multiplier par $${texNombre(1 + a / 100)}$ et augmenter de $${b}${sp(1)}\\%$ revient à multiplier par $${texNombre(1 + b / 100)}$.<br>
  Globalement cela revient donc à multiplier par $${texNombre(1 + a / 100)}\\times ${texNombre(1 + b / 100)}=${texNombre(coeffG)}$.<br>
  Multiplier par $${texNombre(coeffG)}$ revient à multiplier par
           $1+${texNombre(coeffG - 1)}$. <br>
          Le taux d'évolution global est donc : $${miseEnEvidence('+')} ${miseEnEvidence(`${texNombre((coeffG - 1) * 100)}${sp(1)}`)} \\%$.
  `
        this.reponse = calculANePlusJamaisUtiliser((coeffG - 1) * 100)
        break
      case 'c':// diminue puis diminue
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 10)
        b = calculANePlusJamaisUtiliser(randint(1, 9) * 10)
        coeffG = (1 - a / 100) * (1 - b / 100)
        listeCalculs = [`$\\bullet$ $${texNombre(1 - a / 100)}\\times ${texNombre(1 - b / 100)}=${texNombre((1 - a / 100) * (1 - b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(1 + a / 100)}\\times ${texNombre(1 + b / 100)}=${texNombre((1 + a / 100) * (1 + b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(1 + a / 100)}\\times ${texNombre(1 - b / 100)}=${texNombre((1 + a / 100) * (1 - b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(a / 100)}\\times ${texNombre(b / 100)}=${texNombre((a / 100) * (b / 100))}$${sp(4)}`]
        listeCalculs = shuffle(listeCalculs)
        this.question = `  ${listeCalculs[0]}  ${listeCalculs[1]} <br>
   ${listeCalculs[2]}${listeCalculs[3]}<br>

  En utilisant l'un des résultats précédents, déterminer le taux global d'évolution d'un article qui diminue de
  $${a}${sp(1)}\\%$  dans un premier temps, puis qui diminue de $${b}${sp(1)}\\%$ dans un second temps. `
        this.correction = `Diminuer de $${a}${sp(1)}\\%$ revient à multiplier par $${texNombre(1 - a / 100)}$ et diminuer de $${b}${sp(1)}\\%$ revient à multiplier par $${texNombre(1 - b / 100)}$.<br>
  Globalement cela revient donc à multiplier par $${texNombre(1 - a / 100)}\\times ${texNombre(1 - b / 100)}=${texNombre(coeffG)}$.<br>
  Multiplier par $${texNombre(coeffG)}$ revient à multiplier par
           $1-${texNombre(1 - coeffG)}$. <br>
          Le taux d'évolution global est donc : $${miseEnEvidence(`${texNombre((coeffG - 1) * 100)}${sp(1)}`)} \\%$.
  `
        this.reponse = calculANePlusJamaisUtiliser((coeffG - 1) * 100)
        break
      case 'd':// diminue puis augmente
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 10)
        b = calculANePlusJamaisUtiliser(randint(1, 9) * 10)
        coeffG = (1 - a / 100) * (1 + b / 100)
        listeCalculs = [`$\\bullet$ $${texNombre(1 - a / 100)}\\times ${texNombre(1 + b / 100)}=${texNombre((1 - a / 100) * (1 + b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(1 + a / 100)}\\times ${texNombre(1 - b / 100)}=${texNombre((1 + a / 100) * (1 - b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(1 + a / 100)}\\times ${texNombre(1 + b / 100)}=${texNombre((1 + a / 100) * (1 + b / 100))}$${sp(4)}`,
  `$\\bullet$ $${texNombre(a / 100)}\\times ${texNombre(b / 100)}=${texNombre((a / 100) * (b / 100))}$${sp(4)}`]
        listeCalculs = shuffle(listeCalculs)
        this.question = `  ${listeCalculs[0]}  ${listeCalculs[1]} <br>
   ${listeCalculs[2]}${listeCalculs[3]}<br>
   
  En utilisant l'un des résultats précédents, déterminer le taux global d'évolution d'un article qui diminue de
  $${a}${sp(1)}\\%$  dans un premier temps, puis qui augmente de $${b}${sp(1)}\\%$ dans un second temps. `
        this.correction = `Diminuer de $${a}${sp(1)}\\%$ revient à multiplier par $${texNombre(1 - a / 100)}$ et augmenter de $${b}${sp(1)}\\%$ revient à multiplier par $${texNombre(1 + b / 100)}$.<br>
  Globalement cela revient donc à multiplier par $${texNombre(1 - a / 100)}\\times ${texNombre(1 + b / 100)}=${texNombre(coeffG)}$.<br>
  Multiplier par $${texNombre(coeffG)}$ revient à multiplier par `
        if (coeffG > 1) {
          this.correction += ` $1+${texNombre(coeffG - 1)}$, ce qui revient à augmenter de $${texNombre((coeffG - 1) * 100)}\\%$. <br>
            Le taux d'évolution global est donc : $${miseEnEvidence('+')} ${miseEnEvidence(`${texNombre((coeffG - 1) * 100)}${sp(1)}`)} \\%$
  `
        } else {
          this.correction += ` $1-${texNombre(1 - coeffG)}$. <br>
          Le taux d'évolution global est donc : $${miseEnEvidence(`${texNombre((coeffG - 1) * 100)}${sp(1)}`)} \\%$.
  `
        }
        this.reponse = calculANePlusJamaisUtiliser((coeffG - 1) * 100)
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
