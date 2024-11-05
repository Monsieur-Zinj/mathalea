import Exercice from '../Exercice'
import { randint, listeQuestionsToContenu, gestionnaireFormulaireTexte } from '../../modules/outils'
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

    // this.besoinFormulaireTexte= ['Difficulté', 3, '1 : Facile\n2 : Moyen\n3 : Difficile'] // le paramètre sera numérique de valeur max 3 (le 3 en vert)
    this.besoinFormulaireTexte = ['Niveau de difficulté', 'Nombres séparés par des tirets\n1: k(ax+b)\n2: (ax+b)×k\n3: kx(ax+b)\n4: (ax+b)×kx\n5: k(ax+b)+c\n6: c+k(ax+b)\n7: Mélange']
    this.besoinFormulaire2Texte = ['Type de nombres', 'Nombres séparés par des tirets\n1: positifs\n2: négatifs\n3: Mélange']
    this.sup = 2 // Valeur du paramètre par défaut
    this.sup2 = 3 // Valeur du paramètre par défaut
    // Remarques : le paramètre peut aussi être un texte avec : this.besoinFormulaireTexte = [texte, tooltip]
    //              il peut aussi être une case à cocher avec : this.besoinFormulaireCaseACocher = [texte] (dans ce cas, this.sup = true ou this.sup = false)
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const difficulteQuestion = [1, 2, 3]
    const typeDeNombres = [1, 2]

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 3,
      defaut: 2,
      listeOfCase: difficulteQuestion,
      nbQuestions: this.nbQuestions,
      melange: 4
    })

    const listeTypeDeNombres = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: 2,
      defaut: 3,
      listeOfCase: typeDeNombres,
      nbQuestions: this.nbQuestions,
      melange: 3
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const a = randint(1, 12) // Comme la valeur ne sera pas modifiée, on la déclare avec const
      let signe = '+'
      switch (listeTypeDeNombres[i]) {
        case 1:
          signe = '+'
          break
        case 2:
          signe = '-'
          break
      }
      let NombreAAjouter // Comme la valeur sera modifiée, on la déclare avec let
      switch (listeTypeDeQuestions[i]) {
        //
        case 1:
          NombreAAjouter = 2
          break
        case 2:
          NombreAAjouter = 5
          break
        case 3:
          NombreAAjouter = 100
          break
      }
      // texte = `$${a} + ${NombreAAjouter} $`
      texte = `$${a} ${signe} ${NombreAAjouter} $`
      texte = `$${texte}$`
      texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierEnsemble, { texteAvant: '=' }) + '<br>'
      // texteCorr = `$${a} + ${NombreAAjouter} = ${a + NombreAAjouter}$`
      texteCorr = signe === '+'
        ? `$${a} + ${NombreAAjouter} = ${a + NombreAAjouter}$`
        : `$${a} - ${NombreAAjouter} = ${a - NombreAAjouter}$`
      const reponseValue = signe === '+' ? a + NombreAAjouter : a - NombreAAjouter
      handleAnswers(this, i, { reponse: { value: reponseValue, compare: fonctionComparaison } })
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
