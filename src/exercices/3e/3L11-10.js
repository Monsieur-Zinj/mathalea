import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { egal, randint, printlatex, listeQuestionsToContenuSansNumero } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { tableauColonneLigne } from '../../lib/2d/tableau.js'
import { AddTabDbleEntryMathlive } from '../../lib/interactif/tableaux/AjouteTableauMathlive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { calculCompare, canonicalAddCompare, developmentCompare } from '../../lib/interactif/comparisonFunctions'
import { toutPourUnPoint } from '../../lib/interactif/mathLive.js'
export const titre = 'Table de double distributivité'
export const dateDePublication = '23/02/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
/**
* Développer des expressions de double distributivité à l'aide d'un tableau de multiplication
* @author Sébastien LOZANO
*/

export const uuid = 'c8403'
export const ref = '3L11-10'
export const refs = {
  'fr-fr': ['3L11-10'],
  'fr-ch': ['11FA2-6']
}
export default function TableDoubleDistributivite () {
  Exercice.call(this)
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 3 : 2
  this.nbQuestions = 5
  this.sup = 1
  this.tailleDiaporama = 3
  this.listeAvecNumerotation = false
  this.exoCustomResultat = true

  this.nouvelleVersion = function () {
    this.answers = {}
    this.consigne = this.nbQuestions > 1 ? 'Dans chaque cas, compléter les tables de multiplication, écrire le développement obtenu et le réduire.' : 'Compléter la table de multiplication, écrire le développement obtenu et le réduire.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    let typesDeQuestionsDisponibles = [1, 2]
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [3, 4]
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2, 3, 4]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    this.autoCorrection = []
    for (let i = 0, texte, texteCorr, termesRectangles, developpements, cpt = 0, a, b, c, d, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = randint(2, 9)
      b = randint(2, 9)
      c = randint(2, 9, [a])
      d = randint(2, 9, [b])
      let L1C1, L1C2, L2C1, L2C2
      this.autoCorrection[3 * i] = {}
      this.autoCorrection[3 * i + 1] = {}
      this.autoCorrection[3 * i + 2] = {}

      switch (typesDeQuestions) {
        case 1: // (x+b)(x+d)
          b = randint(2, 10)
          d = randint(2, 12)
          texte = `$${lettreDepuisChiffre(i + 1)} = (x+${b})(x+${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (x+${b})(x+${d})$`
          termesRectangles = [1, d, b, b * d]
          developpements = {
            eclate: `x^2+${b}x+${d}x+${b * d}`,
            reduit: `x^2+${b + d}x+${b * d}`
          }
          L1C1 = 'x^2'
          L1C2 = `${b}x`
          L2C1 = `${d}x`
          L2C2 = `${b * d}`
          break
        case 2: // (ax+b)(cx+d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x+${b})(${c}x+${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x+${b})(${c}x+${d})$`
          termesRectangles = [a * c, a * d, b * c, b * d]
          developpements = {
            eclate: `${a * c}x^2+${a * d}x+${b * c}x+${b * d}`,
            reduit: `${a * c}x^2+${a * d + b * c}x+${b * d}`
          }
          L1C1 = `${a * c}x^2`
          L1C2 = `${b * c}x`
          L2C1 = `${a * d}x`
          L2C2 = `${b * d}`
          break
        case 3: // (ax-b)(cx+d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x+${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x+${d})$`
          if (egal(a * d - b * c, 0)) {
            developpements = {
              eclate: `${a * c}x^2+${d * a}x-${b * c}x-${b * d}`,
              reduit: `${printlatex(`${a * c}*x^2-${b * d}`)}`
            }
          } else {
            developpements = {
              eclate: `${a * c}x^2+${d * a}x-${b * c}x-${b * d}`,
              reduit: `${printlatex(`${a * c}*x^2+(${d * a - b * c})*x-${b * d}`)}`
            }
          }
          termesRectangles = [a * c, a * d, -b * c, -b * d]
          L1C1 = `${a * c}x^2`
          L1C2 = `${-b * c}x`
          L2C1 = `${a * d}x`
          L2C2 = `${-b * d}`
          break
        case 4: // (ax-b)(cx-d)
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x-${d})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${a}x-${b})(${c}x-${d})$`
          termesRectangles = [a * c, -a * d, -b * c, b * d]
          developpements = {
            eclate: `${a * c}x^2-${a * d}x-${b * c}x+${b * d}`,
            reduit: `${a * c}x^2-${a * d + b * c}x+${b * d}`
          }
          L1C1 = `${a * c}x^2`
          L1C2 = `${-b * c}x`
          L2C1 = `${-a * d}x`
          L2C2 = `${b * d}`
          break
      }
      texte += context.isHtml ? '<br>' : '\\par\\medskip'
      let entetesCol, entetesLgn, contenu
      if (typesDeQuestions === 1) {
        entetesCol = ['\\times', 'x', `${b}`]
        entetesLgn = ['x', `${d}`]
        contenu = [`\\phantom{${termesRectangles[0]}x}`, `\\phantom{${termesRectangles[1]}}`, `\\phantom{${termesRectangles[2]}x}`, `\\phantom{${termesRectangles[3]}}`]
      }
      if (typesDeQuestions === 2) {
        entetesCol = ['\\times', `${a}x`, `${b}`]
        entetesLgn = [`${c}x`, `${d}`]
        contenu = [`\\phantom{${termesRectangles[0]}x}`, `\\phantom{${termesRectangles[1]}}`, `\\phantom{${termesRectangles[2]}x}`, `\\phantom{${termesRectangles[3]}}`]
      }
      if (typesDeQuestions === 3) {
        entetesCol = ['\\times', `${a}x`, `${-b}`]
        entetesLgn = [`${c}x`, `${d}`]
        contenu = [`\\phantom{${termesRectangles[0]}x}`, `\\phantom{${termesRectangles[1]}}`, `\\phantom{${termesRectangles[2]}x}`, `\\phantom{${termesRectangles[3]}}`]
      }
      if (typesDeQuestions === 4) {
        entetesCol = ['\\times', `${a}x`, `${-b}`]
        entetesLgn = [`${c}x`, `${-d}`]
        contenu = [`\\phantom{${termesRectangles[0]}x}`, `\\phantom{${termesRectangles[1]}}`, `\\phantom{${termesRectangles[2]}x}`, `\\phantom{${termesRectangles[3]}}`]
      }
      if (this.interactif) {
        const tableauVide = AddTabDbleEntryMathlive.convertTclToTableauMathlive(entetesCol, entetesLgn, ['', '', '', ''])
        const tabMathlive = AddTabDbleEntryMathlive.create(this.numeroExercice, 3 * i, tableauVide, 'nospacebefore', this.interactif, { L0C0: 'red' })
        texte += tabMathlive.output
      } else {
        texte += tableauColonneLigne(entetesCol, entetesLgn, contenu, 1, true, this.numeroExercice, i, false, { L0C0: 'red' })
      }
      texte += context.isHtml ? '<br> Développement : ' : '\\par\\medskip Développement : '
      texte += ajouteChampTexteMathLive(this, 3 * i + 1, 'inline', { tailleExtensible: true })
      texte += context.isHtml ? '<br> Développement réduit : ' : '\\par\\medskip Développement réduit: '
      texte += ajouteChampTexteMathLive(this, 3 * i + 2, 'inline', { tailleExtensible: true })
      texteCorr += context.isHtml ? '<br>' : '\\par\\medskip'
      if (typesDeQuestions === 1) {
        texteCorr += tableauColonneLigne(['\\times', 'x', `${b}`], ['x', `${d}`], [`${termesRectangles[0] === 1 ? '' : termesRectangles[0]}x^2`, `${termesRectangles[2]}x`, `${termesRectangles[1]}x`, `${termesRectangles[3]}`], 1, true, this.numeroExercice, i, false, { L0C0: 'red' })
      }
      if (typesDeQuestions === 2) {
        texteCorr += tableauColonneLigne(['\\times', `${a}x`, `${b}`], [`${c}x`, `${d}`], [`${termesRectangles[0] === 1 ? '' : termesRectangles[0]}x^2`, `${termesRectangles[2]}x`, `${termesRectangles[1]}x`, `${termesRectangles[3]}`], 1, true, this.numeroExercice, i, false, { L0C0: 'red' })
      }
      if (typesDeQuestions === 3) {
        texteCorr += tableauColonneLigne(['\\times', `${a}x`, `${-b}`], [`${c}x`, `${d}`], [`${termesRectangles[0] === 1 ? '' : termesRectangles[0]}x^2`, `${termesRectangles[2]}x`, `${termesRectangles[1]}x`, `${termesRectangles[3]}`], 1, true, this.numeroExercice, i, false, { L0C0: 'red' })
      }
      if (typesDeQuestions === 4) {
        texteCorr += tableauColonneLigne(['\\times', `${a}x`, `${-b}`], [`${c}x`, `${-d}`], [`${termesRectangles[0] === 1 ? '' : termesRectangles[0]}x^2`, `${termesRectangles[2]}x`, `${termesRectangles[1]}x`, `${termesRectangles[3]}`], 1, true, this.numeroExercice, i, false, { L0C0: 'red' })
      }
      texteCorr += context.isHtml ? '<br>' : '\\par\\medskip '
      texteCorr += `Développement : $${lettreDepuisChiffre(i + 1)} = ${developpements.eclate}$`
      texteCorr += context.isHtml ? '<br>' : '\\par\\medskip '
      texteCorr += `Développement réduit : $${lettreDepuisChiffre(i + 1)} = ${developpements.reduit}$`
      // texteCorr += context.isHtml ? '<br>' : '\\par\\bigskip'
      handleAnswers(this, 3 * i, { bareme: toutPourUnPoint, L1C1: { value: L1C1, compare: calculCompare }, L1C2: { value: L1C2, compare: calculCompare }, L2C1: { value: L2C1, compare: calculCompare }, L2C2: { value: L2C2, compare: calculCompare } }, { formatInteractif: 'mathlive' })
      handleAnswers(this, 3 * i + 1, { reponse: { value: developpements.eclate, compare: developmentCompare } }, { formatInteractif: 'mathlive' })
      handleAnswers(this, 3 * i + 2, { reponse: { value: developpements.reduit, compare: canonicalAddCompare } }, { formatInteractif: 'mathlive' })

      if (this.questionJamaisPosee(i, a, b, c, d, typesDeQuestions[i])) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, ' 1 : (x+a)(x+b) et (ax+b)(cx+d)\n 2 : (ax-b)(cx+d) et (ax-b)(cx-d)\n 3 : Mélange']
}
