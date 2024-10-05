import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { choice, combinaisonListes, combinaisonListesSansChangerOrdre } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiMoins, ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
// export const dateDeModificationImportante = '29/12/2034'

/**
 * Problème à résoudre en utilisant les nombres relatifs
 * La dernière question est ouverte (et difficile pour prouver que l'on a trouvé toutes les solutions)
 * Auteur : Matthieu DEVILLERS matthieu.devillers@ac-rennes.fr
*/
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js' // fonction qui va préparer l'analyse de la saisie
import { ajouteChampTexteMathLive, remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'

export const titre = 'Résoudre un problème avec les relatifs'
export const dateDePublication = '05/10/2024' // fonctions de mise en place des éléments interactifs

export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = 'a33b9'
export const refs = {
  'fr-fr': ['4C11-1'],
  'fr-ch': []
}

export default class nomExercice extends Exercice {
  constructor () {
    super()

    this.nbQuestions = 1
  }

  nouvelleVersion () {
    this.consigne = ''
    // const typeQuestionsDisponibles = ['type1', 'type2', 'type3']
    // const listeTypeQuestions = combinaisonListesSansChangerOrdre(typeQuestionsDisponibles, this.nbQuestions)

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const nombreQuestions = choice([10, 20, 30])
      const nombresPoints = choice([[5, 3, 2], [7, 5, 3], [11, 7, 5]])
      const candidats = combinaisonListes(['Pierre', 'Lucie', 'Julie', 'Antoine', 'Léila', 'Gurvan', 'Elisabeth', 'Enora', 'Quentin'], 3)

      let texte = `Dans un jeu télévisé, les candidats doivent répondre à ${nombreQuestions} questions.<br>
      Pour chaque bonne réponse, ils marquent ${nombresPoints[0]} points.<br>
      Pour chaque mauvaise réponse, ils perdent ${nombresPoints[1]} points.<br>
      Enfin pour une absence de réponse, ils perdent ${nombresPoints[2]} points.<br>`

      let texteCorr = ''
      texte += 'a) Quel est le score maximal à ce jeu ? '
      texte += ajouteChampTexteMathLive(this, 5 * i, 'inline largeur01 college6eme')
      handleAnswers(this, 5 * i, { reponse: { value: String(nombreQuestions * nombresPoints[0]) } })
      texteCorr = `<br> a) On obtient le score maximal en répondant 
          correctement aux ${nombreQuestions} questions <br> et en marquant ${nombresPoints[0]} points
          à chaque fois. <br>
          Donc : <br>
          $\\text{Score maximal} = ${nombreQuestions} \\times ${nombresPoints[0]}$<br>
          $\\phantom{\\text{Score maximal}} = ${nombreQuestions * nombresPoints[0]}$`
      texte += '<br> b) Quel est le score minimal à ce jeu ? '
      texte += ajouteChampTexteMathLive(this, 5 * i + 1, 'inline largeur01 college6eme')
      handleAnswers(this, 5 * i + 1, { reponse: { value: String(-nombreQuestions * nombresPoints[1]) } })
      texteCorr += `<br> b) On obtient le score minimal en répondant 
          faux aux ${nombreQuestions} questions <br> et en marquant ${ecritureParentheseSiNegatif(-nombresPoints[1])} points
          à chaque fois. <br>
          Donc : <br>
          $\\text{Score minimal} = ${nombreQuestions} \\times ${ecritureParentheseSiNegatif(-nombresPoints[1])}$<br>
          $\\phantom{\\text{Score minimal}} = ${-nombreQuestions * nombresPoints[1]}$`
      texte += `<br> c) ${candidats[0]} a répondu à toutes les questions 
           dont ${nombreQuestions * 0.6} correctement.<br>
           Quel est son score ? `
      texte += ajouteChampTexteMathLive(this, 5 * i + 2, 'inline largeur01 college6eme')
      handleAnswers(this, 5 * i + 2, { reponse: { value: String(nombreQuestions * 0.6 * nombresPoints[0] - nombreQuestions * 0.4 * nombresPoints[1]) } })
      texteCorr += `<br> c) ${candidats[0]} a répondu à ${nombreQuestions} questions en tout,
          dont ${nombreQuestions * 0.6} correctement, <br> donc ${candidats[0]} a répondu faux à 
          ${nombreQuestions} - ${nombreQuestions * 0.6} = ${nombreQuestions * 0.4} questions.<br>
          Son score est donc : <br>
          $\\text{Score}_\\text{ ${candidats[0]}} = ${nombreQuestions * 0.6} \\times  ${nombresPoints[0]} + ${nombreQuestions * 0.4} \\times ${ecritureParentheseSiNegatif(-nombresPoints[1])}$<br>
          $\\phantom{\\text{Score}_\\text{ ${candidats[0]}}} = ${nombreQuestions * 0.6 * nombresPoints[0]} + ${ecritureParentheseSiNegatif(-nombreQuestions * 0.4 * nombresPoints[1])}$<br>
          $\\phantom{\\text{Score}_\\text{ ${candidats[0]}}} = ${nombreQuestions * 0.6 * nombresPoints[0] - nombreQuestions * 0.4 * nombresPoints[1]}$`
      texte += `<br> d) ${candidats[1]} n'a répondu qu'à ${nombreQuestions * 0.5} questions et ${nombreQuestions * 0.2}
      de ses réponses sont fausses.<br>
          Quel est son score ? `
      texte += ajouteChampTexteMathLive(this, 5 * i + 3, 'inline largeur01 college6eme')
      handleAnswers(this, 5 * i + 3, { reponse: { value: String(nombreQuestions * 0.3 * nombresPoints[0] - nombreQuestions * 0.2 * nombresPoints[1] - nombreQuestions * 0.5 * nombresPoints[2]) } })
      texteCorr += `<br> d) ${candidats[1]} n'a répondu qu'à ${nombreQuestions * 0.5} questions et ${nombreQuestions * 0.2} sont fausses.<br>
        donc ${candidats[1]} a répondu correctement à ${nombreQuestions * 0.5} - ${nombreQuestions * 0.2} = ${nombreQuestions * 0.3} questions.<br>
         Son score est donc : <br>
         $\\text{Score}_\\text{ ${candidats[1]}} = ${nombreQuestions * 0.3} \\times  ${nombresPoints[0]} + ${nombreQuestions * 0.2} \\times ${ecritureParentheseSiNegatif(-nombresPoints[1])} +  ${nombreQuestions * 0.5} \\times ${ecritureParentheseSiNegatif(-nombresPoints[2])}$<br>
         $\\phantom{\\text{Score}_\\text{ ${candidats[1]}}} = ${nombreQuestions * 0.3 * nombresPoints[0]} + ${ecritureParentheseSiNegatif(-nombreQuestions * 0.2 * nombresPoints[1])} + ${ecritureParentheseSiNegatif(-nombreQuestions * 0.5 * nombresPoints[2])}$<br>
         $\\phantom{\\text{Score}_\\text{ ${candidats[1]}}} = ${nombreQuestions * 0.3 * nombresPoints[0] - nombreQuestions * 0.2 * nombresPoints[1] - nombreQuestions * 0.5 * nombresPoints[2]}$`

      texte += `<br> e) ${candidats[2]} a trouvé ${nombreQuestions * 0.7} mauvaises réponses, 
      et il n'a pas répondu aux autres questions.<br>
          Quel est son score ? `
      texte += ajouteChampTexteMathLive(this, 5 * i + 4, 'inline largeur01 college6eme')
      handleAnswers(this, 5 * i + 4, { reponse: { value: String(-nombreQuestions * 0.7 * nombresPoints[1] - nombreQuestions * 0.3 * nombresPoints[2]) } })
      texteCorr += `<br> e) ${candidats[2]} n'a répondu qu'à ${nombreQuestions * 0.5} questions et ${nombreQuestions * 0.2} sont fausses.<br>
        donc ${candidats[2]} a répondu correctement à ${nombreQuestions * 0.5} - ${nombreQuestions * 0.2} = ${nombreQuestions * 0.3} questions.<br>
         Son score est donc : <br>
         $\\text{Score}_\\text{ ${candidats[2]}} = ${nombreQuestions * 0.3} \\times  ${nombresPoints[0]} + ${nombreQuestions * 0.2} \\times ${ecritureParentheseSiNegatif(-nombresPoints[1])} +  ${nombreQuestions * 0.5} \\times ${ecritureParentheseSiNegatif(-nombresPoints[2])}$<br>
         $\\phantom{\\text{Score}_\\text{ ${candidats[2]}}} = ${nombreQuestions * 0.3 * nombresPoints[0]} + ${ecritureParentheseSiNegatif(-nombreQuestions * 0.2 * nombresPoints[1])} + ${ecritureParentheseSiNegatif(-nombreQuestions * 0.5 * nombresPoints[2])}$<br>
         $\\phantom{\\text{Score}_\\text{ ${candidats[2]}}} = ${nombreQuestions * 0.3 * nombresPoints[0] - nombreQuestions * 0.2 * nombresPoints[1] - nombreQuestions * 0.5 * nombresPoints[2]}$`

      if (this.questionJamaisPosee(i, nombreQuestions, nombresPoints.join(''))) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
  }

  listeQuestionsToContenu(this)
}
