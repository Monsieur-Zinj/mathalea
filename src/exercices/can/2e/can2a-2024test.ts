import Exercice from '../../ExerciceTs'
import { listeQuestionsToContenu } from '../../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive'
import { setReponse } from '../../../lib/interactif/gestionInteractif'
import { blocCode, miseEnEvidence, texteCode } from '../../../lib/outils/embellissements'

export const titre = 'CAN Seconde entraînement 2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '01/01/2024'
export const uuid = 'b1c79'

/**
 * @author Rémi Angot
 */

type QuestionFunction = () => { texte: string, texteCorr: string, solution: string | number };
const questions: QuestionFunction[] = []

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.nbQuestionsModifiable = false
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    for (let i = 0; i < questions.length; i++) {
      const { texte, texteCorr, solution } = questions[i]()
      this.listeQuestions[i] = texte + ajouteChampTexteMathLive(this, i)
      this.listeCorrections[i] = texteCorr
      setReponse(this, i, solution)
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}

questions[0] = () => {
  const texte = '$40 \\times 25 = $'
  let texteCorr = '$\\begin{aligned}\n40 \\times 25 &= 4 \\times 10 \\times 25\\\\'
  texteCorr += ' &= 4  \\times 25 \\times 10\\\\'
  texteCorr += '\n&= 100 \\times 10\\\\'
  texteCorr += `\n&= ${miseEnEvidence('1~000')}\\\\`
  texteCorr += '\n\\end{aligned}$'
  const solution = 1000
  return { texte, texteCorr, solution }
}

questions[1] = () => {
  const texte = '$40 - 44 + 4 = $'
  let texteCorr = '$\\begin{aligned}\n40 - 44 + 4 &= 40 + 4 - 44\\\\'
  texteCorr += '\n&= 44 - 44\\\\'
  texteCorr += `\n&= ${miseEnEvidence('0')}\\\\`
  texteCorr += '\n\\end{aligned}$'
  const solution = 0
  return { texte, texteCorr, solution }
}

questions[2] = () => {
  const texte = 'Donner la forme développée et réduite.<br> $A = (2x + 3)(x - 5) = $'
  let texteCorr = '<br>$A = (2x + 3)(x - 5)$'
  texteCorr += '<br><br>$A = 2x \\times x + 2x \\times (-5) + 3 \\times x + 3 \\times(-5)$'
  texteCorr += '<br><br>$A = 2x^2 - 10x + 3x - 15$'
  texteCorr += `<br><br>$A = ${miseEnEvidence('2x^2 -7x -15')}$`
  const solution = '2x^2 -7x -15'
  return { texte, texteCorr, solution }
}

questions[3] = () => {
  const texte = '$5 - \\dfrac{1}{9} = $'
  let texteCorr = '$\\begin{aligned}\n5 - \\dfrac{1}{9} &= \\dfrac{5 \\times 9}{9} - \\dfrac{1}{9} \\\\\\\\'
  texteCorr += '\n&= \\dfrac{45}{9} - \\dfrac{1}{9}\\\\\\\\'
  texteCorr += `\n&= ${miseEnEvidence('\\dfrac{44}{9}')}`
  texteCorr += '\n\\end{aligned}$'
  const solution = '\\dfrac{44}{9}'
  return { texte, texteCorr, solution }
}

questions[4] = () => {
  const texte = '$15~\\%$ de $50$ : '
  let texteCorr = '$\\begin{aligned}\n15~\\% \\times 50 &= \\dfrac{15}{100} \\times 50 \\\\\\\\'
  texteCorr += '\n&= 15 \\times \\dfrac{50}{100} \\\\\\\\'
  texteCorr += '\n&= 15 \\div 2\\\\\\\\'
  texteCorr += `\n&= ${miseEnEvidence('7{,}5')}`
  texteCorr += '\n\\end{aligned}$'
  const solution = 7.5
  return { texte, texteCorr, solution }
}

questions[5] = () => {
  const texte = '$1,2 + 0{,}04 = $'
  let texteCorr = '$\\begin{aligned}\n1,2 + 0{,}04 &= 1 + \\dfrac{20}{100} + \\dfrac{4}{100}\\\\\\\\'
  texteCorr += `\n&=${miseEnEvidence('1{,}24')}`
  texteCorr += '\n\\end{aligned}$'
  const solution = 1.24
  return { texte, texteCorr, solution }
}

questions[6] = () => {
  const texte = 'Augmenter de $15~\\%$ revient à multiplier par : '
  let texteCorr = '$100~\\% + 15~\\% = 115~\\% = \\dfrac{115}{100} = 1{,}15$'
  texteCorr += `<br><br>Donc augmenter de $15~\\%$ revient à multiplier par $${miseEnEvidence('1{,}15')}$.`
  const solution = 1.15
  return { texte, texteCorr, solution }
}

questions[7] = () => {
  const texte = 'Déterminer la médiane de la série : 15 ; 7 ; 8 ; 20 ; 13.<br>'
  let texteCorr = 'On ordonne la série : 7 ; 8 ; 13 ; 15 ; 20.'
  texteCorr += `<br>La série comporte 5 éléments donc la médiane est la troisième valeur : $${miseEnEvidence('13')}$.`
  const solution = 13
  return { texte, texteCorr, solution }
}

questions[8] = () => {
  const texte = '$\\sqrt{144}=$'
  const texteCorr = `On sait que $12$ est positif et $12^2 = 12 \\times 12 = 144$ donc $\\sqrt{144} = ${miseEnEvidence('12')}$.`
  const solution = 12
  return { texte, texteCorr, solution }
}

questions[9] = () => {
  let texte = `Que renvoie ${texteCode('machine(5)')} ?`
  texte += `<br><br>${blocCode(`def machine(a):
  \n\t  return 2-a`)}`
  const texteCorr = `On calcule $2-a$ pour $a = 5$ et on obtient : $2 - 5 = ${miseEnEvidence('-3')}$.`
  const solution = -3
  return { texte, texteCorr, solution }
}
