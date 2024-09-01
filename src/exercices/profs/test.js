// import { ComputeEngine } from '@cortex-js/compute-engine'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ensembleNombres, fonctionComparaison } from '../../lib/interactif/comparisonFunctions.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue'
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

/*
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
*/
const engine = new ComputeEngine()

function comparaisonFractionArnoG (input, goodAnswer) {
  const saisie = engine.parse(input, { canonical: false })
  const reponse = engine.parse(goodAnswer, { canonical: false })
  // console.log(saisie.op1, saisie.op1.value, 'saisie.op1.re', saisie.op1.re, 'reponse.op1.re', reponse.op1.re)
  console.log(saisie.isInteger, reponse.isInteger)
  if (saisie.isEqual(reponse)) {
    // if (saisie.isInteger && !reponse.isInteger) { // -> Ne convient pas car saisie peut être décimal
    if (!saisie.op1.value && !reponse.isInteger) { // Si pas de op1.value, c'est que saisie est un nombre
      console.log(false, 'Résultat incorrect car une fraction est attendue.') // Sous-entendu : Et pas un nombre (sauf si la fraction se réduit à un entier)
    } else if (saisie.isInteger && reponse.isInteger) console.log(true)
    else if (
      saisie.operator === 'Divide' ||
    (saisie.operator === 'Rational' &&
      saisie.op1.re < reponse.op1.re &&
      reponse.op1.re % saisie.op1.re === 0)
    ) { console.log(true) } else if (
      saisie.operator === 'Divide' ||
    (saisie.operator === 'Rational' && saisie.op1.re >= reponse.op1.re)
    ) {
      console.log(
        false,
        'Résultat incorrect car une fraction simplifiée est attendue.'
      )
    // Sous-entendu : Et pas une fraction égale mais non simplifiée
    } else if (
      saisie.op1.re < reponse.op1.re &&
    reponse.op1.re % saisie.op1.re !== 0
    ) {
      console.log(
        false,
        "Résultat incorrect car la fraction n'est pas simplifiée comme il se doit." // Sous-entendu : Les numérateurs/dénominateurs ne sont pas multiples entre les deux fractions ou bien la fraction input continent des valeurs décimales
      )
    } else console.log(false, 'Résultat incorrect car une fraction est attendue2.')
  } else console.log(false, 'Résultat incorrect.')
}

