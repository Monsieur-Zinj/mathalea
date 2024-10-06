import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
// export const dateDeModificationImportante = '29/12/2034'

/**
 * Problème à résoudre en utilisant les nombres relatifs
 * La dernière question est ouverte (et difficile pour prouver que l'on a trouvé toutes les solutions)
 * Auteur : Matthieu DEVILLERS matthieu.devillers@ac-rennes.fr
*/
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js' // fonction qui va préparer l'analyse de la saisie
import { ajouteChampTexte, ajouteChampTexteMathLive, remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { createList } from '../../lib/format/lists'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Résoudre un problème avec les relatifs'
export const dateDePublication = '05/10/2024' // fonctions de mise en place des éléments interactifs

export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = 'a33b9'
export const refs = {
  'fr-fr': ['4C11-1'],
  'fr-ch': []
}

export default class resoudreProblemeRelatifs extends Exercice {
  constructor () {
    super()

    this.nbQuestions = 1
  }

  nouvelleVersion () {
    this.consigne = ''
    // const typeQuestionsDisponibles = ['type1', 'type2', 'type3']
    // const listeTypeQuestions = combinaisonListesSansChangerOrdre(typeQuestionsDisponibles, this.nbQuestions)
    this.nbCols = 1 // Uniquement pour la sortie LaTeX
    this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
    // this.tailleDiaporama = 2 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
    this.spacing = 1.5 // Interligne des questions
    this.spacingCorr = 1.5// Interligne des réponses
    /*
    function solutionsScoreNul (nombQuestions, nombPoints) {
      let solutions: number[]
      for (let n = 0; n < nombQuestions; n++) {
        for (let m = 0; m < (nombQuestions - n); m++) {
          if ((n * nombPoints[0] - m * nombPoints[1] - (20 - n - m) * nombPoints[2]) === 0) {
            solutions.push(n)
            solutions.push(m)
            solutions.push(20 - n - m)
          }
        }
      }
      return solutions
    }
*/

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const nombreQuestions = choice([10, 20, 30])
      const nombresPoints = choice([[5, 3, 2], [7, 5, 3], [11, 7, 5]])
      const candidats = combinaisonListes(['Margaux', 'Celestin', 'Maxime', 'Georges', 'Clémentine', 'Éléonore', 'François', 'Martine'], 3)
      // const scoreNul = 'oui'

      let texte = `Dans un jeu télévisé, les candidats doivent répondre à ${nombreQuestions} questions.<br>
      Pour chaque bonne réponse, ils marquent ${nombresPoints[0]} points.<br>
      Pour chaque mauvaise réponse, ils perdent ${nombresPoints[1]} points.<br>
      Enfin pour une absence de réponse, ils perdent ${nombresPoints[2]} points.<br><br>`

      let texteCorr = ''
      texte += 'a) Quel est le score maximal à ce jeu ? '
      texte += ajouteChampTexteMathLive(this, 8 * i, 'inline largeur01 college6eme')
      handleAnswers(this, 8 * i, { reponse: { value: String(nombreQuestions * nombresPoints[0]) } })
      texteCorr = `<br> a) On obtient le score maximal en répondant 
          correctement aux ${nombreQuestions} questions <br> et en marquant ${nombresPoints[0]} points
          à chaque fois. <br>
          Donc : <br>
          $\\text{Score maximal} = ${nombreQuestions} \\times ${nombresPoints[0]}$<br>
          $\\phantom{\\text{Score maximal}} = ${nombreQuestions * nombresPoints[0]}$`
      texte += '<br> b) Quel est le score minimal à ce jeu ? '
      texte += ajouteChampTexteMathLive(this, 8 * i + 1, 'inline largeur01 college6eme')
      handleAnswers(this, 8 * i + 1, { reponse: { value: String(-nombreQuestions * nombresPoints[1]) } })
      texteCorr += `<br> b) On obtient le score minimal en répondant 
          faux aux ${nombreQuestions} questions <br> et en marquant ${ecritureParentheseSiNegatif(-nombresPoints[1])} points
          à chaque fois. <br>
          Donc : <br>
          $\\text{Score minimal} = ${nombreQuestions} \\times ${ecritureParentheseSiNegatif(-nombresPoints[1])}$<br>
          $\\phantom{\\text{Score minimal}} = ${-nombreQuestions * nombresPoints[1]}$`
      texte += `<br> c) ${candidats[0]} a répondu à toutes les questions 
           dont ${nombreQuestions * 0.6} correctement.<br>
           Quel est son score ? `
      texte += ajouteChampTexteMathLive(this, 8 * i + 2, 'inline largeur01 college6eme')
      handleAnswers(this, 8 * i + 2, { reponse: { value: String(nombreQuestions * 0.6 * nombresPoints[0] - nombreQuestions * 0.4 * nombresPoints[1]) } })
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
      texte += ajouteChampTexteMathLive(this, 8 * i + 3, 'inline largeur01 college6eme')
      handleAnswers(this, 8 * i + 3, { reponse: { value: String(nombreQuestions * 0.3 * nombresPoints[0] - nombreQuestions * 0.2 * nombresPoints[1] - nombreQuestions * 0.5 * nombresPoints[2]) } })
      texteCorr += `<br> d) ${candidats[1]} n'a répondu qu'à ${nombreQuestions * 0.5} questions et ${nombreQuestions * 0.2} sont fausses.<br>
        donc ${candidats[1]} a répondu correctement à ${nombreQuestions * 0.5} - ${nombreQuestions * 0.2} = ${nombreQuestions * 0.3} questions.<br>
         Son score est donc : <br>
         $\\text{Score}_\\text{ ${candidats[1]}} = ${nombreQuestions * 0.3} \\times  ${nombresPoints[0]} + ${nombreQuestions * 0.2} \\times ${ecritureParentheseSiNegatif(-nombresPoints[1])} +  ${nombreQuestions * 0.5} \\times ${ecritureParentheseSiNegatif(-nombresPoints[2])}$<br>
         $\\phantom{\\text{Score}_\\text{ ${candidats[1]}}} = ${nombreQuestions * 0.3 * nombresPoints[0]} + ${ecritureParentheseSiNegatif(-nombreQuestions * 0.2 * nombresPoints[1])} + ${ecritureParentheseSiNegatif(-nombreQuestions * 0.5 * nombresPoints[2])}$<br>
         $\\phantom{\\text{Score}_\\text{ ${candidats[1]}}} = ${nombreQuestions * 0.3 * nombresPoints[0] - nombreQuestions * 0.2 * nombresPoints[1] - nombreQuestions * 0.5 * nombresPoints[2]}$`

      texte += `<br> e) ${candidats[2]} a trouvé ${nombreQuestions * 0.7} mauvaises réponses, 
      et ${candidats[2]} n'a pas répondu aux autres questions.<br>
          Quel est son score ? `
      texte += ajouteChampTexteMathLive(this, 8 * i + 4, 'inline largeur01 college6eme')
      handleAnswers(this, 8 * i + 4, { reponse: { value: String(-nombreQuestions * 0.7 * nombresPoints[1] - nombreQuestions * 0.3 * nombresPoints[2]) } })
      texteCorr += `<br> e) ${candidats[2]} a ${nombreQuestions * 0.7} réponses fausses et n'a pas répondu à ${nombreQuestions * 0.3} questions.<br>
         Son score est donc : <br>
         $\\text{Score}_\\text{ ${candidats[2]}} = ${nombreQuestions * 0.7} \\times  ${ecritureParentheseSiNegatif(-nombresPoints[1])} + ${nombreQuestions * 0.3} \\times ${ecritureParentheseSiNegatif(-nombresPoints[2])}$<br>
         $\\phantom{\\text{Score}_\\text{ ${candidats[2]}}} = ${ecritureParentheseSiNegatif(-nombreQuestions * 0.7 * nombresPoints[1])} + ${ecritureParentheseSiNegatif(-nombreQuestions * 0.3 * nombresPoints[2])}$<br>
         $\\phantom{\\text{Score}_\\text{ ${candidats[2]}}} = ${-nombreQuestions * 0.7 * nombresPoints[1] - nombreQuestions * 0.3 * nombresPoints[2]}$`

      if (this.interactif) {
        // Question sans version interactive : il s'agit d'encourager la recherche d'une solution par essai/erreur, et le format interactif ne parait pas le plus adapté.
        // De plus techniquement, ce n'est suffisament simple pour moi.
        // Remi m'a suggéré de tenter quelque chose avec "Remplis les blancs" mais je préfère faire une MR en l'état : c'est utiisable.
      } else {
        texte += '<br> f) Est-il possible d\'obtenir une score nul à ce jeu ? Si oui, comment ?<br>'
        /*
        if (solutionsScoreNul(nombreQuestions, nombresPoints).length === 0) {
          texteCorr += '<br> Il n\'est pas possible d\'avoir un score nul dans ce jeu'
        } else {
          texteCorr += '<br> Il est possible d\'avoir un score nul dans ce jeu : '
        }
        **/
      }

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
