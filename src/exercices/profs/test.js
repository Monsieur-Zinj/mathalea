import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { expressionDeveloppeeEtNonReduiteCompare, expressionDeveloppeeEtReduiteCompare } from '../../lib/interactif/comparisonFunctions.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
// import { ComputeEngine } from '@cortex-js/compute-engine'

export const titre = 'Eric fait ses tests interactifs.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = 'testEE'

export default function desTestsPourInteractivité () {
  Exercice.call(this)
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.consigne = 'Pour tester cette expression et QUE celle-là :'
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    for (let i = 0, texte, texteCorr, cpt = 0, a, b; i < this.nbQuestions && cpt < 50;) {
      a = randint(1, 12)
      b = randint(2, 12)
      // const reponse = '7\\sqrt{4-3}-6\\div\\sqrt2'
      // const reponse = '\\sqrt{2}'
      // const reponse = '6\\sqrt2-7'
      // const reponse = '3\\ln(3x^2-1)'
      const reponse = '4e^{3x^2-1}'
      // const reponse = '\\dfrac{3}{5}'
      /// const reponse = '3x+2'
      texteCorr = ''
      texte = `$${reponse}=$` + ajouteChampTexteMathLive(this, i, 'inline15 college6eme')
      handleAnswers(this, i, { reponse: { value: reponse, compare: expressionDeveloppeeEtNonReduiteCompare } }, { formatInteractif: 'calcul' })

      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
