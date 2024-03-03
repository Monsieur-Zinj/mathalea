import { handleAnswers, setReponse } from '../lib/interactif/gestionInteractif'
import Exercice from './Exercice'
import { ajouteChampTexteMathLive, remplisLesBlancs } from '../lib/interactif/questionMathLive'

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
      Question.canOfficielle = !!this.sup
      Question.interactif = this.interactif
      Question.nouvelleVersion()
      this.formatChampTexte = Question.formatChampTexte
      this.formatInteractif = Question.formatInteractif
      if (Question.compare == null) {
        setReponse(this, indexQuestion, Question.reponse, { formatInteractif: Question.formatInteractif })
      } else {
        if (this.formatInteractif === 'fillInTheBlank') {
          handleAnswers(this, indexQuestion, { champ1: { value: Question.reponse, compare: Question.compare } }, { formatInteractif: 'fillInTheBlank' })
        } else {
          handleAnswers(this, indexQuestion, { reponse: { value: Question.reponse, compare: Question.compare } }, { formatInteractif: 'calcul' })
        }
      }
      let texte = Question.question
      if (this.interactif) {
        if (this.formatInteractif === 'fillInTheBlank') {
          texte = remplisLesBlancs(this, indexQuestion, texte, 'fillInTheBlank', '\\ldots')
        } else {
          texte += ajouteChampTexteMathLive(this, indexQuestion, Question.formatChampTexte ?? '', Question.optionsChampTexte || {})
        }
      }
      this.canEnonce = Question.canEnonce
      this.canReponseACompleter = ''
      this.listeCanEnonces.push(Question.canEnonce!)
      this.listeCanReponsesACompleter.push(Question.canReponseACompleter!)
      this.listeQuestions.push(texte!)
      this.listeCorrections.push(Question.correction!)
      indexQuestion++
    }
  }
}
