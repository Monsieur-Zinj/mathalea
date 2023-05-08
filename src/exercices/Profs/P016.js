import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint, sp } from '../../modules/outils.js'
import Exercice from '../Exercice.js'
export const titre = 'Simulateur de Dés'
export const dateDePublication = '06/04/2022'

/**
 * Simule des lancers de dés
 * @author Jean-Claude Lhote
 * Référence P016
*/
export default function SimulateurDes () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = '6' // liste de dés
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    let texte
    const liste = gestionnaireFormulaireTexte({ saisie: this.sup, min: 4, max: 100, defaut: 6, nbQuestions: this.nbQuestions })
    texte = 'Vous jetez les dés et vous obtenez : <br><br>'
    for (let i = 0; i < liste.length; i++) {
      texte += randint(1, liste[i]).toString()
      texte += sp(3)
    }
    this.listeQuestions = [texte]
    this.listeCorrections = ['']
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Liste des dés séparés par des tirets (de 4 à 20, par défaut 6)']
}
