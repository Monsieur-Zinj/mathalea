import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { ecritureParentheseSiNegatif, reduireAxPlusB } from '../../../lib/outils/ecritures'
import { sp } from '../../../lib/outils/outilString.js'
import Exercice from '../../deprecatedExercice.js'
import { fraction } from '../../../modules/fractions.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Résoudre une inéquation'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '21/05/2023'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can2L05 // pour l'instant
 * Date de publication 24/10/2021 modifié le 21/05/23 interactif n'est plus un qcm
*/
export const uuid = '96a78'
export const ref = 'can2L05'
export const refs = {
  'fr-fr': ['can2L05'],
  'fr-ch': []
}
export default function SolutionInequation () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.spacing = 3
  this.formatChampTexte = 'largeur15 inline lycee'
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    let a, b, maFraction, n
    switch (choice([1, 2, 3, 4, 5, 6, 7, 8])) { //
      case 1 :// cas a>0
        a = randint(2, 6)
        n = randint(2, 7) * choice([-1, 1])
        b = n * a
        maFraction = fraction(-b, a)
        this.question = `Quel est l'ensemble des solutions $S$ de l'inéquation $${reduireAxPlusB(a, b)}>0$ ?`
        if (this.interactif) {
          this.question += '<br>$S=$'
        }
        this.correction = `L'ensemble de solutions est : ${texteEnCouleur(` $\\bigg]${maFraction.texFractionSimplifiee}${sp(1)} ;${sp(1)} +\\infty\\bigg[$`)}.<br>
            En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
            $${a}x>${-b}$<br>
            En divisant par $${a}$ dans chaque membre, on obtient :<br>
            $x>${maFraction.texFractionSimplifiee}$<br>
            Les solutions sont les nombres strictement supérieurs à $${maFraction.texFractionSimplifiee}$.   `
        this.reponse = [`$]${-n};+\\infty[$`]
        break
      case 2 :// cas a>0
        a = randint(2, 6)
        n = randint(2, 7) * choice([-1, 1])
        b = n * a
        maFraction = fraction(-b, a)
        this.question = `Quel est l'ensemble des solutions $S$ de l'inéquation $${reduireAxPlusB(a, b)}\\geqslant 0$ ?`
        if (this.interactif) {
          this.question += '<br>$S=$'
        }
        this.correction = `L'ensemble de solutions est : ${texteEnCouleur(` $\\bigg[${maFraction.texFractionSimplifiee}${sp(1)} ;${sp(1)} +\\infty\\bigg[$`)}.<br>
                    En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
                    $${a}x\\geqslant${-b}$<br>
                    En divisant par $${a}$ dans chaque membre, on obtient :<br>
                    $x\\geqslant${maFraction.texFractionSimplifiee}$<br>
                    Les solutions sont les nombres  supérieurs ou égaux  à $${maFraction.texFractionSimplifiee}$.   `
        this.reponse = [`$[${-n};+\\infty[$`]
        break
      case 3 :// cas a>0
        a = randint(2, 6)
        n = randint(2, 7) * choice([-1, 1])
        b = n * a
        maFraction = fraction(-b, a)
        this.question = `Quel est l'ensemble des solutions $S$ de l'inéquation $${reduireAxPlusB(a, b)}\\leqslant 0$ ?`
        if (this.interactif) {
          this.question += '<br>$S=$'
        }
        this.correction = `L'ensemble de solutions est : ${texteEnCouleur(` $\\bigg]-\\infty${sp(1)} ; ${sp(1)}${maFraction.texFractionSimplifiee} \\bigg]$`)}.<br>
                      En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
                      $${a}x\\leqslant${-b}$<br>
                      En divisant par $${a}$ dans chaque membre, on obtient :<br>
                      $x\\leqslant${maFraction.texFractionSimplifiee}$<br>
                      Les solutions sont les nombres  inférieurs ou égaux  à $${maFraction.texFractionSimplifiee}$.   `
        this.reponse = [`$]-\\infty;${-n}]$`]
        break
      case 4 :// cas a>0
        a = randint(2, 6)
        n = randint(2, 7) * choice([-1, 1])
        b = n * a
        maFraction = fraction(-b, a)
        this.question = `Quel est l'ensemble des solutions $S$ de l'inéquation $${reduireAxPlusB(a, b)}< 0$ ?`
        if (this.interactif) {
          this.question += '<br>$S=$'
        }
        this.correction = `L'ensemble de solutions est : ${texteEnCouleur(` $\\bigg]-\\infty${sp(1)} ; ${sp(1)}${maFraction.texFractionSimplifiee} \\bigg[$`)}.<br>
                      En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
                      $${a}x<${-b}$<br>
                      En divisant par $${a}$ dans chaque membre, on obtient :<br>
                      $x<${maFraction.texFractionSimplifiee}$<br>
                      Les solutions sont les nombres strictement inférieurs   à $${maFraction.texFractionSimplifiee}$.   `
        this.reponse = [`$]-\\infty;${-n}[$`]

        break

      case 5:// cas a<0
        a = randint(-6, -2)
        n = randint(2, 7) * choice([-1, 1])
        b = n * a
        maFraction = fraction(-b, a)

        this.question = `Quel est l'ensemble des solutions $S$ de l'inéquation $${reduireAxPlusB(a, b)}>0$ ?`
        if (this.interactif) {
          this.question += '<br>$S=$'
        }
        this.correction = `L'ensemble de solutions est : ${texteEnCouleur(` $\\bigg]-\\infty${sp(1)} ;${sp(1)}${maFraction.texFractionSimplifiee} \\bigg[$`)}.<br>
            En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
            $${a}x>${-b}$<br>
            En divisant par $(${a})$ dans chaque membre, on obtient :<br>
            $x$ ${texteEnCouleur(' $<$ ')}$${-n}$ ${sp(3)}
            ${texteEnCouleur('(quand on divise par un nombre strictement négatif, on change le sens de l’inégalité).')}<br>
            Les solutions sont les nombres strictement inférieurs   à $${maFraction.texFractionSimplifiee}$. `
        this.reponse = [`$]-\\infty;${-n}[$`]
        break
      case 6:// cas a<0
        a = randint(-6, -2)
        n = randint(2, 7) * choice([-1, 1])
        b = n * a
        maFraction = fraction(-b, a)
        this.question = `Quel est l'ensemble des solutions $S$ de l'inéquation $${reduireAxPlusB(a, b)}\\geqslant 0$ ?`
        if (this.interactif) {
          this.question += '<br>$S=$'
        }
        this.correction = `L'ensemble de solutions est : ${texteEnCouleur(` $\\bigg]-\\infty${sp(1)} ;${sp(1)} ${maFraction.texFractionSimplifiee} \\bigg]$`)}.<br>
          En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
          $${a}x\\geqslant${-b}$<br>
          En divisant par $(${a})$ dans chaque membre, on obtient :<br>
          $x$ ${texteEnCouleur(' $\\leqslant$ ')}$${maFraction.texFractionSimplifiee}$ ${sp(3)}
          ${texteEnCouleur('(quand on divise par un nombre strictement négatif, on change le sens de l’inégalité).')}<br>
          Les solutions sont les nombres  inférieurs ou égaux  à $${maFraction.texFractionSimplifiee}$. `
        this.reponse = [`$]-\\infty;${-n}]$`]
        break
      case 7:// cas a<0
        a = randint(-6, -2)
        n = randint(2, 7) * choice([-1, 1])
        b = n * a
        maFraction = fraction(-b, a)
        this.question = `Quel est l'ensemble des solutions $S$ de l'inéquation $${reduireAxPlusB(a, b)}\\leqslant 0$ ?`
        if (this.interactif) {
          this.question += '<br>$S=$'
        }
        this.correction = `L'ensemble de solutions est : ${texteEnCouleur(` $\\bigg[${maFraction.texFractionSimplifiee}${sp(1)} ;${sp(1)} +\\infty\\bigg[$`)}.<br>
          En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
          $${a}x\\leqslant${-b}$<br>
          En divisant par $(${a})$ dans chaque membre, on obtient :<br>
          $x$ ${texteEnCouleur(' $\\geqslant$ ')}$${maFraction.texFractionSimplifiee}$ ${sp(3)}
          ${texteEnCouleur('(quand on divise par un nombre strictement négatif, on change le sens de l’inégalité).')}<br>
          Les solutions sont les nombres  supérieurs ou égaux  à $${maFraction.texFractionSimplifiee}$. `
        this.reponse = [`$[${-n};+\\infty[$`]
        break
      case 8:// cas a<0
        a = randint(-6, -2)
        n = randint(2, 7) * choice([-1, 1])
        b = n * a
        maFraction = fraction(-b, a)
        this.question = `Quel est l'ensemble des solutions $S$ de l'inéquation $${reduireAxPlusB(a, b)}< 0$ ?`
        if (this.interactif) {
          this.question += '<br>$S=$'
        }
        this.correction = `L'ensemble de solutions est : ${texteEnCouleur(` $\\bigg]${maFraction.texFractionSimplifiee}${sp(1)} ;${sp(1)} +\\infty\\bigg[$`)}.<br>
                      En ajoutant $${ecritureParentheseSiNegatif(-b)}$ dans chaque membre, on obtient :<br>
                      $${a}x<${-b}$<br>
                      En divisant par $(${a})$ dans chaque membre, on obtient :<br>
          $x$ ${texteEnCouleur(' $>$ ')}$${maFraction.texFractionSimplifiee}$ ${sp(3)}
          ${texteEnCouleur('(quand on divise par un nombre strictement négatif, on change le sens de l’inégalité).')}<br>
          Les solutions sont les nombres strictement supérieurs   à $${maFraction.texFractionSimplifiee}$. `
        this.reponse = [`$]${-n};+\\infty[$`]
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
