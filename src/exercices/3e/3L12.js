import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenuSansNumero, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { reduireAxPlusB } from '../../lib/outils/ecritures'
import { factorisationCompare } from '../../lib/interactif/comparisonFunctions'
import { fraction } from '../../modules/fractions.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

export const titre = 'Factoriser a²-b²'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDeModifImportante = '26/02/2023'

// FIX ME
// On a saisi les produits dans les 2 ordres en attendant d'avoir un outil de calcul formel

/**
 * Factoriser a²-b²
 * @author Jean-Claude Lhote,
 * Ajout Mélange des questions Matthieu Devillers
 * 3L12
 */
export const uuid = '81fd2'
export const ref = '3L12'
export const refs = {
  'fr-fr': ['3L12'],
  'fr-ch': ['11FA3-4']
}
export default function FactoriserIdentitesRemarquables3 () {
  Exercice.call(this)
  this.titre = titre
  this.correctionDetailleeDisponible = false
  context.isHtml ? (this.spacingCorr = 3) : (this.spacingCorr = 2)
  if (!context.isHtml) {
    this.correctionDetaillee = false
  }
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 4
  this.sup = 4
  this.sup2 = true
  this.tailleDiaporama = 3
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions > 1 ? 'Factoriser les expressions suivantes.' : 'Factoriser l\'expression suivante.'
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const Fractions = [
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [1, 8],
      [3, 8],
      [5, 8],
      [7, 8],
      [1, 9],
      [2, 9],
      [3, 10],
      [7, 10],
      [9, 10],
      [4, 9],
      [5, 9],
      [7, 9],
      [8, 9],
      [1, 10]
    ]
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1] // coef de x = 1
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2] // coef de x > 1
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [3] // coef de x négatif
    } else {
      typesDeQuestionsDisponibles = [1, 2, 3]
    } // mélange des questions
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0, a, b, ns, ds, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = randint(1, 9)
      b = randint(2, 9)
      const uneFraction = choice(Fractions)
      ns = uneFraction[0]
      ds = uneFraction[1]
      texteCorr = ''
      switch (typesDeQuestions) {
        case 1:
          texte = `$${lettreDepuisChiffre(i + 1)} = x^2-${a * a}$` // (x-a)(x+a)
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = x^2-${a * a}=x^2-${a}^2=(x-${a})(x+${a})$`
          handleAnswers(this, i, { reponse: { value: `(${reduireAxPlusB(1, -a)})(${reduireAxPlusB(1, a)})`, compare: factorisationCompare } }, { formatInteractif: 'calcul' })
          break
        case 2:
          texte = `$${lettreDepuisChiffre(i + 1)} = ${b * b}x^2-${a * a}$` // b>1
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${b * b}x^2-${a * a}=(${b}x)^2-${a}^2=(${b}x-${a})(${b}x+${a})$`
          handleAnswers(this, i, { reponse: { value: `(${reduireAxPlusB(b, -a)})(${reduireAxPlusB(b, a)})`, compare: factorisationCompare } }, { formatInteractif: 'calcul' })
          break
        case 3:{
          const dfrac = fraction(ns, ds).texFraction
          const dfrac2 = fraction(ns * ns, ds * ds).texFraction
          texte = `$${lettreDepuisChiffre(i + 1)} = ${dfrac2}x^2-${a * a}$` // b>1
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${dfrac2}x^2-${a * a}=\\left(${dfrac}x\\right)^2-${a}^2=\\left(${dfrac}x-${a}\\right)\\left(${dfrac}x+${a}\\right)$`
          handleAnswers(this, i, { reponse: { value: `(${dfrac}x+${a})(${dfrac}x-${a})`, compare: factorisationCompare } }, { formatInteractif: 'calcul' })
        }
          break
      }
      if (this.sup2) {
        this.spacingCorr = 1
        // On enlève la première égalité pour ne pas avoir A = A en première ligne
        texteCorr = texteCorr.slice(4)
        // On découpe
        const etapes = texteCorr.split('=')
        texteCorr = ''
        etapes.forEach(function (etape) {
          etape = etape.replace('$', '')
          texteCorr += etape === lettreDepuisChiffre(i + 1) ? '' : `$${lettreDepuisChiffre(i + 1)} = ${etape}$ <br>`
        })
      }
      if (this.interactif) texte += ' $=$ ' + ajouteChampTexteMathLive(this, i, 'inline15 college6e ml-2')
      if (this.questionJamaisPosee(i, a, typesDeQuestions)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, ' 1 : Coefficient de x égal à 1\n 2 : Coefficient de x supérieur à 1\n 3 : Coefficient de x rationnel\n 4 : Mélange des cas précédents']
  this.besoinFormulaire2CaseACocher = ['Présentation des corrections en colonnes', false]
}
