import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Déterminer le plus petit ensemble de nombres'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '07/02/2022'
export const dateDeModifImportante = '26/08/2023'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export const uuid = 'e31d1'
export const ref = 'can2N02'
export const refs = {
  'fr-fr': ['can2N02'],
  'fr-ch': []
}
export default function PlusPetitEnsemble () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.formatInteractif = 'texte'
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let a, b, c, d, listeFractions1, listeFractions2, fraction1, fraction2, choix, choix2, N
    switch (choice(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])) { //
      case 'a':
        a = randint(0, 150)
        this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${a}$ ?`
        this.correction = `$${a}$ est un entier naturel. On a donc $${a}\\in \\mathbb{N}$.`
        this.reponse = '\\mathbb{N}'
        break
      case 'b':
        a = randint(0, 150) * (-1)
        this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${a}$ ?`
        this.correction = `$${a}$ est un entier relatif. On a donc $${a}\\in \\mathbb{Z}$.`
        this.reponse = '\\mathbb{Z}'
        break
      case 'c':
        d = randint(0, 9, 0)
        b = randint(0, 9) * choice([-1, 1])
        c = randint(0, 9)
        this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${texNombre(b + c / 10 + d / 100)}$ ?`
        this.correction = `$${texNombre(b + c / 10 + d / 100)}$ est un nombre décimal. On a donc $${texNombre(b + c / 10 + d / 100)}\\in \\mathbb{D}$.
            `
        this.reponse = '\\mathbb{D}'
        break
      case 'd':
        choix = choice([true, false])
        a = randint(1, 12)
        this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${choix ? '-' : ''}\\sqrt{${texNombre(a * a)}}$ ?`
        this.correction = `$${choix ? '-' : ''}\\sqrt{${a * a}}=${choix ? '-' : ''}${a}$  est un entier ${choix ? 'relatif' : 'naturel'}. On a donc $${choix ? '-' : ''}\\sqrt{${texNombre(a * a)}}\\in ${choix ? '\\mathbb{Z}' : '\\mathbb{N}'}$.
            `
        this.reponse = choix ? '\\mathbb{Z}' : '\\mathbb{N}'
        break
      case 'e':
        a = randint(2, 10)
        b = randint(2, 6)
        choix = choice([true, false])
        this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${choix ? '-' : ''}\\dfrac{${texNombre(b * a)}}{${a}}$ ?`
        this.correction = `$${choix ? '-' : ''}\\dfrac{${texNombre(b * a)}}{${a}}=${choix ? '-' : ''}\\dfrac{${b}\\times ${a}}{${a}}=${choix ? '-' : ''}${b}$  est un entier ${choix ? 'relatif' : 'naturel'}. On a donc $${choix ? '-' : ''}\\dfrac{${texNombre(b * a)}}{${a}}\\in ${choix ? '\\mathbb{Z}' : '\\mathbb{N}'}$.
            `

        this.reponse = choix ? '\\mathbb{Z}' : '\\mathbb{N}'
        break

      case 'f':
        choix = choice([true, false])
        choix2 = choice([true, false])
        listeFractions1 = [[1, 3], [2, 3], [5, 3], [7, 3], [10, 3], [11, 3], [1, 7], [2, 7],
          [3, 7], [4, 7], [6, 7], [5, 7]]
        listeFractions2 = [[1, 2], [1, 4], [3, 4], [1, 5],
          [2, 5], [3, 5], [4, 5], [6, 5], [7, 5], [8, 5], [9, 5], [5, 4], [7, 4], [1, 10], [3, 10], [7, 10], [9, 10], [17, 100], [23, 100]]
        fraction1 = choice(listeFractions1)
        fraction2 = choice(listeFractions2)
        a = fraction1[0]
        b = fraction1[1]
        c = fraction2[0]
        d = fraction2[1]
        this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${choix ? '-' : ''}${choix2 ? `\\dfrac{${a}}{${b}}` : `\\dfrac{${c}}{${d}}`}$ ?`
        this.correction = `$${choix ? '-' : ''}${choix2 ? `\\dfrac{${a}}{${b}}` : `\\dfrac{${c}}{${d}}=${choix ? '-' : ''}${texNombre(c / d)}`}$ ${choix2 ? 'n’' : ''} est ${choix2 ? 'pas' : ''} un nombre décimal.
          On a donc $${choix ? '-' : ''}${choix2 ? `\\dfrac{${a}}{${b}}` : `\\dfrac{${c}}{${d}}`}\\in$ ${choix2 ? '$\\mathbb{Q}$.' : '$\\mathbb{D}$.'}
              `
        this.reponse = choix2 ? '\\mathbb{Q}' : '\\mathbb{D}'

        break
      case 'g':
        choix = choice([true, false])
        listeFractions1 = [[1, 2], [1, 4], [3, 4], [1, 5],
          [2, 5], [3, 5], [4, 5], [6, 5], [7, 5], [8, 5], [9, 5], [5, 4], [7, 4]]
        fraction1 = choice(listeFractions1)
        a = fraction1[0]
        b = fraction1[1]
        this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${choix ? '-' : ''}\\sqrt{\\dfrac{${a * a}}{${b * b}}}$ ?`
        this.correction = `$${choix ? '-' : ''}\\sqrt{\\dfrac{${a * a}}{${b * b}}}=${choix ? '-' : ''}\\dfrac{${a}}{${b}}=${choix ? '-' : ''}${texNombre(a / b)}$ est  un nombre décimal. On a donc $${choix ? '-' : ''}\\sqrt{\\dfrac{${a * a}}{${b * b}}}\\in \\mathbb{D}$.
              `
        this.reponse = '\\mathbb{D}'

        break

      case 'h':
        choix = choice([true, false])
        if (choix === true) {
          a = randint(2, 100, [4, 9, 16, 25, 36, 49, 64, 81])
          this.question = `Quel est le plus petit ensemble de nombres auquel appartient $\\sqrt{${a}}$ ?`
          this.correction = `$\\sqrt{${a}}$  est un nombre irrationnel. On a donc $\\sqrt{${a}}\\in \\mathbb{R}$.
            `
          this.reponse = '\\mathbb{R}'
        } else {
          a = randint(1, 12, 10)
          this.question = `Quel est le plus petit ensemble de nombres auquel appartient $\\sqrt{${texNombre(a * a / 100)}}$ ?`
          this.correction = `$\\sqrt{${texNombre(a * a / 100)}}=${texNombre(a / 10)}$  est un nombre décimal. On a donc $\\sqrt{${texNombre(a * a / 100)}}\\in \\mathbb{D}$.`
          this.reponse = '\\mathbb{D}'
        }
        break
      case 'i':// un peu de tout
        choix = choice([true, false])
        N = choice([1, 2, 3])
        if (N === 1) {
          a = randint(2, 9)
          this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${a}${choix ? '+' : ''}\\pi$ ?`
          this.correction = `$${a}${choix ? '+' : ''}\\pi$   est un nombre irrationnel. On a donc $${a}${choix ? '+' : ''}\\pi \\in \\mathbb{R}$. `
          this.reponse = '\\mathbb{R}'
        }
        if (N === 2) {
          a = choice([2, 4, 5])
          b = randint(2, 5)
          this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${choix ? `${a}^{-1}` : `${a}^{${b}}`}$ ?`
          this.correction = `$${choix ? `${a}^{-1}` : `${a}^{${b}}`}=${choix ? `\\dfrac{1}{${a}}` : `${a ** b}`}${choix ? `=${texNombre(1 / a)}` : ''}$   est un nombre ${choix ? 'décimal' : 'entier naturel'}.
          On a donc $${choix ? `${a}^{-1} \\in \\mathbb{D}.` : `${a}^{${b}}\\in \\mathbb{N}.`}$ `
          this.reponse = choix ? ['d', 'D'] : ['n', 'N']
        }
        if (N === 3) {
          a = randint(1, 4)
          b = randint(1, 9)
          this.question = `Quel est le plus petit ensemble de nombres auquel appartient $${b}\\times 10^{${choix ? '-' : ''}${a}}$ ?`
          this.correction = `$${b}\\times 10^{${choix ? '-' : ''}${a}}=${choix ? `${texNombre(b * 10 ** (-a))}` : `${texNombre(b * 10 ** a)}`}$   est un nombre ${choix ? 'décimal' : 'entier naturel'}. On a donc $${b}\\times 10^{${choix ? '-' : ''}${a}} \\in ${choix ? '\\mathbb{D}' : '\\mathbb{N}'}$. `
          this.reponse = choix ? '\\mathbb{D}' : '\\mathbb{N}'
        }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
    this.formatChampTexte = 'inline largeur15 ensemble'
  }
}
