import { sp } from '../../lib/outils/outilString.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
export const titre = 'Simulateur de Dés'
export const ref = 'P016'
export const refs = {
  'fr-fr': ['P016'],
  'fr-ch': []
}
export const uuid = 'bc372'
export const dateDePublication = '06/04/2022'

/**
 * Simule des lancers de dés
 * @author Jean-Claude Lhote
 * Référence P016
*/
export default function SimulateurDes () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 1
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = '6' // liste de dés
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    let texte
    const liste = gestionnaireFormulaireTexte({ saisie: this.sup, min: 4, max: 100, defaut: 6, shuffle: false, nbQuestions: this.sup.split('-').length })
    texte = 'Vous jetez les dés et vous obtenez : <br><br>'
    for (let j = 0; j < this.nbQuestions; j++) {
      let somme = 0
      texte += `tirage N°${j + 1} : ${sp(3)}`
      for (let i = 0; i < liste.length; i++) {
        const tirage = randint(1, liste[i])
        somme += tirage
        texte += `$${tirage.toString()}$`
        texte += sp(3)
      }
      texte += `(somme des dés : $${somme}$)<br>`
    }
    this.listeQuestions = [texte]
    this.listeCorrections = ['']
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Liste des dés séparés par des tirets (de 4 à 20, par défaut 6)']
}
