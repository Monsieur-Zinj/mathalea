import Exercice from '../Exercice.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { spline } from '../../modules/fonctionsMaths.js'
import { repere } from '../../modules/2d.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'

export const titre = 'Fichier test sur les splines à nombre dérivé'

export const dateDePublication = '22/06/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'a2ac2'
export const ref = '2F22-9' // c'est provisoire !
/**
 * Description didactique de l'exercice
 * @author
 * Référence
 */
export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.consigne = 'Consigne'
    this.nbQuestions = 1 // Nombre de questions par défaut
    this.nbCols = 2 // Uniquement pour la sortie LaTeX
    this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
    this.video = '' // Id YouTube ou url
  }

  nouvelleVersion (numeroExercice) {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const noeuds = [{ x: 0, y: 0, nombreDerive: 0 },
      { x: 2, y: 4, nombreDerive: 0 },
      { x: 4, y: -2, nombreDerive: 0 },
      { x: 6, y: 1, nombreDerive: 0 },
      { x: 8, y: -4, nombreDerive: 0 }
    ]
    const maSpline = spline(noeuds)

    const r = repere({ xMin: -1, xMax: 10, yMin: -5, yMax: 5 })
    const c = maSpline.courbe({ repere: r })
    const texte = mathalea2d(Object.assign({}, fixeBordures([r, c])), r, c)
    this.listeQuestions.push(texte)
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
