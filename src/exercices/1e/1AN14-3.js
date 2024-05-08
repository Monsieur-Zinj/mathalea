import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { Polynome } from '../../lib/mathFonctions/Polynome.js'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1 } from '../../lib/outils/ecritures'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.ts'
import engine, { functionCompare } from '../../lib/interactif/comparisonFunctions'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { obtenirListeFractionsIrreductibles } from '../../modules/fractions'

export const titre = 'Dérivée d\'un polynome'
export const dateDePublication = '06/05/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Calculer la dérivée d'un polynome
 * @author Jean-Claude Lhote
 * Référence 1AN14-3
 */

export const uuid = 'ec088'
export const ref = '1AN14-3'
export const refs = {
  'fr-fr': ['1AN14-3'],
  'fr-ch': []
}
const termNames = ['u', 'v', 'w', 'z']

export default function DeriveeProduit () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Pour chacune des fonctions suivantes, déterminer l\'expression de sa fonction dérivée.'
  this.nbQuestions = 3
  // Sortie LaTeX
  this.nbCols = 1 // Nombre de colonnes
  this.nbColsCorr = 1 // Nombre de colonnes dans la correction
  this.sup = '1'
  this.sup2 = false
  this.sup3 = false
  // On modifie les règles de simplifications par défaut de math.js pour éviter 10x+10 = 10(x+1) et -4x=(-4x)
  // const reglesDeSimplifications = math.simplify.rules.slice()
  // reglesDeSimplifications.splice(reglesDeSimplifications.findIndex(rule => rule.l === 'n1*n2 + n2'), 1)
  // reglesDeSimplifications.splice(reglesDeSimplifications.findIndex(rule => rule.l === 'n1*n3 + n2*n3'), 1)
  // reglesDeSimplifications.push({ l: '-(n1*v)', r: '-n1*v' })
  // reglesDeSimplifications.push('-(n1/n2) -> -n1/n2')

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.liste_valeurs = [] // Les questions sont différentes du fait du nom de la fonction, donc on stocke les valeurs

    // Types d'énoncés
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      nbQuestions: this.nbQuestions,
      listeOfCase: [
        'const',
        'poly1',
        'poly2',
        'poly3',
        'monbis'
      ],
      min: 1,
      max: 5,
      melange: 6,
      defaut: 1
    })
    for (let i = 0, texte, texteCorr, nameF, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // On commence par générer des fonctions qui pourrait servir
      const listeFracs = obtenirListeFractionsIrreductibles()
      let coeffs
      let useFraction
      if (this.sup2) {
        if (this.sup3) useFraction = choice([true, false])
        else useFraction = true
      } else useFraction = false
      let useDecimal
      if (this.sup3) {
        if (useFraction) {
          useDecimal = choice([true, false])
          useFraction = !useDecimal
        } else useDecimal = true
      } else useDecimal = false
      if (useFraction) {
        coeffs = combinaisonListes(listeFracs, 4).slice(0, 4)
      } else {
        coeffs = [[10, true], [10, true], [10, true], [10, true]]
      }
      let deg = randint(1, 2)
      const dictFonctions = {
        poly1: new Polynome({ rand: true, coeffs: coeffs.slice(0, 2), useFraction, useDecimal }),
        poly2: new Polynome({ rand: true, coeffs: coeffs.slice(0, 3), useFraction, useDecimal }),
        poly3: new Polynome({ rand: true, coeffs, useFraction, useDecimal }),
        const: new Polynome({ rand: true, coeffs: coeffs.slice(0, 1), useFraction, useDecimal }),
        monbis: new Polynome(
          choice([
            { rand: true, coeffs: [coeffs[0], 0, coeffs[2], 0], useFraction, useDecimal },
            { rand: true, coeffs: [0, coeffs[1], 0, coeffs[3]], useFraction, useDecimal },
            { rand: true, coeffs: [0, 0, coeffs[2], coeffs[3]], useFraction, useDecimal },
            { rand: true, coeffs: [0, coeffs[1], coeffs[2], 0], useFraction, useDecimal }
          ])),
        poly: new Polynome({ rand: true, coeffs: coeffs.slice(0, deg + 1), useFraction, useDecimal })
      }
      const poly = dictFonctions[listeTypeDeQuestions[i]]
      let expression = poly.toMathExpr()
      if (expression.startsWith('+')) expression = expression.substring(1)
      // Enoncé
      nameF = ['f', 'g', 'h', 'l', 'm', 'p', 'r', 's', 't', 'u', 'v', 'w', 'b', 'c', 'd', 'e'][i % 16]
      texte = 'Dans cette question, on demande de réduire si possible l\'expression de la dérivée.<br>'
      texte += `$${nameF}(x)=${engine.parse(expression).latex.replaceAll('.', '{,}')}$`
      // Correction
      texteCorr = `$${nameF}$ est dérivable sur $\\R$.<br>`
      texteCorr += 'On rappelle le cours : si $u,v$ sont  deux fonctions dérivables sur un même intervalle $I$ alors leur somme est dérivable sur $I$ et on a la formule : '
      texteCorr += '\\[(u + v)^\\prime=u^\\prime+v^\\prime.\\]'
      let termes = []
      let termesD = []
      deg = poly.deg
      for (let p = 1; p < poly.monomes.length; p++) {
        if (poly.monomes[deg + 1 - p] !== 0) {
          termes.push(`${ecritureAlgebriqueSauf1(poly.monomes[deg + 1 - p])}${deg + 1 - p > 1 ? 'x^' + String(deg + 1 - p) : deg + 1 - p === 1 ? 'x' : ''}`)
          termesD.push(`${ecritureAlgebriqueSauf1(poly.derivee().monomes[deg - p])}${deg - p > 1 ? 'x^' + String(deg - p) : deg - p === 1 ? 'x' : ''}`)
        }
      }
      if (poly.monomes[0] !== 0) {
        termes.push(ecritureAlgebrique(poly.monomes[0]))
        termesD.push('0')
      }
      /*
      switch (listeTypeDeQuestions[i]) {
        case 'const':
          termes = [poly.toLatex()]
          termes = ['0']
          break

        case 'poly1':
          termes = [`${ecritureAlgebriqueSauf1(poly.monomes[1])}x`, ecritureAlgebrique(poly.monomes[0])]
          termesD = [poly.derivee().toLatex(), '0']
          break

        case 'poly2':
          termes = [`${ecritureAlgebriqueSauf1(poly.monomes[2])}x^2`, `${ecritureAlgebriqueSauf1(poly.monomes[1])}x`, ecritureAlgebrique(poly.monomes[0])]
          termesD = [`${ecritureAlgebriqueSauf1(poly.monomes[2])}x^2`, `${ecritureAlgebriqueSauf1(poly.monomes[1])}x`, ecritureAlgebrique(poly.monomes[0])]

          break

        case 'poly3':

          break
        case 'monbis':

          break
        default:
          texteCorr += 'Correction non encore implémentée.'
          break
      }
  */
      termes = termes.map(el => el.startsWith('+') ? el.substring(1) : el)
      termesD = termesD.map(el => el.startsWith('+') ? el.substring(1) : el)
      if (termes.length > 1) {
        texteCorr = `La fonction $${nameF}(x)=${engine.parse(expression).latex.replaceAll('.', '{,}')}$ est une somme de $${termes.length}$ termes.<br>`
        for (let n = 0; n < termes.length; n++) {
          texteCorr += `$${termNames[n]}(x)=${termes[n]},\\ ${termNames[n]}^\\prime(x)=${termesD[n]}$.<br>`
        }
      } else {
        texteCorr = `La fonction $${nameF}(x)=${engine.parse(expression).latex.replaceAll('.', '{,}')}$ est une fonction constante, sa dérivée est la fonction constante nulle.<br>`
      }
      texteCorr += `On obtient alors : $${nameF}^\\prime(x)=${poly.derivee().toLatex().replaceAll('.', '{,}')}$.`
      texte = texte.replaceAll('\\frac', '\\dfrac')
      texteCorr = texteCorr.replaceAll('\\frac', '\\dfrac')
      if (this.interactif) {
        texte += '<br><br>' + ajouteChampTexteMathLive(this, i, 'inline largeur75', { texteAvant: `$${nameF}'(x)=$` })
        handleAnswers(this, i, { reponse: { value: poly.derivee().toLatex(), compare: functionCompare } })
      }

      if (this.liste_valeurs.indexOf(expression) === -1) {
        this.liste_valeurs.push(expression)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['types de fonctions (nombre séparés par des tirets)', '1 constante\n2 : affine\n3 : degré 2\n4 : degré 3\n5 : deux monomes\n6 : mélange']
  this.besoinFormulaire2CaseACocher = ['coefficients rationnels', false]
  this.besoinFormulaire3CaseACocher = ['coefficients décimaux', false]
}
