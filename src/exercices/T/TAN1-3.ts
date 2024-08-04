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
 * @author Jean-Claude Lhote et modifié par Claire Rousset
 * Référence TAN1-3
*/
export default class ExerciceCalculsProprietesLog extends Exercice {
  version: string
  constructor () {
    super()
    this.version = 'ln'
    this.nbQuestions = 5
    this.spacingCorr = 3
    this.sup = '3'
    this.besoinFormulaireTexte = ['Type de question (nombres séparés par des tirets)', '1 : Avec log(a^n*b^m)\n2 : Avec log(a^n/b^m)\n3 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Type de logarithme', false]
    this.sup2 = false
    this.besoinFormulaire3CaseACocher = ['Données exprimées avec des puissances', true]
    this.sup3 = true
  }

  nouvelleVersion () {
    this.version = this.sup2 ? 'ln' : 'log'
    const logString = this.version === 'ln' ? '\\ln' : '\\log'

    // La liste des types de questions fabriquée à partir du paramètre this.sup
    const listeTypeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 2, melange: 3, defaut: 3, nbQuestions: this.nbQuestions })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // on déclare les objets A et B qui servent à définir a et b
      const A = { base: choice([2, 3, 5]), exp: randint(2, 5) }
      const B = { base: choice([2, 3, 5], [A.base]), exp: randint(2, 5, [A.exp]) }
      const valeurA = A.base ** A.exp
      const valeurB = B.base ** B.exp
      const valeurAfoisB = valeurA * valeurB
      const exprime = (A: {base: number, exp: number}) => `${A.base}^${A.exp}`
      const intro = `Exprimer, en fonction de $${logString} \\left(${A.base}\\right)$ et $${logString} \\left(${B.base}\\right)$, le nombre suivant : &nbsp `
      let texte: string
      let texteCorr = ``
      const justification1mult = `car, pour tous réels a et b strictement positifs, &nbsp $${logString}\\left(a \\times b\\right)=${logString}\\left(a\\right)+${logString}\\left(b\\right)$. `
      const justification1div = `car,  pour tous réels a et b strictement positifs, &nbsp $${logString}\\left( \\dfrac{a}{b}\\right)=${logString}\\left(a\\right)-${logString}\\left(b\\right)$. `
      const justification2 = `De plus, pour tout réel a strictement positif et pour tout entier n, &nbsp $${logString}\\left(a^n\\right)=n \\times ${logString}\\left(a\\right)$ donc `
      const signe = listeTypeQuestions[i] === 1 ? '+' : '-'
      switch (listeTypeQuestions[i]) {
        case 1: // log(A*B)
          texte = this.sup3
            ? `${logString}\\left(${exprime(A)}\\times ${exprime(B)}\\right)`
            : `${logString}\\left(${valeurAfoisB}\\right)`
          if (this.sup3) {
            texteCorr += `$${texte}=${logString}\\left(${exprime(A)}\\right)${signe}${logString}\\left(${exprime(B)}\\right)$ ${justification1mult} <br>`
            texteCorr += `${justification2} $${texte}=${miseEnEvidence(`${A.exp}${logString} \\left(${A.base}\\right)${signe}${B.exp}${logString} \\left(${B.base}\\right)`)}$.`
          } else {
            texteCorr += `En décomposant $${valeurAfoisB}$ en facteurs premiers, on obtient : $${valeurAfoisB} = ${exprime(A)}\\times ${exprime(B)}$. &nbsp Ainsi : <br> ` 
            texteCorr += `$${texte}=${logString}\\left(${exprime(A)}\\times ${exprime(B)}\\right)= ${logString}\\left(${exprime(A)}\\right)${signe}${logString}\\left(${exprime(B)}\\right)$ ${justification1mult} <br> `
            texteCorr += `${justification2}  $${texte}=${miseEnEvidence(`${A.exp}${logString} \\left(${A.base}\\right)${signe}${B.exp}${logString} \\left(${B.base}\\right)`)}$.`
          }
          break
        default: // log(A/B)
          texte = this.sup3
            ? `${logString}\\left(\\dfrac{${exprime(A)}}{${exprime(B)}}\\right)`
            : `${logString}\\left(\\dfrac{${valeurA}}{${valeurB}}\\right)`
          if (this.sup3) {
            texteCorr += `$${texte}= ${logString}\\left(${exprime(A)}\\right)${signe}${logString}\\left(${exprime(B)}\\right)$ ${justification1div} <br> `
            texteCorr += `${justification2} $${texte}=${miseEnEvidence(`${A.exp}${logString} \\left(${A.base}\\right)${signe}${B.exp}${logString} \\left(${B.base}\\right)`)}$. `
          } else {
            texteCorr += `En décomposant $${valeurA}$ et $${valeurB}$ en facteurs premiers, on obtient :  $\\dfrac{${valeurA}}{${valeurB}} = \\dfrac{${exprime(A)}}{${exprime(B)}}$. &nbsp Ainsi : <br> `
            texteCorr += `$${texte}=${logString}\\left(\\dfrac{${exprime(A)}}{${exprime(B)}}\\right)= ${logString}\\left(${exprime(A)}\\right)${signe}${logString}\\left(${exprime(B)}\\right)$ ${justification1div} <br> `
            texteCorr += `${justification2} $${texte}=${miseEnEvidence(`${A.exp}${logString} \\left(${A.base}\\right)${signe}${B.exp}${logString} \\left(${B.base}\\right)`)}$.`
          }
          break
      }

      texte = `${intro}$${texte}$`
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
