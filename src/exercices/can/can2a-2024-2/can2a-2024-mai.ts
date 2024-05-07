import Exercice from '../../Exercice'
import { listeQuestionsToContenu } from '../../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { calculCompare, equalFractionCompare, expressionDeveloppeeEtReduiteCompare, intervalsCompare } from '../../../lib/interactif/comparisonFunctions'
import { context } from '../../../modules/context'
import { sp } from '../../../lib/outils/outilString'

export const titre = 'Titre de l\'exercice'
export const dateDePublication = '7/5/2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'can2a-2024-2'

/**
 * Description didactique de l'exercice
 * @author
*/

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.nbQuestionsModifiable = false
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    let i = 0
    this.listeQuestions[i] = '$8 \\times 1,25 = $' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$8 \\times 1,25 = ${miseEnEvidence('10')}$`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, 0, { reponse: { value: '10', compare: calculCompare } })

    i = 1
    this.listeQuestions[i] = '$42 - 55 + 5 = $' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$42 - 55 + 5 = ${miseEnEvidence('-8')}$`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '-8', compare: calculCompare } })

    i = 2
    this.listeQuestions[i] = '$(2x-5)^2= $' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$(2x-5)^2 = ${miseEnEvidence('4x^2 - 20x + 25')} $`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '4x^2 - 20x + 25', compare: expressionDeveloppeeEtReduiteCompare } })

    i = 3
    this.listeQuestions[i] = '$\\dfrac{1}{5} + \\dfrac{1}{7} = $' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$\\dfrac{1}{5} + \\dfrac{1}{7} = ${miseEnEvidence('\\dfrac{12}{35}')} $`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '\\dfrac{12}{35}', compare: equalFractionCompare } })

    i = 4
    this.listeQuestions[i] = '$30~\\%~\\text{de}~20 = $' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$\\dfrac{30}{100} \\times 20 = 0,3 \\times 20 = ${miseEnEvidence('6')} $`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '6', compare: calculCompare } })

    i = 5
    this.listeQuestions[i] = '$0{,}2 \\times 0{,}4 = $' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$0{,}2 \\times 0{,}4 = ${miseEnEvidence('0{,}08')} $`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '0.08', compare: calculCompare } })

    i = 6
    this.listeQuestions[i] = 'Augmenter une quantité de $17~\\%$ revient à la multiplier par...' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$1 + 17~\\% = \\dfrac{117}{100} = 1{,}17$ <br>  Augmenter une quantité de $17~\\%$ revient à la multiplier par $${miseEnEvidence('1{,}17')}$.`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '1.17', compare: calculCompare } })

    i = 7
    this.listeQuestions[i] = 'Médiane de la série :<br>15 ; 2 ; 12 ; 10 ; 7' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `Série ordonnée : 2 ; 7 ; 10 ; 12 ; 15<br>L'effectif total est 5 donc la médiane est la 3e valeur : $${miseEnEvidence('10')}$.`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '10', compare: calculCompare } })

    i = 8
    this.listeQuestions[i] = '$\\sqrt{0{,}36} = $' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$\\sqrt{0{,}36} = ${miseEnEvidence('0{,}6')} $`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '0.6', compare: calculCompare } })

    i = 9
    this.listeQuestions[i] = 'Soit le script Python :<br> '
    if (context.isHtml) {
      this.listeQuestions[i] += '$\\begin{array}{|l|}\n'
      this.listeQuestions[i] += '\\hline\n'
      this.listeQuestions[i] += '\\\\\n \\texttt{def mystere(a) :}  \\\\\n '
      this.listeQuestions[i] += `\\\\\n ${sp(6)} \\texttt{if a>0 :}\\\\\n `
      this.listeQuestions[i] += `\\\\\n ${sp(12)} \\texttt{return 2*a}\\\\\n `
      this.listeQuestions[i] += `\\\\\n ${sp(6)} \\texttt{else :}\\\\\n `
      this.listeQuestions[i] += `\\\\\n ${sp(12)} \\texttt{return 3*a}\\\\\n `
      this.listeQuestions[i] += '\\hline\n'
      this.listeQuestions[i] += '\\end{array}\n$'
    } else {
      this.listeQuestions[i] += '\\medskip'
      this.listeQuestions[i] += '\\fbox{'
      this.listeQuestions[i] += '\\parbox{0.7\\linewidth}{'
      this.listeQuestions[i] += '\\setlength{\\parskip}{.5cm}'
      this.listeQuestions[i] += ' \\texttt{def mystere(a) :}\\newline'
      this.listeQuestions[i] += ' \\hspace*{3mm}\\texttt{if a>0 :}\\newline'
      this.listeQuestions[i] += ' \\hspace*{8mm}\\texttt{return 2*a}\\newline'
      this.listeQuestions[i] += ' \\hspace*{3mm}\\texttt{else :}\\newline'
      this.listeQuestions[i] += ' \\hspace*{8mm}\\texttt{return 3*a}\\newline'
      this.listeQuestions[i] += '}'
      this.listeQuestions[i] += '}\\newline'
      this.listeQuestions[i] += '\\medskip'
    }
    this.listeQuestions[i] += '<br><br>Que renvoie $\\texttt{mystere(-5)}$ ?' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$-5 \\lt 0 $ donc le script renvoie $-5 \\times 3 = ${miseEnEvidence('-15')}$.`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '-15', compare: calculCompare } })

    i = 10
    this.listeQuestions[i] = 'Si je parcours $1{,}5~\\text{km}$ en $10~\\text{min}$, quelle est ma vitesse moyenne en km/h ?<br>' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$1{,}5~\\text{km}$ en $10~\\text{min}$ donc $1{,}5~\\text{km} \\times 6 = 9~\\text{km}$ en une heure.<br>Ma vitesse moyenne est donc de $${miseEnEvidence('9')}~\\text{km/h}$.`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '9', compare: calculCompare } })

    i = 11
    this.listeQuestions[i] = 'Simplifier $\\Big(2\\sqrt{3}\\Big)^2 = $' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$\\Big(2\\sqrt{3}\\Big)^2 = 4 \\times 3 =  ${miseEnEvidence('12')} $`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '12', compare: calculCompare } })

    i = 12
    this.listeQuestions[i] = 'TODO Liste déroulante' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$\\Big(2\\sqrt{3}\\Big)^2 = 4 \\times 3 =  ${miseEnEvidence('12')} $`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '12', compare: calculCompare } })

    i = 13
    this.listeQuestions[i] = 'Quel est le périmètre d\'un carré de $49~\\text{cm}^2$ ?<br>' + ajouteChampTexteMathLive(this, i) + ' cm'
    this.listeCorrections[i] = `L'aire est de $49~\\text{cm}^2$ donc c'est un carré de $7~\\text{cm}$ de côté.<br> Son périmètre est : $4 \\times 7~\\text{cm} =  ${miseEnEvidence('28')}~\\text{cm}$`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '28', compare: calculCompare } })

    i = 14
    this.listeQuestions[i] = 'Quel est l\'intervalle de l\'ensemble des solutions de l\'équation $\\mid x-1 \\mid \\lt 2$ ?<br>' + ajouteChampTexteMathLive(this, i)
    this.listeCorrections[i] = `$S=${miseEnEvidence(']-1\\;;\\;3[')}$`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: ']-1;3[', compare: intervalsCompare } })

    i = 15
    this.listeQuestions[i] = 'Soient $A(5\\;;\\;9)$ et $B(7\\;;\\;3)$ dans un repère orthonormé.<br>Déterminer les coordonnées du vecteur $\\overrightarrow{AB}$.<br>' + ajouteChampTexteMathLive(this, i) + ' cm'
    this.listeCorrections[i] = `$AB = (x_B - x_A \\;;\\; y_B - y_A) = (7-5 \\;;\\; 3-9)   ${miseEnEvidence('(2 \\;;\\; -6 )')}$`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '(2;-6)', compare: calculCompare } })

    i = 16
    this.listeQuestions[i] = 'Soient $A(5\\;;\\;9)$ et $B(7\\;;\\;3)$ dans un repère orthonormé.<br>Déterminer la longueur $AB$.<br>' + ajouteChampTexteMathLive(this, i) + ' cm'
    this.listeCorrections[i] = `$AB = \\sqrt{{x_{\\overrightarrow{AB}}}^2 + {y_{\\overrightarrow{AB}}}^2}=\\sqrt{2^2 + 6^2} =   ${miseEnEvidence('\\sqrt{40}')}$`
    // @ts-expect-error problème de typage pour reponse
    handleAnswers(this, i, { reponse: { value: '\\sqrt{40}', compare: calculCompare } })

    listeQuestionsToContenu(this)
  }
}
