import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'
import { pgcd } from '../../lib/outils/primalite.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'

export const titre = 'Résolution d\'équations du type $x^a = b$'
export const dateDePublication = '28/08/2024'
export const dateDeModificationImportante = '28/08/2024'
export const uuid = '364dd'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['TAN1-7'],
  'fr-ch': []
}

/**
 * Description didactique de l'exercice : Résolution d'équations du type x^a = b
 * @autor Claire Rousset
 * Référence TAN1-7
 */
export default class EquationsLog extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 5
    if (this.nbQuestions === 1) {
      this.consigne = 'Résoudre dans $\\R_+^*$ l\'équation suivante.'
    } else {
      this.consigne = 'Résoudre dans $\\R_+^*$ les équations suivantes.'
    }
    this.spacingCorr = 3
    this.besoinFormulaireTexte = ['Type de correction', '1 : Correction avec la racine \n2 : Correction avec le log  \n3 : Correction avec le ln']
    this.sup = '1'
  }

  estRationnel (a: number, b: number, tolerance: number = 1e-5): number | [number, number] | null {
    const racinenieme = b ** (1 / a)
    const maxDenominator = 100 // Précision
    let bestNumerator = 0
    let bestDenominator = 1
    let minError = Math.abs(racinenieme - bestNumerator / bestDenominator)
    for (let denominator = 1; denominator <= maxDenominator; denominator++) {
      const numerator = Math.round(racinenieme * denominator)
      const currentError = Math.abs(racinenieme - numerator / denominator)
      if (currentError < minError) {
        bestNumerator = numerator
        bestDenominator = denominator
        minError = currentError
      }
      if (currentError < tolerance) {
        break
      }
    }
    if (minError < tolerance) {
      // Simplifie la fraction
      const commonDivisor = pgcd(bestNumerator, bestDenominator)
      if (bestDenominator === 1) {
        return bestNumerator // Retourne le numérateur si le dénominateur est 1
      } else {
        return [bestNumerator / commonDivisor, bestDenominator / commonDivisor]
      }
    }
    return null // N'est pas une fraction selon la tolérance
  }

  nouvelleVersion () {
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let result1 : number|[number, number]|null
      let racinenieme = ''
      let strResult1 = ''
      let a : number
      let b : number
      let typeLog = ''
      let answer = ''
      let reponse = ''
      a = randint(2, 9)
      b = randint(1, 9, a)

      // Définition de l'écriture en racine
      if (a == 2) {
        racinenieme = `\\sqrt{${b}}`
      } else {
        racinenieme = `\\sqrt[${a}]{${b}}`
      }

      // Définition du résultat
      result1 = this.estRationnel(a, b)
      if (this.sup == '1') {
        if (result1 != null) {
          strResult1 = `${result1}`
        } else {
          strResult1 = `${racinenieme}`
        }
      } else {
        if (result1 == null) {
          strResult1 = `${b}^{\\frac{1}{${a}}}`
        } else {
          strResult1 = `${result1}`
        }
      }

      // Définition du type de logarithme
      if (this.sup == '2') {
        typeLog = '$log$'
      }
      if (this.sup == '3') {
        typeLog = '$ln$'
      }

      const justification1 = `pour tout réel $a$ strictement positif et pour tout entier $n$, &nbsp $${typeLog}\\left(a^n\\right)=n \\times ${typeLog}\\left(a\\right)$`
      texte = `$x^${a} = ${b}$`

      // Définition de answer
      if (a % 2 === 0) {
        reponse = `${miseEnEvidence('-')} ${miseEnEvidence(`${strResult1}`)} ; ${miseEnEvidence(`${strResult1}`)} `
        answer = `$- ${strResult1} ; ${strResult1}$`
      } else {
        reponse = `${miseEnEvidence(strResult1)}`
        answer = `$${strResult1}$`
      }

      if (this.sup == '1') {
        if (a % 2 === 0) {
          texteCorr = 'Pour tous réels $a$ et $b$ strictement positifs, on sait que, si $a$ est pair, alors l\'équation $x^a=b$ admet deux solutions : $\\sqrt[a]{b}$ et $-\\sqrt[a]{b}$ .'
          if (a === 2) {
            texteCorr += `<br> Ainsi, $x^${a} = ${b} \\iff x=- \\sqrt{${b}}$ ou $x=\\sqrt{${b}}$`
          } else {
            texteCorr += `<br> Ainsi, &nbsp $x^${a} = ${b} \\iff x=-${racinenieme}$ ou $x= ${racinenieme}$`
          }
          texteCorr += result1 == null ? '' : `<br> Or, &nbsp $-${racinenieme} = - ${strResult1} $ et $ ${racinenieme}= ${strResult1} $`
          texteCorr += `<br> D'où, &nbsp $S=\\{${reponse}\\}$`
        } else {
          texteCorr = 'Pour tous réels $a$ et $b$ strictement positifs, on sait que, si $a$ est impair, alors l\'équation $x^a=b$ admet une unique solution qui est $\\sqrt[a]{b}$.'
          texteCorr += `<br> Ainsi, &nbsp $x^${a} = ${b} \\iff x=${racinenieme}$`
          texteCorr += result1 == null ? '' : `<br> Or, &nbsp $${racinenieme} = ${strResult1}. $`
          texteCorr += `<br> D'où, &nbsp $S=\\{${reponse}\\}$`
        }
      } else {
        texteCorr = `On sait que, pour tous réels $a$ et $b$ strictement positifs, $a=b$ si, et seulement si, $${typeLog}(a)=&nbsp ${typeLog}(b)$ et que ${justification1}, d'où :`
        texteCorr += `<br> $x^${a} = ${b} \\iff ${typeLog}(x^${a})=&nbsp ${typeLog}(${b})$`
        texteCorr += `<br> $\\phantom{x^${a} = ${b}} \\iff ${a} ${typeLog}(x) = &nbsp ${typeLog}(${b})$ `
        texteCorr += `<br> $\\phantom{x^${a} = ${b}} \\iff ${typeLog}(x) = \\dfrac{1}{${a}}${typeLog}(${b})$`
        texteCorr += `<br> $\\phantom{x^${a} = ${b}} \\iff ${typeLog}(x) = &nbsp ${typeLog}(${b}^{\\frac{1}{${a}}})$`
        texteCorr += `<br> $\\phantom{x^${a} = ${b}} \\iff x = ${b}^{\\frac{1}{${a}}}$`
        texteCorr += result1 == null ? '' : `<br> $\\phantom{x^${a} = ${b}} \\iff x = ${strResult1}$ &nbsp car &nbsp $${b}^{\\frac{1}{${a}}} = ${strResult1}$.`
        if (a % 2 == 0) {
          texteCorr += `<br>De plus, $${a}$ est pair, alors l'équation admet deux solutions : $- ${strResult1}$ et $${strResult1}$`
        } else {
          texteCorr += `<br>De plus, $${a}$ est impair, donc l'équation admet une unique solution : $${strResult1}$. `
        }
        texteCorr += `<br> D'où, &nbsp $S=\\{${reponse}\\}$`
      }

      if (this.interactif) {
        handleAnswers(this, i,
          {
            champ1: { value: answer }
          }
        )
        texte += '<br>'
        texte += remplisLesBlancs(this, i, 'S=\\{%{champ1}\\}', KeyboardType.clavierFonctionsTerminales)
      }
      if (this.questionJamaisPosee(i, a, b)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
