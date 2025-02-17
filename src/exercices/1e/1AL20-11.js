import { courbe } from '../../lib/2d/courbes.js'
import { point } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import {
  ecritureAlgebrique,
  ecritureAlgebriqueSauf1,
  ecritureParentheseSiNegatif,
  rienSi1
} from '../../lib/outils/ecritures'
import { modalTexteLong } from '../../lib/outils/modales.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'

export const titre = 'Calcul du discriminant d\'une équation du second degré'

/**
 * Calculer le discriminant d'une équation
 * @author Rémi Angot
 * Référence 1E10
*/
export const uuid = 'feb39'
export const ref = '1AL20-11'
export const refs = {
  'fr-fr': ['1AL20-11'],
  'fr-ch': ['11FA10-7']
}
export default function CalculDiscriminant () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Pour chaque équation, calculer le discriminant et déterminer le nombre de solutions de cette équation dans $\\mathbb{R}$.'
  this.nbQuestions = 6
  this.nbCols = 2
  this.nbColsCorr = 2
  if (context.isHtml) {
    this.spacingCorr = 2
  }
  this.nouvelleVersion = function (numeroExercice) {
    const listeTypesEquations = combinaisonListes(['0solution', '1solution', '2solutions'], this.nbQuestions)
    for (let i = 0, texte, texteCorr, a, b, c, x1, y1, k, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let aNbPointsIntersection
      switch (listeTypesEquations[i]) {
        case '0solution':
          aNbPointsIntersection = "n'a aucun point d'intersection"
          k = randint(1, 5)
          x1 = randint(-3, 3, [0])
          y1 = randint(1, 5)
          if (choice(['+', '-']) === '+') { // k(x-x1)^2 + y1 avec k>0 et y1>0
            a = k
            b = -2 * k * x1
            c = k * x1 * x1 + y1
          } else { // -k(x-x1)^2 -y1 avec k>0 et y1>0
            a = -k
            b = 2 * k * x1
            c = -k * x1 * x1 - y1
          }
          texte = `$${rienSi1(a)}x^2${ecritureAlgebriqueSauf1(b)}x${ecritureAlgebrique(c)}=0$`
          if (b === 0) {
            texte = `$${rienSi1(a)}x^2${ecritureAlgebrique(c)}=0$`
          }
          texteCorr = `$\\Delta = ${ecritureParentheseSiNegatif(b)}^2-4\\times${ecritureParentheseSiNegatif(a)}\\times${ecritureParentheseSiNegatif(c)}=${b * b - 4 * a * c}$`
          texteCorr += '<br>$\\Delta<0$ donc l\'équation n\'admet pas de solution.'
          texteCorr += '<br>$\\mathcal{S}=\\emptyset$'
          break
        case '1solution': // k(x-x1)^2
          aNbPointsIntersection = "n'a qu'un seul point d'intersection"
          k = randint(-5, 5, [0])
          x1 = randint(-5, 5, [0])
          a = k
          b = -2 * k * x1
          c = k * x1 * x1
          texte = `$${rienSi1(a)}x^2${ecritureAlgebriqueSauf1(b)}x${ecritureAlgebrique(c)}=0$`
          if (b === 0) {
            texte = `$${rienSi1(a)}x^2${ecritureAlgebrique(c)}=0$`
          }
          if (c === 0) {
            texte = `$${rienSi1(a)}x^2${ecritureAlgebriqueSauf1(b)}x=0$`
          }
          texteCorr = `$\\Delta = ${ecritureParentheseSiNegatif(b)}^2-4\\times${ecritureParentheseSiNegatif(a)}\\times${ecritureParentheseSiNegatif(c)}=${b * b - 4 * a * c}$`
          texteCorr += '<br>$\\Delta=0$ donc l\'équation admet une unique solution.'
          break
        case '2solutions': // k(x-x1)^2
          aNbPointsIntersection = "a deux points d'intersection"
          k = randint(1, 5)
          x1 = randint(-3, 3)
          y1 = randint(1, 5)
          if (choice(['+', '-']) === '+') { // k(x-x1)^2 + y1 avec k>0 et y1<0
            y1 *= -1
            a = k
            b = -2 * k * x1
            c = k * x1 * x1 + y1
          } else { // -k(x-x1)^2 -y1 avec k>0 et y1>0
            a = -k
            b = 2 * k * x1
            c = -k * x1 * x1 + y1
          }
          texte = `$${rienSi1(a)}x^2${ecritureAlgebriqueSauf1(b)}x${ecritureAlgebrique(c)}=0$`
          if (b === 0) {
            texte = `$${rienSi1(a)}x^2${ecritureAlgebrique(c)}=0$`
          }
          if (c === 0) {
            texte = `$${rienSi1(a)}x^2${ecritureAlgebriqueSauf1(b)}x=0$`
          }
          texteCorr = `$\\Delta = ${ecritureParentheseSiNegatif(b)}^2-4\\times${ecritureParentheseSiNegatif(a)}\\times${ecritureParentheseSiNegatif(c)}=${b * b - 4 * a * c}$`
          texteCorr += '<br>$\\Delta>0$ donc l\'équation admet deux solutions.'
          break
        default:
          break
      }
      if (context.isHtml) {
        const f = x => a * x ** 2 + b * x + c
        const s = segment(point(-10, 0), point(10, 0), 'red')
        s.epaisseur = 3
        const r = repere({ afficheLabels: false, xLabelListe: [], yLabelListe: [] })
        const graphique = courbe(f, { repere: r, color: 'blue' })
        let correctionComplementaire = `Notons $f : x \\mapsto ${rienSi1(a)}x^2${ecritureAlgebriqueSauf1(b)}x${ecritureAlgebrique(c)}$.`
        correctionComplementaire += `<br>On observe que la courbe représentative de $f$ ${aNbPointsIntersection} avec l'axe des abscisses.`
        correctionComplementaire += '<br>'
        correctionComplementaire += mathalea2d({ xmin: -10.1, ymin: -10.1, xmax: 10.1, ymax: 10.1, pixelsParCm: 15 },
          graphique, r, s)

        texteCorr += modalTexteLong(numeroExercice, 'Complément graphique', correctionComplementaire, 'Complément graphique', 'info circle')
      }
      if (this.questionJamaisPosee(i, a, b, c)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
