import { courbe } from '../../../lib/2d/courbes.js'
import { repere } from '../../../lib/2d/reperes.js'
import { latexParCoordonnees, texteParPosition } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, rienSi1 } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
import { deuxColonnes } from '../../../lib/format/miseEnPage.js'

export const titre = 'Déterminer une équation de tangente à partir des courbes de $f$ et $f’$'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '22/06/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
// export const dateDeModifImportante = '14/02/2022' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 */
export const uuid = '6f32d'
export const ref = 'can1F16'
export const refs = {
  'fr-fr': ['can1F16'],
  'fr-ch': []
}
export default function LectureGraphiqueTangente () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    let f
    let r1
    let r2
    let alpha
    let beta
    let F
    let o
    let nbre
    let courbef
    let courbefp
    let colonne1, colonne2
    switch (choice([1, 2])) { //, 2
      case 1:// second degré (x-alpha)^2+beta
        if (choice([true, false])) {
          nbre = randint(0, 3)
          alpha = randint(0, 2)
          beta = randint(-2, 2)
          f = function (x) { // fonction dérivée
            return 2 * x - 2 * alpha
          }
          F = function (x) { // fonction
            return (x - alpha) ** 2 + beta
          }
          while (f(nbre) === 0) {
            nbre = randint(0, 3)
            alpha = randint(0, 2)
            beta = randint(-2, 2)
          }
        } else {
          nbre = randint(-2, 1)
          alpha = randint(-2, 0)
          beta = randint(-2, 2)
          f = function (x) { // fonction dérivée
            return 2 * x - 2 * alpha
          }
          F = function (x) { // fonction
            return (x - alpha) ** 2 + beta
          }
          while (f(nbre) === 0) {
            nbre = randint(-2, 1)
            alpha = randint(-2, 0)
            beta = randint(-2, 2)
          }
        }

        o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)

        r1 = repere({
          xMin: -4,
          xMax: 4,
          xUnite: 1.5,
          yMin: -3, // Math.min(-3,F(nbre)-1)
          yMax: 12,
          thickHauteur: 0.2,
          xLabelMin: -3,
          xLabelMax: 3,
          yLabelMax: 11,
          yLabelMin: -3,
          axeXStyle: '->',
          axeYStyle: '->',
          yLabelDistance: 2,
          yLabelEcart: 0.8,
          grilleSecondaire: true,
          grilleSecondaireYDistance: 1,
          grilleSecondaireXDistance: 1,
          grilleSecondaireYMin: -3,
          grilleSecondaireYMax: 12,
          grilleSecondaireXMin: -4,
          grilleSecondaireXMax: 4
        })
        r2 = repere({
          xMin: -4,
          xMax: 4,
          xUnite: 1.5,
          yMin: -5,
          yMax: 8,
          thickHauteur: 0.2,
          xLabelMin: -3,
          xLabelMax: 3,
          yLabelMax: 11,
          yLabelMin: -3,
          axeXStyle: '->',
          axeYStyle: '->',
          yLabelDistance: 2,
          yLabelEcart: 0.8,
          grilleSecondaire: true,
          grilleSecondaireYDistance: 1,
          grilleSecondaireXDistance: 1,
          grilleSecondaireYMin: -3,
          grilleSecondaireYMax: 12,
          grilleSecondaireXMin: -4,
          grilleSecondaireXMax: 4
        })

        f = x => 2 * x - 2 * alpha
        F = x => (x - alpha) ** 2 + beta
        courbef = latexParCoordonnees('\\Large \\cal C_f', 3, 10, 'blue', 1, 20, '', 8)
        courbefp = latexParCoordonnees('\\Large\\cal C_f\\prime', 3, 6, 'red', 1, 20, '', 8)
        colonne1 = mathalea2d({
          xmin: -6,
          xmax: 6,
          ymin: -3,
          ymax: 12,
          style: 'display: inline',
          pixelsParCm: 14,
          scale: 0.4
        },
        r1, o, courbef, courbe(F, { repere: r1, color: 'blue', epaisseur: 2 })
        )
        colonne2 = mathalea2d({
          xmin: -6,
          xmax: 6,
          ymin: -5,
          ymax: 8,
          style: 'display: inline',
          pixelsParCm: 14,
          scale: 0.4
        },
        r2, o, courbefp, courbe(f, { repere: r2, color: 'red', epaisseur: 2 })
        )
        this.question = `On donne les représentations graphiques d'une fonction et de sa dérivée.<br>
        Donner l'équation réduite de la tangente à la courbe de $f$ en $x=${nbre}$. <br> `
        this.question += deuxColonnes(colonne1, colonne2)

        this.correction = `L'équation réduite de la tangente au point d'abscisse $${nbre}$ est  : $y=f'(${nbre})(x-${ecritureParentheseSiNegatif(nbre)})+f(${nbre})$.<br>
        On lit graphiquement $f(${nbre})=${F(nbre)}$ et $f'(${nbre})=${f(nbre)}$.<br>
        L'équation réduite de la tangente est donc donnée par :
        $y=${f(nbre)}(x${ecritureAlgebrique(-nbre)})${ecritureAlgebrique(F(nbre))}$, soit `
        if (-nbre * f(nbre) + F(nbre) === 0) {
          this.correction += `$y=${rienSi1(f(nbre))}x$.`
        } else {
          this.correction += `$y=${rienSi1(f(nbre))}x${ecritureAlgebrique(-nbre * f(nbre) + F(nbre))}$.`
        }

        this.reponse = [`y=${f(nbre)}x+${-nbre * f(nbre) + F(nbre)}`]
        this.canEnonce = `On donne les représentations graphiques d'une fonction et de sa dérivée.<br>
        Donner l'équation réduite de la tangente à la courbe de $f$ en $x=${nbre}$. <br>

        `
        this.canEnonce += colonne1
        this.canReponseACompleter = colonne2
        break

      case 2:// second degré -(x-alpha)^2+beta

        if (choice([true, false])) {
          nbre = randint(0, 2)
          alpha = randint(0, 2)
          beta = randint(1, 4)
          f = function (x) { // fonction dérivée
            return 2 * x * (-1) + 2 * alpha
          }
          F = function (x) { // fonction
            return (-1) * (x - alpha) ** 2 + beta
          }
          while (f(nbre) === 0) { // pas de tangente horizontales à chercher
            nbre = randint(0, 2)
            alpha = randint(0, 2)
            beta = randint(1, 4)
          }
        } else {
          nbre = randint(-2, 0)
          alpha = randint(-2, 0)
          beta = randint(0, 3)
        }
        f = function (x) { // fonction dérivée
          return 2 * x * (-1) + 2 * alpha
        }
        F = function (x) { // fonction
          return (-1) * (x - alpha) ** 2 + beta
        }
        while (f(nbre) === 0) { // pas de tangente horizontales à chercher
          nbre = randint(-2, 0)
          alpha = randint(-2, 0)
          beta = randint(0, 3)
        }

        o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)

        r1 = repere({
          xMin: -4,
          xMax: 4,
          xUnite: 1.5,
          yMin: -8, // Math.min(-3,F(nbre)-1)
          yMax: 5,
          thickHauteur: 0.2,
          xLabelMin: -3,
          xLabelMax: 3,
          yLabelMax: 4,
          yLabelMin: -7,
          axeXStyle: '->',
          axeYStyle: '->',
          yLabelDistance: 2,
          yLabelEcart: 0.8,
          grilleSecondaire: true,
          grilleSecondaireYDistance: 1,
          grilleSecondaireXDistance: 1,
          grilleSecondaireYMin: -8,
          grilleSecondaireYMax: 6,
          grilleSecondaireXMin: -4,
          grilleSecondaireXMax: 4
        })
        r2 = repere({
          xMin: -4,
          xMax: 4,
          xUnite: 1.5,
          yMin: -8, // Math.min(-3,F(nbre)-1)
          yMax: 6,
          thickHauteur: 0.2,
          xLabelMin: -3,
          xLabelMax: 3,
          yLabelMax: 5,
          yLabelMin: -7,
          axeXStyle: '->',
          axeYStyle: '->',
          yLabelDistance: 2,
          yLabelEcart: 0.8,
          grilleSecondaire: true,
          grilleSecondaireYDistance: 1,
          grilleSecondaireXDistance: 1,
          grilleSecondaireYMin: -8,
          grilleSecondaireYMax: 6,
          grilleSecondaireXMin: -4,
          grilleSecondaireXMax: 4
        })
        courbef = latexParCoordonnees('\\Large \\cal C_f', 3, 4, 'blue', 1, 20, '', 8)
        courbefp = latexParCoordonnees('\\Large\\cal C_f\\prime', 3, 4, 'red', 1, 20, '', 8)

        f = x => -2 * x + 2 * alpha
        F = x => (-1) * (x - alpha) ** 2 + beta
        this.question = `On donne les représentations graphiques d'une fonction et de sa dérivée.<br>
      Donner l'équation réduite de la tangente à la courbe de $f$ en $x=${nbre}$. <br> `
        colonne1 = mathalea2d({
          xmin: -6,
          xmax: 6,
          ymin: -8,
          ymax: 5,
          style: 'display: inline',
          pixelsParCm: 16,
          scale: 0.4
        },
        r1, o, courbef, courbe(F, { repere: r1, color: 'blue', epaisseur: 2 })
        )
        colonne2 = mathalea2d({
          xmin: -6,
          xmax: 6,
          ymin: -8,
          ymax: 6,
          style: 'display: inline',
          pixelsParCm: 14,
          scale: 0.4
        },
        r2, o, courbefp, courbe(f, { repere: r2, color: 'red', epaisseur: 2 })
        )
        this.question += deuxColonnes(colonne1, colonne2)
        this.correction = `L'équation réduite de la tangente au point d'abscisse $${nbre}$ est  : $y=f'(${nbre})(x-${ecritureParentheseSiNegatif(nbre)})+f(${nbre})$.<br>
      On lit graphiquement $f(${nbre})=${F(nbre)}$ et $f'(${nbre})=${f(nbre)}$.<br>
      L'équation réduite de la tangente est donc donnée par :
      $y=${f(nbre)}(x${ecritureAlgebrique(-nbre)})${ecritureAlgebrique(F(nbre))}$, soit `
        if (-nbre * f(nbre) + F(nbre) === 0) {
          this.correction += `$y=${f(nbre)}x$.`
        } else {
          this.correction += `$y=${f(nbre)}x${ecritureAlgebrique(-nbre * f(nbre) + F(nbre))}$.`
        }
        this.reponse = [`y=${f(nbre)}x+${-nbre * f(nbre) + F(nbre)}`]
        this.canEnonce = `On donne les représentations graphiques d'une fonction et de sa dérivée.<br>
        Donner l'équation réduite de la tangente à la courbe de $f$ en $x=${nbre}$. <br>
        
        `
        this.canEnonce += colonne1

        this.canReponseACompleter = colonne2
        break
    }
  }
}
