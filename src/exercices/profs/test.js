import { ComputeEngine } from '@cortex-js/compute-engine'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { expressionDeveloppeeEtNonReduiteCompare, fonctionComparaison } from '../../lib/interactif/comparisonFunctions.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

export const titre = 'Eric fait ses tests interactifs.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = 'testEE'

const engine = new ComputeEngine()
// export engine

function customCanonicalEE (expr) {
  if (typeof expr.value === 'number') {
    if (expr.head === 'Divide' || expr.head === 'Rational') {
      if (expr.engine.box(['GCD', expr.op1, expr.op2]).value !== 1) return expr
    }
    return expr.engine.number(expr.value)
  }

  if (expr.ops) {
    return expr.engine.box([expr.head, ...expr.ops.map(customCanonicalEE)], {
      canonical: ['InvisibleOperator', 'Order', 'Flatten']
    })
  }

  return expr.canonical
}

export default function desTestsPourInteractivité () {
  Exercice.call(this)
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.consigne = 'Pour tester cette expression et QUE celle-là :'
  this.nouvelleVersion = function () {
    // console.log(customCanonicalEE(engine.parse('3x^2-3x-3', { canonical: false })).json)
    // console.log(customCanonicalEE(engine.parse('3x^2-3-3x', { canonical: false })).json)
    // console.log(customCanonicalEE(engine.parse('3x^2-3x-3', { canonical: false })).toString())
    // console.log(customCanonicalEE(engine.parse('3x^2-3-3x', { canonical: false })).toString())
    // console.log(customCanonicalEE(engine.parse('3x^2-3x-3', { canonical: false })).ops[0].head)
    // console.log(customCanonicalEE(engine.parse('3x^2-3-3x', { canonical: false })).ops[0].head)
    // .isSame(customCanonicalEE(engine.parse('5\\times4c+1', { canonical: false }))))
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    for (let i = 0, texte, texteCorr, cpt = 0, a, b; i < this.nbQuestions && cpt < 50;) {
      a = randint(1, 12)
      b = randint(2, 12)
      // const reponse = '7\\sqrt{4-3}-6\\div\\sqrt2'
      // const reponse = '\\sqrt{2}'
      // const reponse = '6\\sqrt2-7'
      // const reponse = '3\\ln(3x^2-1)'
      // const reponse = new FractionEtendue(5, 3)
      // const reponse = '\\dfrac{3}{5}'
      // const reponse = '3x+2'
      const reponse = '\\dfrac{-2x}{-5}'
      texteCorr = ''
      texte = `$${reponse}=$` + ajouteChampTexteMathLive(this, i, 'inline15 college6eme')
      // handleAnswers(this, i, { reponse: { value: reponse, compare: expressionDeveloppeeEtNonReduiteCompare } })
      handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })

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
