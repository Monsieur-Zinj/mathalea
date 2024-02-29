import { handleAnswers, setReponse } from '../lib/interactif/gestionInteractif'
import Exercice from './Exercice'
import { ajouteChampTexteMathLive } from '../lib/interactif/questionMathLive'

export default class MetaExercice extends Exercice {
  questions: Exercice[]
  constructor (questions: Exercice[]) {
    super()
    this.questions = questions
  }

  nouvelleVersion (): void {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []

    let indexQuestion = 0
    for (const Question of this.questions) {
      // @ts-expect-error : question is an Exercice
      const Q = new Question()
      Q.canOfficielle = this.sup
      Q.interactif = this.interactif
      Q.nouvelleVersion()
      this.formatChampTexte = Q.formatChampTexte
      this.formatInteractif = Q.formatInteractif
      if (Q.compare == null) {
        setReponse(this, indexQuestion, Q.reponse, { formatInteractif: Q.formatInteractif })
      } else {
        handleAnswers(this, indexQuestion, { reponse: { value: Q.reponse, compare: Q.compare } }, { formatInteractif: 'calcul' })
      }
      let texte = Q.question
      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, indexQuestion, Q.formatChampTexte || '', Q.optionsChampTexte || {})
      }
      this.canEnonce = Q.canEnonce
      this.canReponseACompleter = ''
      this.listeCanEnonces.push(Q.canEnonce!)
      this.listeCanReponsesACompleter.push(Q.canReponseACompleter!)
      this.listeQuestions.push(texte!)
      this.listeCorrections.push(Q.correction!)
      indexQuestion++
    }
  }
}
