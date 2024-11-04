import Exercice from '../Exercice'
import { randint, listeQuestionsToContenu } from '../../modules/outils'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer la valeur d\'une expression littérale'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '4/5/2024'

/**
 * Description didactique de l'exercice
 * @author
 * Référence
*/
export const uuid = 'c4388'
export const ref = '2N40-7'
export const refs = {
  'fr-fr': ['2N40-7'],
  'fr-ch': []
}

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = 'Calcule'
    this.nbQuestions = 10

    this.besoinFormulaireNumerique = ['Difficulté', 3, '1 : Facile\n2 : Moyen\n3 : Difficile'] // le paramètre sera numérique de valeur max 3 (le 3 en vert)
    this.sup = 2 // Valeur du paramètre par défaut
    // Remarques : le paramètre peut aussi être un texte avec : this.besoinFormulaireTexte = [texte, tooltip]
    //              il peut aussi être une case à cocher avec : this.besoinFormulaireCaseACocher = [texte] (dans ce cas, this.sup = true ou this.sup = false)
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const a = randint(1, 12) // Comme la valeur ne sera pas modifiée, on la déclare avec const
      let NombreAAjouter // Comme la valeur sera modifiée, on la déclare avec let
      if (this.sup === 1) {
        NombreAAjouter = 2
      } else if (this.sup === 2) {
        NombreAAjouter = 5
      } else {
        NombreAAjouter = 100
      }
      texte = `$${a} + ${NombreAAjouter} $`
      texte = `$${texte}$`
      texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierEnsemble, { texteAvant: '=' }) + '<br>'
      texteCorr = `$${a} + ${NombreAAjouter} = ${a + NombreAAjouter}$`
      handleAnswers(this, i, { reponse: { value: a + NombreAAjouter, compare: fonctionComparaison } })

      // Si la question n'a jamais été posée, on l'enregistre
      if (this.questionJamaisPosee(i, a, NombreAAjouter)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
