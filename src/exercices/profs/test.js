// import { ComputeEngine } from '@cortex-js/compute-engine'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { ComputeEngine } from '@cortex-js/compute-engine'

export const titre = 'Eric fait ses tests interactifs.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

export const uuid = 'testEE'

const engine = new ComputeEngine()

/* console.log(engine.parse('2^6').isEqual(engine.parse('2^6'))) // -> true OK of course
console.log(engine.parse('2^6').isEqual(engine.parse('-2^6'))) // -> false OK
console.log(engine.parse('(-2)^6').isEqual(engine.parse('2^6'))) // -> true
console.log(engine.parse('(-2)^6').isSame(engine.parse('-2^6'))) // -> false
*/

/* console.info('-\\dfrac12'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.info('\\dfrac{-12}{-13}'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.info('-\\dfrac{-12}{-13}'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.info('-\\dfrac{-12}{-13}'.replace(/^\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) < 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
*/

export default function desTestsPourInteractivité () {
  Exercice.call(this)
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  // this.consigne = 'Quel est le résultat des calculs suivants ?'
  this.consigne = 'Compléter l\'égalité par une puissance d\'un nombre avec un exposant autre que 1.'
  this.nouvelleVersion = function () {
    for (let i = 0, texte, texteCorr, cpt = 0, a, b; i < this.nbQuestions && cpt < 50;) {
      a = randint(1, 12)
      b = randint(2, 12)

      // console.log(fonctionComparaison('16^1', '16', { sansExposantUn: true }).isOk)

      const reponse = '(2a-1)(2a-5)'
      // const reponse = new FractionEtendue(-20, 50).valeurDecimale
      // const enonce = '$Donner l\'ensemble des nombres entiers non nuls positifs inférieurs à 4 +' + reponse + '$ : $'
      // const enonce = '$Donner l\'ensemble des nombres entiers non nuls positifs inférieurs à 4 :$'
      const enonce = '(2a-3)^2-4 = '
      // const enonce = '$Donner une valeur numér égale à 0.4 : $'
      // reponse = reponse.toString()
      texteCorr = ''
      // texte = `$${enonce}=$` + ajouteChampTexteMathLive(this, i, 'inline15 college6eme ' + KeyboardType.clavierDeBaseAvecFraction)
      texte = `$${enonce}$` + ajouteChampTexteMathLive(this, i, KeyboardType.clavierFullOperations)
      // texte += `$${enonce}$` + ajouteChampTexteMathLive(this, i + 1, 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction)
      // texte += ajouteFeedback(this, i + 1)
      // handleAnswers(this, i, { reponse: { value: reponse, compare: expressionDeveloppeeEtNonReduiteCompare } })
      // handleAnswers(this, i, { reponse: { value: reponse } })
      handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison, options: { exclusifFactorisation: true } } })
      // handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })

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
