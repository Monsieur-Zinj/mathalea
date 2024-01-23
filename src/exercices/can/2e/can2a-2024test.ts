import Exercice from '../../Exercice'
import { listeQuestionsToContenu } from '../../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive'
import { setReponse } from '../../../lib/interactif/gestionInteractif'
import { blocCode, miseEnEvidence, texteCode } from '../../../lib/outils/embellissements'
import { context } from '../../../modules/context'

export const titre = 'CAN Seconde entraînement 2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '01/01/2024'
export const uuid = 'b1c79'

/**
 * @author Rémi Angot
 */

type QuestionFunction = (exercice?: Exercice) => { texte: string, texteCorr: string, solution: string | number };
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
      const { texte, texteCorr, solution } = questions[i](this)
      this.listeQuestions[i] = texte + ajouteChampTexteMathLive(this, i)
      if (context.isHtml) this.listeQuestions[i] += '<br><br><br>'
      if (context.isHtml) {
        this.listeCorrections[i] = texteCorr.replaceAll('aligned}[t]', 'aligned}')
      } else {
        this.listeCorrections[i] = texteCorr
      }
      setReponse(this, i, solution)
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}

questions[0] = (exercice) => {
  const texte = `$40 \\times 25 ${exercice?.interactif ? '=' : ''}$`
  let texteCorr = '$\\begin{aligned}[t] 40 \\times 25 &= 4 \\times 10 \\times 25\\\\'
  texteCorr += ' &= 4  \\times 25 \\times 10\\\\'
  texteCorr += '\n&= 100 \\times 10\\\\'
  texteCorr += `\n&= ${miseEnEvidence('1~000')}\\\\`
  texteCorr += '\n\\end{aligned}$'
  const solution = 1000
  return { texte, texteCorr, solution }
}

questions[1] = (exercice) => {
  const texte = `$40 - 44 + 4 ${exercice?.interactif ? '=' : ''} $`
  let texteCorr = '$\\begin{aligned}[t] 40 - 44 + 4 &= 40 + 4 - 44\\\\'
  texteCorr += '\n&= 44 - 44\\\\'
  texteCorr += `\n&= ${miseEnEvidence('0')}\\\\`
  texteCorr += '\n\\end{aligned}$'
  const solution = 0
  return { texte, texteCorr, solution }
}

questions[2] = (exercice) => {
  const texte = `Donner la forme développée et réduite.<br> $A = (2x + 3)(x - 5) ${exercice?.interactif ? '=' : ''}$`
  let texteCorr = '$A = (2x + 3)(x - 5)$'
  texteCorr += `<br><br>$A = ${miseEnEvidence('2x^2 -7x -15')}$`
  texteCorr += '<br><br>Le terme en $x^2$ vient de $2x \\times x = 2x^2$.'
  texteCorr += '<br><br>Le terme en $x$ vient de la somme de $2x \\times (-5)$ et de $3 \\times x$.'
  texteCorr += '<br><br>Le terme constant vient de $3 \\times (-5) = -15$.'
  const solution = '2x^2 -7x -15'
  return { texte, texteCorr, solution }
}

questions[3] = (exercice) => {
  const texte = `$5 - \\dfrac{1}{9} ${exercice?.interactif ? '=' : ''} $`
  let texteCorr = '$\\begin{aligned}[t] 5 - \\dfrac{1}{9} &= \\dfrac{5 \\times 9}{9} - \\dfrac{1}{9} \\\\\\\\'
  texteCorr += '\n&= \\dfrac{45}{9} - \\dfrac{1}{9}\\\\\\\\'
  texteCorr += `\n&= ${miseEnEvidence('\\dfrac{44}{9}')}`
  texteCorr += '\n\\end{aligned}$'
  const solution = '\\dfrac{44}{9}'
  return { texte, texteCorr, solution }
}

questions[4] = () => {
  const texte = '$15~\\%$ de $50$'
  const texteCorr = '$15~\\%$ de $100$ est égal à $15$, donc $15~\\%$ de $50$ est égal à la moitié de $15$ soit $7{,}5$.'
  const solution = 7.5
  return { texte, texteCorr, solution }
}

questions[5] = (exercice) => {
  const texte = `$1,2 + 0{,}04 ${exercice?.interactif ? '=' : ''} $`
  let texteCorr = '$\\begin{aligned}[t] 1,2 + 0{,}04 &= 1 + \\dfrac{20}{100} + \\dfrac{4}{100}\\\\\\\\'
  texteCorr += `\n&=${miseEnEvidence('1{,}24')}`
  texteCorr += '\n\\end{aligned}$'
  const solution = 1.24
  return { texte, texteCorr, solution }
}

questions[6] = () => {
  const texte = 'Augmenter de $15~\\%$ revient à multiplier par : '
  const texteCorr = `Augmenter de $15~\\%$ revient à multiplier par $1 + \\dfrac{15}{100} = 1 + 0,15 = ${miseEnEvidence('1{,}15')}$`
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

questions[8] = (exercice) => {
  const texte = `$\\sqrt{144} ${exercice?.interactif ? '=' : ''}$`
  const texteCorr = `On sait que $12$ est positif et $12^2 = 12 \\times 12 = 144$ donc $\\sqrt{144} = ${miseEnEvidence('12')}$.`
  const solution = 12
  return { texte, texteCorr, solution }
}

questions[9] = () => {
  let texte = ''
  if (context.isHtml) {
    texte = `Que renvoie ${texteCode('machine(5)')} ?`
    texte += `<br><br>${blocCode(`def machine(a):
    \n\t  return 2-a`)}`
  } else {
    texte = `Que renvoie \\texttt{machine(5)} ?\\newline
    \\newline
    \\fbox{
      \\parbox{0.5\\linewidth}{
        \\texttt{def machine(a)}\\newline
        \\hspace*{7mm}\\texttt{return 2-a }
      }
    }
    \\newline`
  }
  const texteCorr = `On calcule $2-a$ pour $a = 5$ et on obtient : $2 - 5 = ${miseEnEvidence('-3')}$.`
  const solution = -3
  return { texte, texteCorr, solution }
}
