import Exercice from '../Exercice'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'

export const titre = 'Titre de l\'exercice'
export const dateDePublication = '14/12/2023'
// export const dateDeModifImportante = '24/10/2021'

/**
 * Description didactique de l'exercice
 * @author
*/

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = 'Consigne'
    this.nbQuestions = 10
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

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
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
