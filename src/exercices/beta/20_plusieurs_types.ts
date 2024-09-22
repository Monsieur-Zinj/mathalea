import Exercice from '../Exercice.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
export const titre = 'Nom de l\'exercice'

export const dateDePublication = '4/5/2024'

/**
 * Description didactique de l'exercice
 * @author
 * Référence
*/
export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = 'Consigne'
    this.nbQuestions = 10
  }

  nouvelleVersion () {
    const typeQuestionsDisponibles = ['type1', 'type2', 'type3']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      switch (listeTypeQuestions[i]) {
        case 'type1':
          texte = `Question ${i + 1} de type 1`
          texteCorr = `Correction ${i + 1} de type 1`
          break
        case 'type2':
          texte = `Question ${i + 1} de type 2`
          texteCorr = `Correction ${i + 1} de type 2`
          break
        case 'type3':
          texte = `Question ${i + 1} de type 3`
          texteCorr = `Correction ${i + 1} de type 3`
          break
      }
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
