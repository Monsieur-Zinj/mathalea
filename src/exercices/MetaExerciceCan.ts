import { handleAnswers, setReponse } from '../lib/interactif/gestionInteractif'
import Exercice from './Exercice'
import { ajouteChampTexteMathLive, ajouteFeedback, remplisLesBlancs } from '../lib/interactif/questionMathLive'
import { propositionsQcm } from '../lib/interactif/qcm'
import { expressionDeveloppeeEtReduiteCompare } from '../lib/interactif/comparisonFunctions'
import Grandeur from '../modules/Grandeur'
import Decimal from 'decimal.js'
import FractionEtendue from '../modules/FractionEtendue'

export const interactifType = 'mathLive'
export const interactifReady = true

export default class MetaExercice extends Exercice {
  Exercices: Exercice[]
  constructor (Exercices: Exercice[]) {
    super()
    this.Exercices = Exercices
    this.besoinFormulaireCaseACocher = ['Sujet officiel']
    this.nbQuestions = 30
    this.nbQuestionsModifiable = false
    this.sup = false
  }

  nouvelleVersion (): void {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []

    let indexQuestion = 0
    for (const Exercice of this.Exercices) {
      // @ts-expect-error : question is an Exercice
      const Question = new Exercice()
      Question.numeroExercice = this.numeroExercice
      Question.canOfficielle = !!this.sup
      Question.interactif = this.interactif
      Question.nouvelleVersion()
      //* ************ Question Exo simple *************//
      if (Question.listeQuestions.length === 0) { // On est en présence d'un exo simple
        const consigne = Question.consigne === '' ? '' : Question.consigne + '<br>'
        this.listeCorrections[indexQuestion] = (Question.correction)
        this.listeCanEnonces[indexQuestion] = (Question.canEnonce)
        this.listeCanReponsesACompleter[indexQuestion] = (Question.canReponseACompleter)
        const formatChampTexte = Question.formatChampTexte ?? ''
        const optionsChampTexte = Question.optionsChampTexte ?? {}
        if (Question.formatInteractif === 'fillInTheBlank' || (typeof Question.reponse === 'object' && 'champ1' in Question.reponse)) {
          this.listeQuestions[indexQuestion] = consigne + remplisLesBlancs(this, indexQuestion, Question.question, 'fillInTheBlank', '\\ldots')
          if (typeof Question.reponse === 'string') {
            handleAnswers(this, indexQuestion, {
              champ1: {
                value: Question.reponse,
                compare: Question.compare ?? expressionDeveloppeeEtReduiteCompare
              }
            }, { formatInteractif: 'mathlive' })
          } else if (typeof Question.reponse === 'object') {
            handleAnswers(this, indexQuestion, Question.reponse, { formatInteractif: 'mathlive' })
          } else {
            window.notify('Erreur avec cette question de type fillInTheBlank qui contient une reponse au format inconnu', { reponse: Question.reponse })
          }
        } else if (Question.formatInteractif === 'qcm') {
          Question.question.replaceAll('labelEx0Q0', `labelEx0Q${indexQuestion}`)
          Question.question.replaceAll('resultatCheckEx0', `resultatCheckEx${indexQuestion}`)
          this.listeQuestions[indexQuestion] = consigne + Question.question
          this.autoCorrection[indexQuestion] = Question.autoCorrection[0]
        } else {
          if (Question.compare == null) {
            setReponse(this, indexQuestion, Question.reponse, { formatInteractif: Question.formatInteractif ?? 'calcul' })
          } else {
            const compare = Question.compare
            if (typeof Question.reponse === 'string' || typeof Question.reponse === 'number') {
              const reponse = String(Question.reponse)
              handleAnswers(this, indexQuestion, {
                reponse: {
                  value: reponse,
                  compare
                }
              }, { formatInteractif: 'mathlive' })
            } else if (typeof Question.reponse === 'object') {
              const reponse = Question.reponse
              if (reponse instanceof FractionEtendue) {
                handleAnswers(this, indexQuestion, {
                  reponse: {
                    value: reponse.texFraction,
                    compare
                  }
                }, { formatInteractif: 'mathlive' })
              } else if (reponse instanceof Decimal) {
                handleAnswers(this, indexQuestion, {
                  reponse: {
                    value: reponse.toString(),
                    compare
                  }
                }, { formatInteractif: 'mathlive' })
              } else if (reponse instanceof Grandeur) {
                handleAnswers(this, indexQuestion, { reponse: { value: reponse, compare } }, { formatInteractif: 'mathlive' })
              } else {
                handleAnswers(this, indexQuestion, reponse, { formatInteractif: 'mathlive' })
              }
            } else {
              window.notify('Erreur avec cette question qui contient une reponse au format inconnu', { reponse: Question.reponse })
            }
          }
          this.listeQuestions[indexQuestion] = consigne + Question.question + ajouteChampTexteMathLive(this, indexQuestion, formatChampTexte, optionsChampTexte) + ajouteFeedback(this, indexQuestion)
        }
      } else {
        //* ***************** Question Exo classique *****************//
        this.listeQuestions[indexQuestion] = Question.listeQuestions[0]
        if (!this.listeQuestions[indexQuestion].includes('feedback')) {
          this.listeQuestions[indexQuestion] = this.listeQuestions[indexQuestion] + ajouteFeedback(this, indexQuestion)
        }
        this.listeCorrections[indexQuestion] = (Question.listeCorrections[0])
        this.autoCorrection[indexQuestion] = Question.autoCorrection[0]
        this.listeQuestions[indexQuestion] = this.listeQuestions[indexQuestion].replaceAll('champTexteEx0Q0', `champTexteEx0Q${indexQuestion}`)
        this.listeQuestions[indexQuestion] = this.listeQuestions[indexQuestion].replaceAll('resultatCheckEx0Q0', `resultatCheckEx0Q${indexQuestion}`)

        // fin d'alimentation des listes de question et de correction pour cette question
        // this.formatChampTexte = Question.formatChampTexte
        // this.formatInteractif = Question.formatInteractif
        const formatInteractif = Question.autoCorrection[0].reponse.param.formatInteractif
        const compare = Question.autoCorrection[0].reponse.valeur.compare ?? expressionDeveloppeeEtReduiteCompare
        if (formatInteractif === 'qcm') {
          this.autoCorrection[indexQuestion] = Question.autoCorrection[0]
        } else {
          handleAnswers(this, indexQuestion, Question.autoCorrection[0].reponse.valeur, { formatInteractif: 'mathlive' })
        }
      }

      if (Question?.autoCorrection[0]?.propositions != null) {
        // qcm
        const monQcm = propositionsQcm(this, indexQuestion) // update les références HTML
        this.listeCanReponsesACompleter[indexQuestion] = monQcm.texte
        const consigne = (this.consigne === null || this.consigne === '') ? '' : this.consigne + '<br>'
        const objetReponse = this.autoCorrection[indexQuestion]
        const enonce = 'enonce' in objetReponse ? objetReponse.enonce : ''
        this.listeQuestions[indexQuestion] = consigne + enonce + monQcm.texte
        this.listeCorrections[indexQuestion] = monQcm.texteCorr
      }
      indexQuestion++
    }
  }
}
