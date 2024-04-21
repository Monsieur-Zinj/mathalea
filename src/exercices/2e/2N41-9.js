import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { reduirePolynomeDegre3 } from '../../lib/outils/ecritures'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import Exercice from '../deprecatedExercice'
import { context } from '../../modules/context'
import { gestionnaireFormulaireTexte, listeQuestionsToContenuSansNumero, printlatex, randint } from '../../modules/outils'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { aleaExpression } from '../../modules/outilsMathjs'
import engine, { expandedAndReductedCompare } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Développer puis réduire des expressions littérales.'
export const dateDePublication = '20/04/2024'
// export const dateDeModifImportante =

export const interactifReady = true
export const interactifType = 'mathLive'

/* export const amcType = 'AMCHybride'
export const amcReady = true
*/

/**
 * Développer puis réduire une expression littérale.
 *
 * @author Matthieu DEVILLERS refactorisé par Jean-Claude Lhote
 */
export const uuid = '889ef'
/* export const refs = [
  {'fr-fr': ['2N41-9']},
  {'fr-ch': []}
]
 */
export default function DevelopperReduireExprComplexe () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 3 : 2
  this.nbQuestions = 1
  this.sup = '3'
  this.tailleDiaporama = 3
  this.listeAvecNumerotation = false
  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = true
  this.nouvelleVersion = function () {
    this.consigne =
            this.nbQuestions > 1
              ? 'Développer puis réduire les expressions littérales suivantes.'
              : 'Développer puis réduire l\'expression littérale suivante.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const lettresPossibles = ['x', 'y', 'z', 't']

    let listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 10,
      defaut: 1,
      melange: 11,
      nbQuestions: this.nbQuestions
    })

    listeTypeDeQuestions = combinaisonListes(
      listeTypeDeQuestions,
      this.nbQuestions
    )
    for (
      let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      // Initialisation des variables didactiques en fonction du type de question voulu
      let ope = '+' // valeur par défaut
      let factsProd1Diff = true // par défaut
      let factsProd2Diff = true // par défaut
      let prod1Remarquable = false // par défaut
      switch (listeTypeDeQuestions[i]) {
        case 2: // '(ax+b)(cx+d)-(ex+f)(gx+h)'
          ope = '-'
          // eslint-disable-next-line no-fallthrough
        case 1: // '(ax+b)(cx+d)+(ex+f)(gx+h)'
          break
        case 4: // '(ax+b)^2-(cx+d)^2'
          ope = '-'
          // eslint-disable-next-line no-fallthrough
        case 3: // '(ax+b)^2+(cx+d)^2'
          factsProd1Diff = false
          factsProd2Diff = false
          break
        case 6: // '(ax+b)^2-(cx+d)(ex+f)'
          ope = '-'
          // eslint-disable-next-line no-fallthrough
        case 5: // '(ax+b)^2+(cx+d)(ex+f)'
          factsProd1Diff = false
          break
        case 8: // '(cx+d)(ex+f)-(ax+b)^2'
          ope = '-'
          // eslint-disable-next-line no-fallthrough
        case 7: // '(cx+d)(ex+f)+(ax+b)^2'
          factsProd2Diff = false
          break
        case 10: // '(ax-b)(ax+b)-(cx+d)^2'
          ope = '-'
          // eslint-disable-next-line no-fallthrough
        case 9: // '(ax-b)(ax+b)+(cx+d)^2'
          prod1Remarquable = true
          factsProd2Diff = false
          break
      }
      // initialisation des coefficients
      let c, d, g, h
      const a = randint(this.sup2 ? 1 : -5, 5, 0)
      const b = randint(this.sup2 ? 1 : -5, 5, 0)
      if (prod1Remarquable) {
        c = a
        d = -b
      } else if (!factsProd1Diff) {
        c = a
        d = b
      } else {
        c = randint(this.sup2 ? 1 : -5, 5, [0, a])
        d = randint(this.sup2 ? 1 : -5, 5, [0, b])
      }
      const e = randint(this.sup2 ? 1 : -5, 5, 0)
      const f = randint(this.sup2 ? 1 : -5, 5, 0)
      if (!factsProd2Diff) {
        g = e
        h = f
      } else {
        g = randint(this.sup2 ? 1 : -5, this.sup2 ? 9 : 5, [0, e])
        h = randint(this.sup2 ? 1 : -5, this.sup2 ? 9 : 5, [0, f])
      }

      const choixLettre = choice(lettresPossibles)
      const expression1 = factsProd1Diff
        ? printlatex(aleaExpression(`(a*${choixLettre}+(b))*(c*${choixLettre}+(d))`, { a, b, c, d })).replaceAll(' ', '')
        : printlatex(aleaExpression(`(a*${choixLettre}+(b))^2`, { a, b })).replaceAll(' ', '')
      const expression2 = factsProd2Diff
        ? printlatex(aleaExpression(`(e*${choixLettre}+(f))*(g*${choixLettre}+(h))`, { e, f, g, h })).replaceAll(' ', '')
        : printlatex(aleaExpression(`(e*${choixLettre}+(f))^2`, { e, f })).replaceAll(' ', '')
      console.log(expression1, expression2)
      const devExpr1 = engine.box(['ExpandAll', engine.parse(expression1)]).evaluate().latex
      const devExpr2 = engine.box(['ExpandAll', engine.parse(expression2)]).evaluate().latex
      const expression = `${expression1}${ope}${expression2}`
      let texte = `$${lettreDepuisChiffre(i + 1)}=${expression}$`
      const coeffX2 = ope === '-' ? a * c - e * g : a * c + e * g
      const coeffX = ope === '-' ? a * d + b * c - e * h - f * g : a * d + b * c + e * h + f * g
      const coeffConst = ope === '-' ? b * d - f * h : b * d + f * h
      const reponse = `${reduirePolynomeDegre3(
          0,
          coeffX2,
          coeffX,
          coeffConst,
          choixLettre
      )}`
      let texteCorr = `$\\begin{aligned}${lettreDepuisChiffre(i + 1)} &=${expression}\\\\`
      texteCorr += `&=(${devExpr1})${ope}(${devExpr2})\\\\`
      // ici on va rédiger la correction détaillée

      texteCorr += `&=${miseEnEvidence(reponse)}\\end{aligned}$`
      if (!context.isAmc && this.interactif) {
        handleAnswers(this, i, { reponse: { value: { expr: reponse, strict: true }, compare: expandedAndReductedCompare } }, { formatInteractif: 'mathlive' })
        texte += this.interactif
          ? `<br>$${lettreDepuisChiffre(i + 1)} = $` +
                    ajouteChampTexteMathLive(this, i, 'largeur75 inline nospacebefore')
          : ''
      } else {
        this.autoCorrection[i] = {
          enonce: '',
          enonceAvant: false,
          options: {
            multicols: true,
            barreseparation: true
          },
          propositions: [{
            type: 'AMCOpen',
            propositions: [{
              texte: texteCorr,
              enonce: texte + '<br>',
              statut: 4
            }]
          },
          {
            type: 'AMCNum',
            propositions: [{
              texte: '',
              statut: '',
              reponse: {
                texte: `valeur de $m$ dans $m${choixLettre}^2+n${choixLettre}+p$`,
                valeur: coeffX2,
                param: {
                  digits: 2,
                  decimals: 0,
                  signe: true,
                  approx: 0
                }
              }
            }]
          },
          {
            type: 'AMCNum',
            propositions: [{
              texte: '',
              statut: '',
              reponse: {
                texte: `valeur de $n$ dans $m${choixLettre}^2+n${choixLettre}+p$`,
                valeur: coeffX,
                param: {
                  digits: 2,
                  decimals: 0,
                  signe: true,
                  approx: 0
                }
              }
            }]
          },
          {
            type: 'AMCNum',
            propositions: [{
              texte: '',
              statut: '',
              reponse: {
                texte: `valeur de $p$ dans $m${choixLettre}^2+n${choixLettre}+p$`,
                valeur: coeffConst,
                param: {
                  digits: 2,
                  decimals: 0,
                  signe: true,
                  approx: 0
                }
              }
            }]
          }
          ]
        }
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireTexte = [
    'Types de questions',
        `Nombres séparés par des tirets
1 : '(ax+b)(cx+d)+(ex+f)(gx+h)'
2 : '(ax+b)(cx+d)-(ex+f)(gx+h)'
3 : '(ax+b)^2 + (cx+d)^2'
4 : '(ax+b)^2 - (cx+d)^2'
5 : '(ax+b)^2 + (cx+d)(ex+f)'
6 : '(ax+b)^2 - (cx+d)(ex+f)'
7 : '(cx+d)(ex+f) + (ax+b)^2'
8 : '(cx+d)(ex+f) - (ax+b)^2'
9 : '(ax+b)(ax-b) + (cx+d)^2'
10 : '(ax-b)(ax+b) - (cx+d)^2'
11 : 'Mélange'
`]

  this.besoinFormulaire2CaseACocher = ['Coefficients strictement positifs', true]
}
