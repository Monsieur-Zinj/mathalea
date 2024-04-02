import ProblemeCourse from '../6e/6C32.js'
export const titre = 'Problème - Les courses'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
 *Clone de 6C32 pour les CM1-CM2
 *
 * @author Jean-Claude Lhote
 */
export const uuid = 'b74c6'
export const ref = 'c3C31'
export const refs = {
  'fr-fr': ['c3C31'],
  'fr-ch': []
}
export default function ProblemeCourseC3 () {
  ProblemeCourse.call(this)
  this.nbQuestions = 1
  this.sup = true
}