function comparaisonFraction (input, goodAnswer) {
  const saisieNativeParsed = engine.parse(input, { canonical: false })
  const reponseNativeParsed = engine.parse(goodAnswer, { canonical: false })
  const reponseParsed = reponseNativeParsed.engine.number(reponseNativeParsed.value)
  console.log(reponseNativeParsed, reponseNativeParsed.value, reponseParsed)
  if (saisieNativeParsed.isEqual(reponseNativeParsed)) {
    if (saisieNativeParsed.head === 'Number' && reponseParsed.isInteger) { // réponse est égale à un entier et saisie est un nombre entier (2) ou décimal (2.0).
      console.log(true)
    } else if ((saisieNativeParsed.head === 'Divide' || saisieNativeParsed.head === 'Rational') && // saisie doit être une fraction (ou une division)
  saisieNativeParsed.op1.value < reponseNativeParsed.op1.value && // saisie doit avoir des numérateur/dénominateur plus petits que reponse
  saisieNativeParsed.op1.isInteger && saisieNativeParsed.op2.isInteger && // saisie doit avoir des numérateur/dénominateur entiers
  reponseNativeParsed.op1.value % saisieNativeParsed.op1.value !== 0) { // reponse doit avoir des numérateur/dénominateur multiples de ceux de saisie
      console.log(true)
    /// Ci-dessous : le traitement des feedback : les saisies sont égales aux réponses mais la saisie ne convient tout de même pas.
    } else if ((!saisieNativeParsed.op1.value) && (!reponseParsed.isInteger)) { // Si pas de op1.value, c'est que saisie est un nombre alors que reponse n'est pas entier.
      console.log(false, 'Résultat incorrect car une fraction est attendue.') // Sous-entendu : Et pas un nombre
    } else if (saisieNativeParsed.head === 'Divide' || saisieNativeParsed.head === 'Rational') {
      if (saisieNativeParsed.op1.value >= reponseNativeParsed.op1.value) {
        console.log(false, 'Résultat incorrect car une fraction simplifiée est attendue.') // Sous-entendu : Et pas numérateur/dénominateur plus grands ou égaux que reponse
      } else if (saisieNativeParsed.op1.isInteger && saisieNativeParsed.op2.isInteger) {
        console.log(false, 'Résultat incorrect car dénominateur et numérateur doivent être entiers.') // Sous-entendu : Et pas numérateur/dénominateur décimaux pour au moins l'un d'entre eux
      } else if (reponseNativeParsed.op1.value % saisieNativeParsed.op1.value !== 0) {
        console.log(false, 'Résultat incorrect car une fraction réduite est attendue.') // Sous-entendu : Et pas numérateur/dénominateur de reponse non multiples de ceux de saisie
      }
    } else console.log(false, 'Résultat incorrect car une fraction est attendue.') // Sous-entendu : Et pas une opération autre qu'une division
  } else console.log(false, 'Résultat incorrect.')
}
// console.log('test OOOO')
// comparaisonFractionArnoG('\\frac{12}{6}', '\\frac{24}{12}') // -> true
// console.log('test XXXX11')
// comparaisonFraction('-\\frac{24}{12}', '\\frac{-24}{12}') // -> true
// console.log('test YYYYY')
// comparaisonFraction('\\frac{24}{-12}', '\\frac{-24}{12}') // -> true
// comparaisonFraction('\\frac{12}{6}', '\\frac{24}{12}') // -> true
// comparaisonFraction('0.75', '\\frac{60}{80}') // -> false Résultat incorrect car une fraction est attendue.
/*
console.log('test1')
comparaisonFractionArnoG('\\frac{12}{6}', '\\frac{24}{12}') // -> true
console.log('test2')
comparaisonFraction('\\frac{2}{1}', '\\frac{24}{12}') // -> true
console.log('test3')
comparaisonFraction('2', '\\frac{24}{12}') // -> true
console.log('test4')
comparaisonFraction('\\frac{24}{12}', '\\frac{24}{12}') // -> false Résultat incorrect car une fraction simplifiée est attendue.
console.log('test5')
comparaisonFraction('\\frac{240}{120}', '\\frac{24}{12}') // -> false Résultat incorrect car une fraction simplifiée est attendue.
console.log('test5')
comparaisonFraction('\\frac{240}{120}', '\\frac{24}{12}') // -> false Résultat incorrect car une fraction simplifiée est attendue.
console.log('test6')
comparaisonFraction('\\frac{6}{8}', '\\frac{60}{80}') // -> true
console.log('test7')
comparaisonFraction('0.75', '\\frac{60}{80}') // -> false Résultat incorrect car une fraction est attendue.

console.log('testArnoG1')
comparaisonFractionArnoG('\\frac{12}{6}', '\\frac{24}{12}') // -> true
console.log('testArnoG2')
comparaisonFractionArnoG('\\frac{2}{1}', '\\frac{24}{12}') // -> true
console.log('testArnoG3')
comparaisonFractionArnoG('2', '\\frac{24}{12}') // -> true
console.log('testArnoG4')
comparaisonFractionArnoG('\\frac{24}{12}', '\\frac{24}{12}') // -> false Résultat incorrect car une fraction simplifiée est attendue.
console.log('testArnoG5')
comparaisonFractionArnoG('\\frac{240}{120}', '\\frac{24}{12}') // -> false Résultat incorrect car une fraction simplifiée est attendue.
console.log('testArnoG5')
comparaisonFractionArnoG('\\frac{240}{120}', '\\frac{24}{12}') // -> false Résultat incorrect car une fraction simplifiée est attendue.
console.log('testArnoG6')
comparaisonFractionArnoG('\\frac{6}{8}', '\\frac{60}{80}') // -> true
console.log('testArnoG7')
comparaisonFractionArnoG('0.75', '\\frac{60}{80}') // -> false Résultat incorrect car une fraction est attendue.
*/

