import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ComputeEngine } from '@cortex-js/compute-engine'

export const titre = 'Écrire une fraction sur 100 puis sous la forme d\'un pourcentage'
export const interactifReady = true
export const interactifType = ['mathLive', 'custom']
export const amcType = 'AMCNum'
export const amcReady = true

export const dateDeModifImportante = '19/11/2023' // Fill in the blank
const ce = new ComputeEngine()

/**
 * Une fraction étant donnée, il faut l'écrire avec 100 au dénominateur puis donner son écriture sous forme de pourcentage.
 * @author Rémi Angot
 * Référence 5N11-3
 * 2021-02-06
 */
export const uuid = '0e58f'
export const ref = '5N11-3'
export default function FractionVersPourcentage () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne = 'Compléter :'
  this.nbQuestions = 6
  this.nbCols = 2
  this.nbColsCorr = 2

  this.besoinFormulaireNumerique = ['Difficulté', 2, '1 : Partir d\'une fraction de dénominateur autre que 100\n2 : Partir d\'une fraction de dénominateur 100']
  this.sup = 1

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const typeDeDenominateurs = [10, 20, 50, 1000, 2, 4, 5, 200]
    const listeTypeDeQuestions = combinaisonListes(typeDeDenominateurs, this.nbQuestions)
    for (let i = 0, texte, texteCorr, percenti, den, num, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      den = listeTypeDeQuestions[i]
      if (den === 2) {
        num = choice([1, 3, 5])
      } else if (den === 1000) {
        num = 10 * randint(1, 99)
      } else if (den === 200) {
        num = 2 * randint(1, 99)
      } else {
        num = randint(1, den - 1)
      }
      percenti = calculANePlusJamaisUtiliser(num * 100 / den)
      if (this.sup === 1) {
        this.interactifType = 'custom'
        texte = `<math-field readonly style="font-size:2em" id="champTexteEx${this.numeroExercice}Q${i}">
        \\dfrac{${num}}{${texNombre(den)}}~=~\\dfrac{\\placeholder[num1]{}}{\\placeholder[den1]{}} 
        ~=~\\dfrac{\\placeholder[num2]{}}{100} 
        ~=~\\placeholder[percent]{}\\%
      </math-field><span class="ml-2" id="feedbackEx${this.numeroExercice}Q${i}"></span>`

        if (den < 100) {
          texteCorr = `$\\dfrac{${num}}{${texNombre(den)}}=\\dfrac{${num}{\\color{blue}\\times${calculANePlusJamaisUtiliser(100 / den)}}}{${den}{\\color{blue}\\times${calculANePlusJamaisUtiliser(100 / den)}}}=\\dfrac{${percenti}}{100}=${percenti}~\\%$`
        } else {
          texteCorr = `$\\dfrac{${num}}{${texNombre(den)}}=\\dfrac{${num}{\\color{blue}\\div${calculANePlusJamaisUtiliser(den / 100)}}}{${den}{\\color{blue}\\div${calculANePlusJamaisUtiliser(den / 100)}}}=\\dfrac{${percenti}}{100}=${percenti}~\\%$`
        }
      } else {
        this.interactifType = 'mathLive'
        texte = `$\\dfrac{${percenti}}{100}= $${context.isHtml && this.interactif ? ajouteChampTexteMathLive(this, i, 'largeur10 inline', { texteApres: ' %' }) : '$\\ldots\\ldots\\%$'}`
        texteCorr = `$\\dfrac{${percenti}}{100}=${percenti}~\\%$`
      }
      setReponse(this, i, percenti, { formatInteractif: 'calcul', digits: 3, decimals: 0 })
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  this.correctionInteractive = function (i) {
    const reponseAttendue = this.autoCorrection[i].reponse.valeur[0].toString()
    if (this.answers === undefined) this.answers = {}
    let result
    const mf = document.querySelector(`#champTexteEx${this.numeroExercice}Q${i}`)
    this.answers[`Ex${this.numeroExercice}Q${i}`] = mf.getValue()
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`)
    const num1 = mf.getPromptValue('num1')
    const num2 = mf.getPromptValue('num2')
    const den1 = mf.getPromptValue('den1')
    const percent = mf.getPromptValue('percent')
    const test1 = ce.parse(`\\frac{${num1}}{${den1}}`, { canonical: true }).isEqual(ce.parse(`\\frac{${reponseAttendue}}{${100}}`))
    const test2 = ce.parse(num2).isSame(ce.parse(reponseAttendue))
    const test3 = ce.parse(percent).isSame(ce.parse(reponseAttendue))
    if (test1 && test2 && test3) {
      divFeedback.innerHTML = '😎'
      result = 'OK'
    } else {
      divFeedback.innerHTML = '☹️'
      result = 'KO'
    }
    mf.setPromptState('num1', test1 ? 'correct' : 'incorrect', true)
    mf.setPromptState('den1', test1 ? 'correct' : 'incorrect', true)
    mf.setPromptState('num2', test2 ? 'correct' : 'incorrect', true)
    mf.setPromptState('percent', test3 ? 'correct' : 'incorrect', true)
    return result
  }
}
