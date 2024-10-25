import { handleAnswers, setReponse } from '../lib/interactif/gestionInteractif'
import Exercice from './Exercice'
import { ajouteChampTexteMathLive, ajouteFeedback, remplisLesBlancs } from '../lib/interactif/questionMathLive'
import { propositionsQcm } from '../lib/interactif/qcm'
import { fonctionComparaison } from '../lib/interactif/comparisonFunctions'
import Grandeur from '../modules/Grandeur'
import Decimal from 'decimal.js'
import FractionEtendue from '../modules/FractionEtendue'
import { gestionnaireFormulaireTexte, randint } from '../modules/outils'
import { combinaisonListes, shuffle } from '../lib/outils/arrayOutils'
import { range1 } from '../lib/outils/nombres'

export const interactifType = 'mathLive'
export const interactifReady = true

export default class MetaExercice extends Exercice {
  Exercices: Exercice[]
  constructor (ExercicesCAN: Exercice[]) {
    super()
    this.Exercices = ExercicesCAN
    this.besoinFormulaireCaseACocher = ['Sujet officiel']
    this.nbQuestions = 30
    this.sup = false
    this.sup2 = Array.from({ length: 30 }, (_, i) => i + 1).join('-') // Toutes les questions de 1 à 30.
    this.sup3 = false
  }

  nouvelleVersion (): void {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    this.nbQuestionsModifiable = this.sup3
    this.besoinFormulaire2Texte = false
    let listeTypeDeQuestions : (string|number)[]
    let listeDeQuestions = this.sup2
    let ExercicesRef = this.Exercices
    if (this.sup3) {
      this.sup2 = false
    } else {
      this.nbQuestions = 30
      listeDeQuestions = this.sup2
      ExercicesRef = this.Exercices
    }
    console.log('titi', this.sup2)
    if (this.sup2) {
      console.log('toto' + randint(1, 245))
      listeTypeDeQuestions = gestionnaireFormulaireTexte({
        saisie: listeDeQuestions,
        min: 1,
        max: 30,
        defaut: 1,
        melange: 31,
        nbQuestions: 30
      })
    } else {
      listeTypeDeQuestions = range1(30)
      ExercicesRef = this.Exercices

      const base = Math.floor(this.nbQuestions / 3)
      const reste = this.nbQuestions % 3
      let repartition = [base, base, base]
      for (let i = 0; i < reste; i++) {
        repartition[i]++
      }
      repartition = combinaisonListes(repartition, 3)

      let exercices1 = ExercicesRef.slice(0, 10)
      exercices1 = shuffle(exercices1)
      exercices1 = exercices1.slice(0, repartition[0])

      let exercices2 = ExercicesRef.slice(10, 20)
      exercices2 = shuffle(exercices2)
      exercices2 = exercices2.slice(0, repartition[1])

      let exercices3 = ExercicesRef.slice(20, 30)
      exercices3 = shuffle(exercices3)
      exercices3 = exercices3.slice(0, repartition[2])

      ExercicesRef = [...exercices1, ...exercices2, ...exercices3]
    }

    let indexQuestion = 0
    let numExo = 1
    for (const Exercice of ExercicesRef) {
      if (listeTypeDeQuestions.includes(numExo)) { // Permet de ne choisir que certaines questions
      // @ts-expect-error : question is an Exercice
        const Question = new Exercice()
        // Question.numeroExercice = this.numeroExercice
        Question.numeroExercice = 0
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
                  compare: Question.compare ?? fonctionComparaison
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
              if (Question.reponse.reponse instanceof Object && Question.reponse.reponse.value != null && typeof Question.reponse.reponse.value === 'string') handleAnswers(this, indexQuestion, Question.reponse)
              else setReponse(this, indexQuestion, Question.reponse, { formatInteractif: Question.formatInteractif ?? 'calcul' })
            } else {
              const compare = Question.compare
              const options = Question.optionsDeComparaison == null ? {} : Question.optionsDeComparaison

              if (typeof Question.reponse === 'string' || typeof Question.reponse === 'number') {
                const reponse = String(Question.reponse)
                handleAnswers(this, indexQuestion, {
                  reponse: {
                    value: reponse,
                    compare,
                    options
                  }
                }, { formatInteractif: 'mathlive' })
              } else if (typeof Question.reponse === 'object') {
                const reponse = Question.reponse
                if (reponse instanceof FractionEtendue) {
                  handleAnswers(this, indexQuestion, {
                    reponse: {
                      value: reponse.texFraction,
                      compare,
                      options
                    }
                  }, { formatInteractif: 'mathlive' })
                } else if (reponse instanceof Decimal) {
                  handleAnswers(this, indexQuestion, {
                    reponse: {
                      value: reponse.toString(),
                      compare,
                      options
                    }
                  }, { formatInteractif: 'mathlive' })
                } else if (reponse instanceof Grandeur) {
                  handleAnswers(this, indexQuestion, { reponse: { value: reponse, compare, options } }, { formatInteractif: 'mathlive' })
                } else {
                  handleAnswers(this, indexQuestion, reponse, { formatInteractif: 'mathlive' }) // EE : Pourquoi ce handleAnswers n'est pas au même format que les autres ?
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
      numExo++
    }
    this.besoinFormulaire2Texte = this.sup3
      ? false
      : [
          'Choix des questions',
          'Nombres séparés par des tirets'
        ]
    this.besoinFormulaire3CaseACocher = ['Choix du nombre de questions']
    this.comment = `Cet exercice fait partie des annales des Courses Aux Nombres.<br>
  Il est composé de 30 questions réparties de la façon suivante. 
  Les 10 premières questions, parfois communes à plusieurs niveaux, font appel à des questions élémentaires et les 20 suivantes (qui ne sont pas rangées dans un ordre de difficulté) sont un peu plus « coûteuses » cognitivement.<br>
  Par défaut, les questions sont rangées dans le même ordre que le sujet officiel avec des données aléatoires. Ainsi, en cliquant sur « Nouvelles données », on obtient une nouvelle Course Aux Nombres avec des données différentes.<br>
  Le choix des questions permet de choisir certaines questions parmi les 30. <br>
  En choisissant un nombre de questions inférieur à 30, on fabrique une « mini » Course Aux Nombres qui respecte la proportion de nombre de questions élémentaires par rapport aux autres.
  Par exemple, en choisissant 20 questions, la course aux nombres sera composée de 7 ou 8 questions élémentaires choisies aléatoirement dans les 10 premières questions du sujet officiel puis de 12 ou 13 autres questions choisies aléatoirement parmi les 20 autres questions du sujet officiel.`
  }
}
