import RepereBuilder from '../../lib/2d/RepereBuilder'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'essai de RepereBuilder'
export const uuid = '95699'
export const ref = 'betaRepere'
export const dateDePublication = '22/07/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
// export const uuid = '' // @todo à changer dans un nouvel exo (utiliser pnpm getNewUuid)
// export const ref = 'betaRepere'// @todo à modifier aussi

/**
 * Un constructeur de Repère amélioré
 * @author Jean-Claude Lhote
 * Référence (betaRepere)
 */
export default class BetaRepere extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.sup = '-5;5;-1.5;1.5'
    this.nbQuestions = 1 // Nombre de questions par défaut
    this.nbQuestionsModifiable = false
    this.besoinFormulaireTexte = ['xMin, xMax, yMin, yMax séparés par des ; ']
  }
  
  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let xMin, xMax, yMin, yMax
    do {
      [xMin, xMax, yMin, yMax] = this.sup.split(';').map(el => Number(el))
    } while (isNaN(yMax))
    //
    const repere = new RepereBuilder({ xMin, xMax, yMin, yMax })
      .setUniteX(3)
      .setUniteY(3)
      .setThickX({ xMin: -5, xMax: 5, dx: Math.PI / 4 })
      .setThickY({ yMin: -1, yMax: 1, dy: 0.5 })
      .setGrille({ grilleX: { dx: Math.PI / 4, xMin: -5, xMax: 5 }, grilleY: { dy: 0.5, yMin: -1, yMax: 1 } })
      //.setGrilleSecondaire({ grilleX: { dx: 0.5, xMin: -8, xMax: 8 }, grilleY: { dy: 0.5, yMin: -5, yMax: 5 } })
      .setLabelX({ dx: Math.PI / 4, xMin: -5, xMax: 5 })
      .setLabelY({ dy: 1, yMin: -1, yMax: 1 })
      .buildTrigo(4)
    const texteEnonce = mathalea2d(Object.assign({}, fixeBordures([repere])), repere)
    this.listeQuestions.push(texteEnonce)
    listeQuestionsToContenu(this)// On envoie l'exercice à la fonction de mise en page
  }
}
