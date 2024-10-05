import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { choice, combinaisonListes, combinaisonListesSansChangerOrdre } from '../../lib/outils/arrayOutils'

export const titre = 'Utiliser les nombres relatifs pour calculer un score.'
export const dateDePublication = '05/10/2024'
// export const dateDeModificationImportante = '29/12/2034'

/**
 * Description didactique de l'exercice
 * Auteur : Matthieu DEVILLERS matthieu.devillers@ac-rennes.fr
*/
export const uuid = 'a33b9'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

export default class nomExercice extends Exercice {
  constructor () {
    super()

    this.nbQuestions = 10
  }

  nouvelleVersion () {
    const nombreQuestions = choice([10, 20, 30])
    const nombresPoints = choice([[5, 3, 2], [7, 5, 3], [11, 7, 5]])
    const candidats = combinaisonListes(['Pierre', 'Lucie', 'Julie', 'Antoine', 'Léila', 'Gurvan', 'Elisabeth', 'Enora', 'Quentin'], 3)
    this.consigne = `Dans un jeu télévisé, les candidats doivent répondre à ${nombreQuestions} questions. <br>
    Pour chaque bonne réponse, ils marquent ${nombresPoints[0]} points. Pour chaque mauvaise réponse,
     ils perdent ${nombresPoints[1]} points. Enfin pour une absence de réponse ils perdent ${nombresPoints[2]} points.`
    const typeQuestionsDisponibles = ['type1', 'type2', 'type3']

    const listeTypeQuestions = combinaisonListesSansChangerOrdre(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      switch (listeTypeQuestions[i]) {
        case 'type1':
          texte = 'Quel est le score maximal à ce jeu ?'
          texteCorr = `On obtient le score maximal en répondant 
          correctement aux ${nombreQuestions} questions et en marquant ${nombresPoints[0]} points
          à chaque fois. <br>
          Donc : <br>
          $\\text{Score maximal} = ${nombreQuestions} \\times ${nombresPoints[0]}$<br>
          $\\phantom{\\text{Score maximal}} = ${nombreQuestions * nombresPoints[0]}$
          `
          break
        case 'type2':
          texte = 'Quel est le score minimal à ce jeu ?'
          texteCorr = `On obtient le score minimal en répondant 
          faux aux ${nombreQuestions} questions et en marquant ${-nombresPoints[1]} points
          à chaque fois. <br>
          Donc : <br>
          $\\text{Score maximal} = ${nombreQuestions} \\times ${-nombresPoints[1]}$<br>
          $\\phantom{\\text{Score maximal}} = ${-nombreQuestions * nombresPoints[1]}$
        
          `
          break
        case 'type3':
          texte = `${candidats[0]} et ${candidats[1]} et ${candidats[2]} et`
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
