import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive, ajouteFeedback, remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ComputeEngine } from '@cortex-js/compute-engine'

export const titre = 'Écrire une fraction sur 100 puis sous la forme d\'un pourcentage'
export const interactifReady = true
export const interactifType = ['custom', 'mathLive']
export const amcType = 'AMCNum'
export const amcReady = true
export const dateDePublication = '06/02/2021'
export const dateDeModifImportante = '19/11/2023' // Fill in the blank
const ce = new ComputeEngine()

/**
 * Une fraction étant donnée, il faut l'écrire avec 100 au dénominateur puis donner son écriture sous forme de pourcentage.
 * @author Rémi Angot
 */
export const uuid = '0e58f'
export const ref = '5N11-3'
export default function FractionVersPourcentage () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne = 'Compléter.'
  this.nbQuestions = 6
  this.nbCols = 2
  this.nbColsCorr = 2

  this.besoinFormulaireNumerique = ['Difficulté', 2, '1 : Partir d\'une fraction de dénominateur autre que 100\n2 : Partir d\'une fraction de dénominateur 100']
  this.sup = 1

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    this.introduction = this.interactif ? 'La première fraction est facultative : elle sera corrigée, mais ne sera pas prise en compte dans le barème.' : ''

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
      percenti = Math.round(num * 100 / den)
      if (this.sup === 1) {
        this.interactifType = 'custom'
        texte = remplisLesBlancs(this, i, `\\dfrac{${num}}{${den}}=\\dfrac{%{num1}}{%{den1}}=\\dfrac{%{num2}}{100}=%{percent}\\%`, 'college6e', '\\ldots\\ldots')
        texte += ajouteFeedback(this, i)
        if (den < 100) {
          texteCorr = `$\\dfrac{${num}}{${texNombre(den)}}=\\dfrac{${num}{\\color{blue}\\times${100 / den}}}{${den}{\\color{blue}\\times${100 / den}}}=\\dfrac{${percenti}}{100}=${percenti}~\\%$`
        } else {
          texteCorr = `$\\dfrac{${num}}{${texNombre(den)}}=\\dfrac{${num}{\\color{blue}\\div${den / 100}}}{${den}{\\color{blue}\\div${den / 100}}}=\\dfrac{${percenti}}{100}=${percenti}~\\%$`
        }
        setReponse(this, i, { num1: { value: '' }, num2: { value: String(percenti) }, percent: { value: String(percenti) } }, { formatInteractif: 'fillInTheBlank', digits: 3, decimals: 0 })
      } else {
        this.interactifType = 'mathLive'
        texte = `$\\dfrac{${percenti}}{100}= $${context.isHtml && this.interactif ? ajouteChampTexteMathLive(this, i, 'largeur10 inline', { texteApres: ' %' }) : '$\\ldots\\ldots\\%$'}`
        texteCorr = `$\\dfrac{${texNombre(percenti, 0)}}{100}=${texNombre(percenti, 0)}~\\%$`
        setReponse(this, i, percenti, { formatInteractif: 'calcul', digits: 3, decimals: 0 })
      }

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
    const reponseAttendue = this.autoCorrection[i].reponse.valeur.percent.value
    if (this.answers === undefined) this.answers = {}
    let result = 'KO'
    const mf = document.querySelector(`math-field#champTexteEx${this.numeroExercice}Q${i}`)
    if (mf == null) {
      window.notify(`La correction de 5N11-3 n'a pas trouvé de mathfield d'id champTexteEx${this.numeroExercice}Q${i}`)
    } else {
      this.answers[`Ex${this.numeroExercice}Q${i}`] = mf.getValue()
      const spanResultat = document.querySelector(`span#resultatCheckEx${this.numeroExercice}Q${i}`)
      const num1 = mf.getPromptValue('num1')
      const num2 = mf.getPromptValue('num2')
      const den1 = mf.getPromptValue('den1')
      const percent = mf.getPromptValue('percent')
      const test1 = ce.parse(`\\frac{${num1.replace(',', '.')}}{${den1}}`, { canonical: true }).isEqual(ce.parse(`\\frac{${reponseAttendue}}{${100}}`))
      const test1Bis = ce.parse(den1).isEqual(ce.parse('100'))
      const test1Ter = den1 === '' || num1 === ''
      const test2 = ce.parse(num2).isSame(ce.parse(reponseAttendue))
      const test3 = ce.parse(percent).isSame(ce.parse(reponseAttendue))
      let smiley; let feedback = ''
      if (test2 && test3) {
        smiley = '😎'
        result = 'OK'
        if (test1) { // On a bon, mais regardons le premier calcul facultatif ici il est correct
          if (!test1Bis) { // pas égal à 100 au dénominateur
            feedback += 'La première fraction est correcte mais le dénominateur ne vaut pas $100$.'
          }
          // sinon, il n'y a rien a dire.
        } else { // le premier calcul est faux, il faut le dire
          if (test1Ter) {
            feedback += 'La première fraction est incomplète.'
          } else {
            feedback += 'La première fraction est incorrecte.'
          }
        }
      } else { // ici le résultat est faux (ou la fraction sur 100)
        smiley = '☹️'
        result = 'KO'
        if (test1Ter) {
          feedback += 'La première fraction est incomplète'
        } else {
          if (test1) { // On regarde le premier calcul ici il est juste
            if (!test1Bis) { // pas égal à 100 au dénominateur
              feedback += 'La première fraction est correcte mais le dénominateur ne vaut pas $100$'
            } else {
              feedback += 'La première fraction est incorrecte'
            }
          } else {
            feedback += 'Le calcul est faux'
          }// ici, le premier calcul est faux donc tout est faux, y a rien a dire
        }
        feedback += ' et le résultat final est faux.'
      }
      const divDuFeedback = document.querySelector(`div#feedbackEx${this.numeroExercice}Q${i}`)
      divDuFeedback.classList.add('ml-2', 'py-2', 'italic', 'text-coopmaths-warn-darkest', 'dark:text-coopmathsdark-warn-darkest')
      spanResultat.innerHTML = smiley
      divDuFeedback.innerHTML = feedback
      spanResultat.after(divDuFeedback)
      mf.setPromptState('num1', test1 ? 'correct' : 'incorrect', true)
      mf.setPromptState('den1', test1 ? 'correct' : 'incorrect', true)
      mf.setPromptState('num2', test2 ? 'correct' : 'incorrect', true)
      mf.setPromptState('percent', test3 ? 'correct' : 'incorrect', true)
    }
    return result
  }
}
