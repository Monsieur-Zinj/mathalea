import Exercice from '../Exercice'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js' // fonctions de mise en place des éléments interactifs
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Compléter avec les mots : issues, impossible, équiprobabilité, aléatoire, certain.'
export const uuid = '4703c'
export const dateDePublication = '29/7/2024' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const refs = {
  'fr-fr': ['4S20-1'],
  'fr-ch': []
}
/**
 * Description didactique de l'exercice
 * @author Mireille Gain
 * Référence 4S20-1
*/
export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 5 // Nombre de questions par défaut
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const typeQuestionsDisponibles = ['issues', 'imp', 'equiprob', 'alea', 'certain'] // On crée les 5 types de questions

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, rep, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // Boucle principale où i+1 correspond au numéro de la question
      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'issues':
          texte = 'Les résultats possibles d’une expérience aléatoire s’appellent les ...' // Le LateX entre deux symboles $, les variables dans des ${ }
          rep = 'issues'
          texteCorr = 'Les résultats possibles d’une expérience aléatoire s’appellent les issues.'
          break
        case 'imp':
          texte = 'Un événement qui ne se réalise jamais est un événement ...'
          rep = 'impossible'
          texteCorr = 'Un événement qui ne se réalise jamais est un événement impossible.'
          break
        case 'equiprob':
          texte = 'Lorsque toutes les issues ont la même probabilité de se produire, on dit qu’il y a …'
          rep = 'équiprobabilité'
          texteCorr = 'Lorsque toutes les issues ont la même probabilité de se produire, on dit qu’il y a équiprobabilité.'
          break
        case 'alea':
          texte = 'Une expérience liée au hasard est une expérience …'
          rep = 'aléatoire'
          texteCorr = 'Une expérience liée au hasard est une expérience aléatoire.'
          break
        case 'certain':
          texte = 'Un événement qui se réalise quelle que soit l’issue est un événement …'
          rep = 'certain'
          texteCorr = 'Un événement qui se réalise quelle que soit l’issue est un événement certain.'
          break
      }
      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, i, 'inline largeur10' + KeyboardType.alphanumeric)
        handleAnswers(this, i, { reponse: { value: rep, compare: fonctionComparaison, options: { texteSansCasse: true } } })
        this.listeQuestions.push(texte)
        i++
      } else { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
