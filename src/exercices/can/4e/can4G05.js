import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { extraireRacineCarree } from '../../../lib/outils/calculs'
import { texRacineCarree } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Calculer la diagonale d’un carré'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '09/09/2021'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export const uuid = '66672'
export const ref = 'can4G05'
export const refs = {
  'fr-fr': ['can4G05'],
  'fr-ch': []
}
export default function DiagonaleCarre () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = 'largeur15 inline'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let a, c2, reductible, reduction, entiere
    switch (choice(['a', 'b'])) {
      case 'a':
        a = randint(1, 10)//
        c2 = 2 * a ** 2
        reduction = extraireRacineCarree(c2)
        reductible = reduction[0] !== 1
        this.question = `Calculer la valeur exacte de la longueur de la diagonale d'un carré de côté $${a}$.`

        this.correction = ` En utilisant le théorème de Pythagore dans un carré de côté $${a}$ et de diagonale $d$, on a :<br><br>
    $\\begin{aligned}
    d^2&=${a}^2+${a}^2\\\\
    d^2&=2\\times ${a}^2\\\\
    d&=\\sqrt{2\\times ${a}^2}
    ${reductible ? '\\\\d&=\\sqrt{{' + c2 + '}}' : '\\\\d&=' + miseEnEvidence('\\sqrt{' + c2 + '}')}
    ${reductible ? '\\\\d&=' + miseEnEvidence(texRacineCarree(c2)) : ''}
       \\end{aligned}$<br>`
        this.correction += texteEnCouleur(`Mentalement : <br>
   On calcule le double du carré du côté du carré,
   soit $2\\times ${a}^2=2\\times ${a ** 2}=${c2}$, puis on en prend la racine carrée.    `)
        this.reponse = [`\\sqrt{${c2}}`, texRacineCarree(c2)]
        break
      case 'b':
        a = randint(2, 48, [4, 9, 16, 25, 36])//
        c2 = 2 * a
        reduction = extraireRacineCarree(c2)
        reductible = reduction[0] !== 1
        entiere = reduction[1] === 1
        this.question = `Calculer la valeur exacte de la longueur de la diagonale d'un carré de côté $\\sqrt{${a}}$.`

        if (entiere) {
          this.correction = ` En utilisant le théorème de Pythagore dans un carré de côté $c=\\sqrt{${a}}$
       et de diagonale $d$, on a :<br>

       $\\begin{aligned}
       c^2+c^2&=d^2\\\\
       \\sqrt{${a}}^2+\\sqrt{${a}}^2&=d^2\\\\
       d^2&=${a}+${a}\\\\
       d^2&=${c2}\\\\
       d&=\\sqrt{${c2}}\\\\
       d&=${miseEnEvidence(texRacineCarree(c2))}
       \\end{aligned}$<br>`
          this.correction += texteEnCouleur(`Mentalement : <br>
       On calcule le double du carré du côté du carré, soit
       $2\\times (\\sqrt{${a}})^2=2\\times ${a}=${c2}$, puis on en prend la racine carrée, soit $${texRacineCarree(c2)}$.    `, 'blue')
        } else {
          this.correction = ` En utilisant le théorème de Pythagore dans un carré de côté $c=\\sqrt{${a}}$
       et de diagonale $d$, on a :<br><br>
       $\\begin{aligned}
       c^2+c^2&=d^2\\\\
       \\sqrt{${a}}^2+\\sqrt{${a}}^2&=d^2\\\\
       d^2&=${a}+${a}\\\\
       d^2&=${c2}
       ${reductible ? '\\\\d&=\\sqrt{{' + c2 + '}}' : '\\\\d&=' + miseEnEvidence('\\sqrt{' + c2 + '}')}
       ${reductible ? '\\\\d&=' + miseEnEvidence(texRacineCarree(c2)) : ''}
       \\end{aligned}$<br>`
          this.correction += texteEnCouleur(`Mentalement : <br>
       On calcule le double du carré du côté du carré,
       soit $2\\times (\\sqrt{${a}})^2=2\\times ${a}=${c2}$, puis on en prend la racine carrée.    `, 'blue')
        }

        this.reponse = [`\\sqrt{${c2}}`, `${Math.sqrt(c2)}`, texRacineCarree(c2)]
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
