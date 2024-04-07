import Question1 from '../can5a-2024/can5a-2024-Q1'
import Question2 from '../can5a-2024/can5a-2024-Q2'
import Question3 from '../can5a-2024/can5a-2024-Q3'
import Question4 from '../can5a-2024/can5a-2024-Q4'
import Question5 from '../can5a-2024/can5a-2024-Q5'
import Question6 from '../can5a-2024/can5a-2024-Q6'
import Question7 from '../can5a-2024/can5a-2024-Q7'
import Question8 from '../can5a-2024/can5a-2024-Q8'
import Question9 from '../can5a-2024/can5a-2024-Q9'
import Question10 from '../can5a-2024/can5a-2024-Q10'
import Question11 from '../can4a-2024/can4-2024-Q11.js'
import Question12 from '../can4a-2024/can4-2024-Q12.js'
import Question13 from '../can4a-2024/can4-2024-Q13.js'
import Question14 from '../can4a-2024/can4-2024-Q14.js'
import Question15 from '../can4a-2024/can4-2024-Q15.js'
import Question16 from '../can4a-2024/can4-2024-Q16.js'
import Question17 from '../can4a-2024/can4-2024-Q17.js'
import Question18 from '../can4a-2024/can4-2024-Q18.js'
import Question19 from '../can4a-2024/can4-2024-Q19.js'
import Question20 from '../can4a-2024/can4-2024-Q20.js'
import Question21 from '../can4a-2024/can4-2024-Q21.js'
import Question22 from '../can4a-2024/can4-2024-Q22.js'
import Question23 from '../can4a-2024/can4-2024-Q23.js'
import Question24 from '../can4a-2024/can4-2024-Q24.js'
import Question25 from '../can4a-2024/can4-2024-Q25.js'
import Question26 from '../can4a-2024/can4-2024-Q26.js'
import Question27 from '../can4a-2024/can4-2024-Q27.js'
import Question28 from '../can4a-2024/can4-2024-Q28.js'
import Question29 from '../can4a-2024/can4-2024-Q29.js'
import Question30 from '../can4a-2024/can4-2024-Q30.js'

import MetaExercice from '../../MetaExerciceCan'
import Exercice from '../../Exercice'

export const titre = 'CAN 4e sujet 2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '82764'
export const refs = {
  'fr-fr': ['can4a-2024'],
  'fr-ch': []
}
export const dateDePublication = '07/04/2024'

/**
 * Annales CAN 2024
 * @author Gilles Mora
*/

const exercices = [
  Question1,
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
  Question30
] as unknown

const questions = exercices as Exercice[]

export default class Can4a2024 extends MetaExercice {
  constructor () {
    super(questions)
  }
}