/* console.log('-\\dfrac12'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.log('\\dfrac{-12}{-13}'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.log('-\\dfrac{-12}{-13}'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.log('-\\dfrac{-12}{-13}'.replace(/^\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) < 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
*/

export default function desTestsPourInteractivité () {
  Exercice.call(this)
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  // this.consigne = 'Quel est le résultat des calculs suivants ?'
  this.nouvelleVersion = function () {
    // console.info(customCanonicalEE(engine.parse('3x^2-3x-3', { canonical: false })).json)
    // console.info(customCanonicalEE(engine.parse('3x^2-3-3x', { canonical: false })).json)
    // console.info(customCanonicalEE(engine.parse('3x^2-3x-3', { canonical: false })).toString())
    // console.info(customCanonicalEE(engine.parse('3x^2-3-3x', { canonical: false })).toString())
    // console.info(customCanonicalEE(engine.parse('3x^2-3x-3', { canonical: false })).ops[0].head)
    // console.info(customCanonicalEE(engine.parse('3x^2-3-3x', { canonical: false })).ops[0].head)
    // .isSame(customCanonicalEE(engine.parse('5\\times4c+1', { canonical: false }))))

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    for (let i = 0, texte, texteCorr, cpt = 0, a, b; i < this.nbQuestions && cpt < 50;) {
      a = randint(1, 12)
      b = randint(2, 12)
      const set1 = engine.box(['Set', 1, 2, 3, 4])
      const set2 = engine.box(['Set', 1, 2, 4, 3])
      // console.log(set1.isSame(set2))
      // console.log(set1.isEqual(set2))
      /*
      console.log('test1')
      ensembleNombres('1;2;3;3', '1;2;3;4')
      console.log('test2')
      ensembleNombres('1;2;3', '1;2;3;4')
      console.log('test1')
      ensembleNombres('1;2;4;3', '1;2;3;4')
*/
      console.log(parseFloat(5))

      // const reponse = '7\\sqrt{4-3}-6\\div\\sqrt2'
      // const reponse = '\\sqrt{2}'
      // const reponse = '6\\sqrt2-7'
      // const reponse = '3\\ln(3x^2-1)'
      // const reponse = new FractionEtendue(5, 3)
      // const reponse = '\\dfrac{3}{5}'
      // const reponse = '3x+2'
      // const enonce = 0.4
      const reponse = 0.4
      // const reponse = new FractionEtendue(20, 50).toLatex()
      // const enonce = '$Donner une fraction décimale de $' + new FractionEtendue(20, 50).toLatex() + '$ : $'
      const enonce = '$Donner une fraction décimale égale à 0.4 : $'
      // reponse = reponse.toString()
      texteCorr = ''
      // texte = `$${enonce}=$` + ajouteChampTexteMathLive(this, i, 'inline15 college6eme ' + KeyboardType.clavierDeBaseAvecFraction)
      texte = `$${enonce}$` + ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction)
      texte += ajouteFeedback(this, i)
      // texte += `$${enonce}$` + ajouteChampTexteMathLive(this, i + 1, 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction)
      // texte += ajouteFeedback(this, i + 1)
      // handleAnswers(this, i, { reponse: { value: reponse, compare: expressionDeveloppeeEtNonReduiteCompare } })
      // handleAnswers(this, i, { reponse: { value: reponse } })
      handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison, options: { fractionDecimale: true } } })
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
