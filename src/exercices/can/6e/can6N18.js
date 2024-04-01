import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif.js'

export const titre = 'Encadrer à la dizaine, centaine'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '16/11/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 */
export const uuid = 'b9582'
export const refs = {
  'fr-fr': ['can6N18'],
  'fr-ch': []
}
export default function EncadrerDizaine () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = 'largeur15 inline'
  this.tailleDiaporama = 2
  this.listePackages = ['tkz-tab']
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let question1, correction1, N
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (choice([1, 2])) { // 1,1,2,3,4,5,6,7,8
        case 1 :
          {
            const um = randint(0, 1) * 1000
            const c = randint(0, 9) * 100
            const d = randint(1, 9) * 10
            const u = randint(1, 9)
            N = um + c + d + u

            question1 = `Encadrer $${texNombre(N)}$ entre deux dizaines consécutives.`

            if (this.interactif) {
              question1 += '<br>' + ajouteChampTexteMathLive(this, 2 * i, 'largeur01 inline') + `$< ${texNombre(N)} < $` + ajouteChampTexteMathLive(this, 2 * i + 1, 'inline largeur01 nospacebefore')
            }

            correction1 = `$${miseEnEvidence(`${texNombre(um + c + d)}`)} < ${texNombre(N)}< ${miseEnEvidence(`${texNombre(um + c + d + 10)}`)}$ `
            setReponse(this, 2 * i, um + c + d)
            setReponse(this, 2 * i + 1, um + c + d + 10)
            this.canEnonce = question1
            this.canReponseACompleter = `$\\ldots < ${texNombre(N)}< \\ldots$`
          }
          break

        case 2 :
          {
            const um = randint(0, 9) * 1000
            const c = randint(1, 9) * 100
            const d = randint(1, 9) * 10
            const u = randint(0, 9)
            N = um + c + d + u

            question1 = `Encadrer $${texNombre(N)}$ entre deux centaines consécutives.`

            if (this.interactif) {
              question1 += '<br>' + ajouteChampTexteMathLive(this, 2 * i, 'largeur01 inline') + `$< ${texNombre(N)} < $` + ajouteChampTexteMathLive(this, 2 * i + 1, 'inline largeur01 nospacebefore')
            }

            correction1 = `$${miseEnEvidence(`${texNombre(um + c)}`)} < ${texNombre(N)}< ${miseEnEvidence(`${texNombre(um + c + 100)}`)}$ `
            setReponse(this, 2 * i, um + c)
            setReponse(this, 2 * i + 1, um + c + 100)
            this.canEnonce = question1
            this.canReponseACompleter = `$\\ldots < ${texNombre(N)}< \\ldots$`
          }
          break
      }

      if (this.questionJamaisPosee(i, N)) {
        this.listeQuestions.push(question1)
        this.listeCorrections.push(correction1)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
