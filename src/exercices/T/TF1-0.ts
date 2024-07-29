import Exercice from '../Exercice.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { reduireAxPlusB, reduirePolynomeDegre3, rienSi1 } from '../../lib/outils/ecritures.js'
import FractionEtendue from '../../modules/FractionEtendue.js'

export const titre = 'Domaine de définition d\'une fonction logarithme'
export const dateDePublication = '22/7/2024'
export const uuid = '450e7'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['TF1-0'],
  'fr-ch': []
}

/**
 * Réduire une expression en fonction de ln/log de x
 * @autor  Jean-Claude Lhote
 * Référence TAN1-5
 */
export default class DomaineDefFnLog extends Exercice {
  version: string
  constructor () {
    super()
    this.version = 'ln'
    this.nbQuestions = 5
    this.spacingCorr = 3
    this.sup = '1'
    this.sup2 = true
    this.besoinFormulaireTexte = ['Type de fonction dans le logarithme (nombres séparés par des tirets)', '1 : Fonction affine\n2 : Fonction homographique\n3 : Polynome de degré 2\n4 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Type de logarithme', true]
    this.comment = 'Exercice de simplification d\'expressions avec des logarithmes'
  }

  nouvelleVersion () {
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, nbQuestions: this.nbQuestions, min: 1, max: 3, melange: 4, defaut: 4 })
    if (this.sup2) this.version = 'ln'
    else this.version = 'log'
    const logString = this.version !== 'ln' ? '\\log' : '\\ln'
    const pluriel = this.nbQuestions > 1 ? 's' : ''
    this.consigne = `Donner le domaine de définition de${this.nbQuestions > 1 ? 's ' : 'la '}fonction${pluriel} suivante${pluriel}.`

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = `$\\mathcal{f}_${i}(x)=`
      let correction: string = ''
      let a: number
      let b: number
      let c: number
      let d: number
      let fonction: string
      let frac1
      let answer: string
      // On définit le contenu de l'énoncé
      switch (listeTypeDeQuestion[i]) {
        case 1: // affine
          a = randint(-9, 9, 0)
          b = randint(-9, 9, [0, a, -a])
          c = a
          d = b
          fonction = reduireAxPlusB(a, b)
          correction = `$\\begin{aligned}${fonction}\\gt 0 &\\iff `
          correction += `${rienSi1(a)}x\\gt ${rienSi1(-b)}\\\\`
          if (a !== 1) {
            frac1 = new FractionEtendue(-b, a).simplifie()
            if (a > 0) {
              correction += `&\\iff x\\gt ${frac1.texFractionSimplifiee}`
              answer = `\\left]${frac1.texFractionSimplifiee};+\\infty\\right[`
            } else {
              correction += `&\\iff x\\lt ${frac1.texFractionSimplifiee}`
              answer = `\\left]-\\infty;${frac1.texFractionSimplifiee}\\right[`
            }
            correction += '\\end{aligned}$'
          } else {
            correction += '\\end{aligned}$'
            answer = `\\left]${-b};+\\infty\\right[`
          }

          break
        case 2: // homographique
          a = randint(-3, 3, 0)
          b = randint(-9, 9, [0, a, -a])
          c = randint(-3, 3, [a, 0])
          d = randint(-9, 9, [0, c, -c])
          fonction = `\\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}`
          break
        default: // polynôme degré 2
        {
          a = randint(-3, 3, 0)
          b = randint(-9, 9, [0, a, -a])
          c = randint(-3, 3, [a, 0])
          d = randint(-9, 9, [0, c, -c])
          const coeffX2 = a * c
          const coeffX0 = b * d
          const coeffX = a * d + b * c
          a = coeffX2
          b = coeffX
          c = coeffX0
          fonction = reduirePolynomeDegre3(0, a, b, c)
        }
      }
      texte += `${logString}\\left(${fonction}\\right)$`
      let texteCorr = `La fonction $${logString}$ est défine sur $\\R_+^*$, donc $x$ doit vérifier $${fonction}>0$<br>`
      texteCorr += correction
      if (this.questionJamaisPosee(i, a, b, c, d)) {
        if (this.interactif) {
          texte += ajouteChampTexteMathLive(this, i, 'inline largeur10' + KeyboardType.clavierEnsemble) + ajouteFeedback(this, i)
          handleAnswers(this, i, { reponse: { value: answer, compare: fonctionComparaison, options: { intervalle: true } } })
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
