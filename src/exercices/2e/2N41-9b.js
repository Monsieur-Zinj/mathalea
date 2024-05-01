import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { reduirePolynomeDegre3 } from '../../lib/outils/ecritures'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import Exercice from '../deprecatedExercice'
import { context } from '../../modules/context'
import { gestionnaireFormulaireTexte, listeQuestionsToContenuSansNumero, printlatex, randint } from '../../modules/outils'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import engine, { expandedAndReductedCompare } from '../../lib/interactif/comparisonFunctions'
import { developpe, regroupeTermesMemeDegre, suppressionParentheses } from '../../lib/mathFonctions/outilsMaths'
import { obtenirListeFractionsIrreductiblesFaciles } from '../../modules/fractions'

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
export const uuid = '1f3da'
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
  this.sup2 = false
  this.sup3 = 3
  this.sup4 = true
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

    const lettresPossibles = ['a', 'b', 'c', 'x', 'y', 'z', 't']

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
      const isColored = this.sup4
      const level = this.sup3 - 1
      const rationnels = true
      const isPositif = this.sup2
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
      const fractions = combinaisonListes(obtenirListeFractionsIrreductiblesFaciles(), 8)
      const a = fractions[0].multiplieEntier(isPositif ? 1 : choice([1, -1]))

      const b = randint(isPositif ? 1 : -5, 5, 0)
      if (prod1Remarquable) {
        c = a.multiplieEntier(1)
        d = -b
      } else if (!factsProd1Diff) {
        c = a.multiplieEntier(1)
        d = b
      } else {
        c = fractions[2].multiplieEntier(isPositif ? 1 : choice([1, -1]))
        d = randint(isPositif ? 1 : -5, 5, [0, b])
      }
      const e = fractions[4].multiplieEntier(isPositif ? 1 : choice([1, -1]))
      const f = randint(isPositif ? 1 : -5, 5, 0)
      if (!factsProd2Diff) {
        g = e.multiplieEntier(1)
        h = f
      } else {
        g = fractions[6].multiplieEntier(isPositif ? 1 : choice([1, -1]))
        h = randint(isPositif ? 1 : -5, isPositif ? 9 : 5, [0, f])
      }
      const aS = `${a.num}/${a.den}`
      const bS = String(b)
      const cS = `${c.num}/${c.den}`
      const dS = String(d)
      const eS = `${e.num}/${e.den}`
      const fS = String(f)
      const gS = `${g.num}/${g.den}`
      const hS = String(h)
      const choixLettre = choice(lettresPossibles)
      const expression1 = factsProd1Diff
        ? printlatex(`(${aS}*${choixLettre}+(${bS}))*(${cS}*${choixLettre}+(${dS}))`).replaceAll(' ', '').replaceAll('\\frac', '\\dfrac')
        : printlatex(`(${aS}*${choixLettre}+(${bS}))^2`).replaceAll(' ', '').replaceAll('\\frac', '\\dfrac')
      const expression2 = factsProd2Diff
        ? printlatex(`(${eS}*${choixLettre}+(${fS}))*(${gS}*${choixLettre}+(${hS}))`).replaceAll(' ', '').replaceAll('\\frac', '\\dfrac')
        : printlatex(`(${eS}*${choixLettre}+(${fS}))^2`).replaceAll(' ', '').replaceAll('\\frac', '\\dfrac')
      const expressionDeveloppee1 = developpe(expression1, { isColored, colorOffset: 0, level })
      const expressionDeveloppee2 = developpe(expression2, { isColored, colorOffset: 4, level })
      const devExpr1 = engine.parse(developpe(expression1, { isColored: false, colorOffset: 0, level: 0 }).replaceAll('\\dfrac', '\\frac')).latex
      // const devExpr1 = engine.box(['ExpandAll', engine.parse(expression1.replaceAll('\\dfrac', '\\frac'))]).evaluate().latex
      const devExpr2 = engine.parse(developpe(expression2, { isColored: false, colorOffset: 0, level: 0 }).replaceAll('\\dfrac', '\\frac')).latex
      const sansParentheses = suppressionParentheses(`(${devExpr1})${ope}(${devExpr2})`, { isColored })
      const sansParenthesesNetB = suppressionParentheses(`(${devExpr1})${ope}(${devExpr2})`, { isColored: false })
      const expression = `${expression1}${ope}${expression2}`
      const expressionOrdonnee = regroupeTermesMemeDegre(sansParenthesesNetB, { isColored })
      const coeffX2 = ope === '-'
        ? a.produitFraction(c).differenceFraction(e.produitFraction(g)).simplifie().texFSD
        : a.produitFraction(c).sommeFraction(e.produitFraction(g)).simplifie().texFSD
      const coeffX = ope === '-'
        ? a.produitFraction(d).sommeFraction(c.multiplieEntier(b)).differenceFraction(e.produitFraction(h)).differenceFraction(g.multiplieEntier(f)).simplifie().texFSD
        : a.produitFraction(d).sommeFraction(c.multiplieEntier(b)).sommeFraction(e.produitFraction(h)).sommeFraction(g.multiplieEntier(f)).simplifie().texFSD
      const coeffConst = String(ope === '-' ? b * d - f * h : b * d + f * h)
      const reponse = rationnels
        ? `${coeffX2}${choixLettre}^2${coeffX.startsWith('-') ? coeffX : ('+' + coeffX)}${choixLettre}${coeffConst.startsWith('-') ? coeffConst : ('+' + coeffConst)}`
        : `${reduirePolynomeDegre3(0, coeffX2, coeffX, Number(coeffConst), choixLettre)}`
      let texte = `$${lettreDepuisChiffre(i + 1)}=${expression}$`
      let texteCorr = `$\\begin{aligned}${lettreDepuisChiffre(i + 1)} &=${expression}\\\\`
      // ici on va rédiger la correction détaillée
      if (this.correctionDetaillee) {
        // La correction dans le texte pour tester
        texteCorr += `&=\\left(${expressionDeveloppee1}\\right)${ope}\\left(${expressionDeveloppee2}\\right)\\\\`
        // texteCorr += `&=${miseEnEvidence(`(${devExpr1})${ope}(${devExpr2})`, 'black')}\\\\`
        texteCorr += `&=${sansParentheses}\\\\`
        texteCorr += `&=${expressionOrdonnee}\\\\`
      } else {
        texteCorr += `&=(${devExpr1})${ope}(${devExpr2})\\\\`
      }

      texteCorr += `&=${miseEnEvidence(reponse)}\\end{aligned}$`

      // La correction pour de vrai
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
  this.besoinFormulaire3Numerique = ['Niveau de détail dans la correction détaillée', 3]
  this.besoinFormulaire4CaseACocher = ['Couleur dans la correction', true]
}
