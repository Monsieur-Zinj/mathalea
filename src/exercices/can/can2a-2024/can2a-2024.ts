import { setReponse } from '../../../lib/interactif/gestionInteractif'
import Exercice from '../../Exercice'
import Question1 from '../2e/can2a-2024-Q1.js'
import Question2 from '../2e/can2a-2024-Q2.js'
import Question3 from '../2e/can2a-2024-Q3.js'
import Question4 from '../2e/can2a-2024-Q4.js'
import Question5 from '../2e/can2a-2024-Q5.js'
import Question6 from '../2e/can2a-2024-Q6.js'
import Question7 from '../2e/can2a-2024-Q7.js'
import Question8 from '../2e/can2a-2024-Q8.js'
import Question9 from '../2e/can2a-2024-Q9.js'
import Question10 from '../2e/can2a-2024-Q10.js'
import Question11 from '../2e/can2a-2024-Q11.js'
import Question12 from '../2e/can2a-2024-Q12.js'
import Question13 from '../2e/can2a-2024-Q13.js'
import Question14 from '../2e/can2a-2024-Q14.js'
import Question15 from '../2e/can2a-2024-Q15.js'
import Question16 from '../2e/can2a-2024-Q16.js'
import Question17 from '../2e/can2a-2024-Q17.js'
import Question18 from '../2e/can2a-2024-Q18.js'
import Question19 from '../2e/can2a-2024-Q19.js'
import Question20 from '../2e/can2a-2024-Q20.js'
import Question21 from '../2e/can2a-2024-Q21.js'
import Question22 from '../2e/can2a-2024-Q22.js'
import Question23 from '../2e/can2a-2024-Q23.js'
import Question24 from '../2e/can2a-2024-Q24.js'
import Question25 from '../2e/can2a-2024-Q25.js'
import Question26 from '../2e/can2a-2024-Q26.js'
import Question27 from '../2e/can2a-2024-Q27.js'
import Question28 from '../2e/can2a-2024-Q28.js'
import Question29 from '../2e/can2a-2024-Q29.js'
import Question30 from '../2e/can2a-2024-Q30.js'

import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive'

export const titre = 'CAN 2nde sujet 2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'testCan2024'
// export const ref = 'can2a-2024'

/**
 * Annales CAN 2024
 * @author Gilles Mora
*/

export default class Can2a2024 extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 30
    this.nbQuestionsModifiable = false
    this.formatChampTexte = 'largeur01 inline nospacebefore'
    this.formatInteractif = 'calcul'
    this.besoinFormulaireCaseACocher = ['Sujet officiel']
    this.sup = false
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []

    let indexQuestion = 0
    for (const Question of [Question1,
      Question2,
      Question3,
      Question4,
      Question5,
      Question6,
      Question7,
      Question8,
      Question9,
      Question10,
      Question11,
      Question12,
      Question13,
      Question14,
      Question15,
      Question16,
      Question17,
      Question18,
      Question19,
      Question20,
      Question21,
      Question22,
      Question23,
      Question24,
      Question25,
      Question26,
      Question27,
      Question28,
      Question29,
      Question30]) {
      const Q = new Question()
      Q.canOfficielle = this.sup
      Q.interactif = this.interactif
      Q.nouvelleVersion()
      this.formatChampTexte = Q.formatChampTexte
      this.formatInteractif = Q.formatInteractif
      setReponse(this, indexQuestion, Q.reponse, { formatInteractif: Q.formatInteractif })
      let texte = Q.question
      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, indexQuestion, Q.formatChampTexte || '', Q.optionsChampTexte || {})
      }
      this.canEnonce = Q.canEnonce
      this.canReponseACompleter = ''
      this.listeCanEnonces.push(Q.canEnonce!)
      this.listeCanReponsesACompleter.push(Q.canReponseACompleter!)
      this.listeQuestions.push(texte!)
      this.listeCorrections.push(Q.correction!)
      indexQuestion++
    }
  }
}
