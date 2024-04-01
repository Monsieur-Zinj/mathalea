import { handleAnswers } from '../lib/interactif/gestionInteractif'
import Exercice from './Exercice'
import { ajouteChampTexteMathLive, remplisLesBlancs } from '../lib/interactif/questionMathLive'
import { propositionsQcm } from '../lib/interactif/qcm'
import { numberCompare } from '../lib/interactif/comparisonFunctions'

export const interactifType = 'qcm_mathLive'
export const interactifReady = true

export default class MetaExercice extends Exercice {
  Exercices: Exercice[]
  constructor (Exercices: Exercice[]) {
    super()
    this.Exercices = Exercices
    this.besoinFormulaireCaseACocher = ['Sujet officiel']
    this.nbQuestions = 30
    this.nbQuestionsModifiable = false
    this.sup = true
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
        const consigne = Question.consigne == null ? '' : Question.consigne + '<br>'
        this.listeCorrections[indexQuestion] = (Question.correction)
        this.listeCanEnonces[indexQuestion] = (Question.canEnonce)
        this.listeCanReponsesACompleter[indexQuestion] = (Question.canReponseACompleter)
        if (Question.formatInteractif === 'qcm') {
          this.autoCorrection[indexQuestion] = Question.autoCorrection[0]
        } else if (Question.formatInteractif === 'fillInTheBlank') {
          this.listeQuestions[indexQuestion] = consigne + remplisLesBlancs(this, indexQuestion, Question.question, 'fillInTheBlank', '\\ldots')
          if (Question.compare === null || Question.compare === undefined) {
            if (typeof Question.reponse === 'string') {
              handleAnswers(this, indexQuestion, { champ1: { value: Question.reponse, compare: numberCompare } }, { formatInteractif: 'mathlive' })
            } else if (typeof Question.reponse === 'object') {
              handleAnswers(this, indexQuestion, Question.reponse, { formatInteractif: 'mathlive' })
            } else {
              window.notify('Erreur avec cette question de type fillInTheBlank qui contient une reponse au format inconnu', { reponse: Question.reponse })
            }
          } else {
            const compare = Question.compare
            if (typeof Question.reponse === 'string') {
              handleAnswers(this, indexQuestion, { champ1: { value: Question.reponse, compare } }, { formatInteractif: 'mathlive' })
            } else if (typeof Question.reponse === 'object') {
              handleAnswers(this, indexQuestion, Question.reponse, { formatInteractif: 'mathlive' })
            } else {
              window.notify('Erreur avec cette question de type fillInTheBlank qui contient une reponse au format inconnu', { reponse: Question.reponse })
            }
          }
        } else {
          this.listeQuestions[indexQuestion] = consigne + Question.question + ajouteChampTexteMathLive(this, indexQuestion, Question.formatChampTexte ?? '', Question.optionsChampTexte ?? {})
          if (Question.compare === null || Question.compare === undefined) {
            handleAnswers(this, indexQuestion, { reponse: { value: Question.reponse } }, { formatInteractif: Question.formatInteractif } || {})
          } else {
            handleAnswers(this, indexQuestion, { reponse: { value: Question.reponse, compare: Question.compare } }, { formatInteractif: Question.formatInteractif } || {})
          }
        }
      } else {
        //* ***************** Question Exo classique *****************//
        this.listeQuestions[indexQuestion] = (Question.listeQuestions[0])
        this.listeCorrections[indexQuestion] = (Question.listeCorrections[0])
        this.listeCanEnonces[indexQuestion] = (Question.listeCanEnonces[0])
        this.listeCanReponsesACompleter[indexQuestion] = (Question.listeCanReponsesACompleter[0])
        this.autoCorrection[indexQuestion] = Question.autoCorrection[0]
        // fin d'alimentation des listes de question et de correction pour cette question
        // this.formatChampTexte = Question.formatChampTexte
        // this.formatInteractif = Question.formatInteractif
        if (Question.formatInteractif === 'fillInTheBlank') {
          handleAnswers(this, indexQuestion, Question.listeQuestions[0].reponse.valeur, { formatInteractif: 'mathlive' })
        } else if (Question.formatInteractif === 'qcm') {
          this.autoCorrection[indexQuestion] = Question.autoCorrection[0]
        } else if (Question.compare == null) {
          handleAnswers(this, indexQuestion, { reponse: { value: Question.reponse, compare: numberCompare } }, { formatInteractif: 'mathlive' })
        } else {
          handleAnswers(this, indexQuestion, {
            reponse: {
              value: Question.reponse,
              compare: Question.compare
            }
          }, { formatInteractif: 'mathlive' })
        }
      }

      if (Question?.autoCorrection[0]?.propositions === undefined) {
        // mathlive
        // update les références HTML
        this.listeQuestions[indexQuestion] = this.listeQuestions[indexQuestion].replaceAll(`champTexteEx${this.numeroExercice}Q${0}`, `champTexteEx${this.numeroExercice}Q${indexQuestion}`)
        this.listeQuestions[indexQuestion] = this.listeQuestions[indexQuestion].replaceAll(`resultatCheckEx${this.numeroExercice}Q${0}`, `resultatCheckEx${this.numeroExercice}Q${indexQuestion}`)
      } else {
        // qcm
        const monQcm = propositionsQcm(this, indexQuestion) // update les références HTML
        this.listeCanReponsesACompleter[indexQuestion] = monQcm.texte
        const consigne = this.consigne == null ? '' : this.consigne + '<br>'
        const objetReponse = this.autoCorrection[indexQuestion]
        const enonce = 'enonce' in objetReponse ? objetReponse.enonce : ''
        this.listeQuestions[indexQuestion] = consigne + enonce + monQcm.texte
        this.listeCorrections[indexQuestion] = monQcm.texteCorr
      }
      indexQuestion++
    }
  }
}
