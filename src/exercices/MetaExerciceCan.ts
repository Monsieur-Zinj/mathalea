import { handleAnswers } from '../lib/interactif/gestionInteractif'
import Exercice from './Exercice'
import { ajouteChampTexteMathLive, remplisLesBlancs } from '../lib/interactif/questionMathLive'
import { propositionsQcm } from '../lib/interactif/qcm'

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
        this.listeCorrections[indexQuestion] = (Question.correction)
        this.listeCanEnonces[indexQuestion] = (Question.canEnonce)
        this.listeCanReponsesACompleter[indexQuestion] = (Question.canReponseACompleter)
        if (Question.formatInteractif === 'qcm') {
          this.autoCorrection[indexQuestion] = Question.autoCorrection[0]
        } else if (Question.formatInteractif === 'fillInTheBlank') {
          this.listeQuestions[indexQuestion] = remplisLesBlancs(this, indexQuestion, Question.question, 'fillInTheBlank', '\\ldots')
          handleAnswers(this, indexQuestion, Question.reponse, { formatInteractif: 'fillInTheBlank' })
        } else {
          this.listeQuestions[indexQuestion] = Question.question + ajouteChampTexteMathLive(this, indexQuestion, Question.formatChampTexte ?? '', Question.optionsChampTexte ?? {})
          if (Question.compare == null) {
            handleAnswers(this, indexQuestion, { reponse: { value: Question.reponse } }, { formatInteractif: Question.formatInteractif } || {})
          } else {
            handleAnswers(this, indexQuestion, {
              reponse: {
                value: Question.reponse,
                compare: Question.compare
              }
            }, { formatInteractif: Question.formatInteractif } || {})
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
          handleAnswers(this, indexQuestion, Question.listeQuestions[0].reponse, { formatInteractif: 'fillInTheBlank' })
        } else if (Question.formatInteractif === 'qcm') {
          this.autoCorrection[indexQuestion] = Question.autoCorrection[0]
        } else if (Question.compare == null) {
          handleAnswers(this, indexQuestion, { reponse: { value: Question.reponse } }, { formatInteractif: Question.formatInteractif })
        } else {
          handleAnswers(this, indexQuestion, {
            reponse: {
              value: Question.reponse,
              compare: Question.compare
            }
          }, { formatInteractif: 'calcul' })
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
        this.listeQuestions[indexQuestion] = this.autoCorrection[indexQuestion].enonce + monQcm.texte
        this.listeCorrections[indexQuestion] = monQcm.texteCorr
      }

      /* let texte = Question.question
      if (this.interactif) {
        if (this.formatInteractif === 'fillInTheBlank') {
          texte = remplisLesBlancs(this, indexQuestion, texte, 'fillInTheBlank', '\\ldots')
        } else {
          if (this.formatInteractif !== 'qcm') {
            texte += ajouteChampTexteMathLive(this, indexQuestion, Question.formatChampTexte ?? '', Question.optionsChampTexte || {})
          }
        }
      }
      */
      //  this.canEnonce = Question.canEnonce
      // this.canReponseACompleter = ''
      // this.listeCanEnonces.push(Question.canEnonce!)
      // this.listeCanReponsesACompleter.push(Question.canReponseACompleter!)
      // this.listeQuestions.push(texte!)
      // this.listeCorrections.push(Question.correction!)
      indexQuestion++
    }
  }
}
