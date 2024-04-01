import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../deprecatedExercice.js'
import { sp } from '../../../lib/outils/outilString.js'
import { randint } from '../../../modules/outils.js'
import { context } from '../../../modules/context.js'
export const titre = 'Utiliser le vocabulaire image/antécédent'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '02/10/2023'

/**
 * Utiliser le vocabulaire image/antécédent
 * @author Gilles Mora
 * Référence can3F11
*/
export const uuid = 'd85c2'
export const refs = {
  'fr-fr': ['can3F11'],
  'fr-ch': []
}
export default function VocabulaireImageAntecedent () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  const ListeNomF = ['f', 'g', 'h', 'u', 'v', 'w', 'c', 'd']

  this.nouvelleVersion = function () {
    switch (choice([1, 2, 3])) { //, 2, 3, 4, 5, 6
      case 1 :
        { const NomF = choice(ListeNomF)
          const choix = choice([true, false])
          const a = randint(-10, 10)
          const b = randint(-10, 10, a)

          this.question = ` Dans l'écriture $${NomF}(${a})=${b}$, quel nombre est ${choix ? 'l\'image' : 'un antécédent'} ?`
          this.correction = `Dans l'écriture $${NomF}(a)=b$, on peut dire que : <br>
          $\\bullet$ $b$ est l'image de $a$ par la fonction $${NomF}$ ;<br>
          $\\bullet$ $a$ est un antécédent de $b$ par la fonction $${NomF}$.<br>
          Ainsi,  ${choix ? `le  nombre image  est $${b}$` : ` un antécédent est $${a}$`}.`
          this.reponse = choix ? `${b}` : `${a}` }
        break
      case 2 :
        { const NomF = choice(ListeNomF)
          const choix = choice([true, false])
          const a = randint(-10, 10)
          const b = randint(-10, 10, a)
          this.question = 'Dans le tableau '
          this.question += context.isHtml ? '' : '{\\renewcommand{\\arraystretch}{1.5}'
          this.question += `$\\begin{array}{|c|c|}
          \\hline
          x&${sp(5)}${a}${sp(5)}${context.isHtml ? '\\\\' : '\\tabularnewline'}
          \\hline
         ${NomF}(x) &${sp(5)}${b}${sp(5)}${context.isHtml ? '\\\\' : '\\tabularnewline'}
          \\hline
          \\end{array}$  quel nombre est ${choix ? 'l\'image' : 'un antécédent'} ?`
          this.question += context.isHtml ? '' : '}\\medskip'

          this.correction = `Sur la première ligne du tableau on lit les valeurs de $x$ donc les antécédents. <br>
          Sur la deuxième ligne, on lit les valeurs de $${NomF}(x)$, donc les images.<br>
          Ainsi, ${choix ? `le  nombre image  est $${b}$` : `un antécédent est $${a}$`}.`
          this.reponse = choix ? `${b}` : `${a}` }
        break

      case 3 :
        { const NomF = choice(ListeNomF)
          const choix = choice([true, false])
          const a = randint(-10, 10)
          const b = randint(-10, 10, a)

          this.question = ` Dans l'écriture $${NomF}$ : $${a} \\longmapsto ${b}$, quel nombre est ${choix ? 'l\'image' : 'un antécédent'} ?`
          this.correction = `Dans l'écriture $${NomF}$ : $a \\longmapsto b$, on peut dire que : <br>
              $\\bullet$ $b$ est l'image de $a$ par la fonction $${NomF}$ ;<br>
              $\\bullet$ $a$ est un antécédent de $b$ par la fonction $${NomF}$.<br>
              Ainsi,  ${choix ? `le  nombre image  est $${b}$` : `un antécédent est $${a}$`}.`
          this.reponse = choix ? `${b}` : `${a}` }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
