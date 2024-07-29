import Exercice from '../Exercice.js'
import { choice } from '../../lib/outils/arrayOutils.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.js'

export const titre = 'Calculs utilisant les propriétés des logarithmes'
export const dateDePublication = '27/07/2024'
export const uuid = '3e6bf'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['TAN1-3'],
  'fr-ch': []
}
/**
 * Description didactique de l'exercice
 * @author Jean-Claude Lhote
 * Référence
*/
export default class ExerciceCalculsProprietesLog extends Exercice {
  version: string
  constructor () {
    super()
    this.version = 'ln'
    this.nbQuestions = 5
    this.spacingCorr = 3
    this.sup = '3'
    this.sup2 = false
    this.correctionDetaillee = false
    this.correctionDetailleeDisponible = true
    this.besoinFormulaire2CaseACocher = ['Type de logarithme', false]
    this.besoinFormulaireTexte = ['Type de question (nombres séparés par des tirets)', '1 : Avec log(a^n*b^m)\n2 : Avec log(a^n/b^m)\n3 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Type de logarithme', false]
  }

  nouvelleVersion () {
    this.version = this.sup2 ? 'ln' : 'log'
    const logString = this.version === 'ln' ? '\\ln' : '\\log'

    // La liste des types de questions fabriquée à partir du paramètre this.sup
    const listeTypeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 2, melange: 3, defaut: 3, nbQuestions: this.nbQuestions })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // on déclare les objets A et B qui servent à définir a et b
      const A = { base: choice([2, 3, 5]), exp: randint(2, 9) }
      const B = { base: choice([2, 3, 5], [A.base]), exp: randint(2, 9, [A.exp]) }
      const exprime = (A: {base: number, exp: number}) => `${A.base}^${A.exp}`
      const intro = `Exprimer en fonction de $${logString} ${A.base}$ et $${logString} ${B.base}$ le nombre suivant :<br>`
      let texte: string
      let texteCorr: string
      const signe = listeTypeQuestions[i] === 1 ? '+' : '-'
      switch (listeTypeQuestions[i]) {
        case 1: // log(A*B)
          texte = `${logString}\\left(${exprime(A)}\\times ${exprime(B)}\\right)`
          texteCorr = this.correctionDetaillee ? `Nous savons d'après le cours que $${logString}\\left(a\\times b\\right)=${logString} a+${logString} b$, donc :<br>` : ''
          break
        default: // log(A/B)
          texte = `${logString}\\left(\\dfrac{${exprime(A)}}{${exprime(B)}}\\right)`
          texteCorr = this.correctionDetaillee ? `Nous savons d'après le cours que $${logString}\\left(\\dfrac{a}{b}\\right)=${logString} a-${logString} b$, donc :<br>` : ''
          break
      }
      if (this.correctionDetaillee) { // On verra si on ajoute quelque chose...
        texteCorr += `$\\begin{aligned}${texte}&=${logString}\\left(${exprime(A)}\\right)${signe}${logString}\\left(${exprime(B)}\\right)\\\\`
        texteCorr += `&=${miseEnEvidence(`${A.exp}${logString} ${A.base}${signe}${B.exp}${logString} ${B.base}`)}`
      } else {
        texteCorr += `$\\begin{aligned}${texte}&=${logString}\\left(${exprime(A)}\\right)${signe}${logString}\\left(${exprime(B)}\\right)\\\\`
        texteCorr += `&=${miseEnEvidence(`${A.exp}${logString} ${A.base}${signe}${B.exp}${logString} ${B.base}`)}`
      }
      texte = `${intro}$${texte}$`
      texteCorr += '\n\\end{aligned}$'
      const answer = `${A.exp}${logString}(${A.base})${signe}${B.exp}${logString}(${B.base})`
      if (this.interactif) {
        handleAnswers(this, i, { reponse: { value: answer, compare: fonctionComparaison } })
        texte += `<br>$${lettreDepuisChiffre(i + 1)} = $`
        texte += ajouteChampTexteMathLive(this, i, KeyboardType.logPuissance)
      }
      if (this.questionJamaisPosee(i, A.base, A.exp, B.base, B.exp, signe)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
