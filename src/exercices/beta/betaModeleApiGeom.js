import Exercice from '../Exercice.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import Figure from 'apigeom'
export const titre = 'Géométrie dynamique'
export const uuid = 'betaGeom'

export const dateDePublication = '11/07/2024' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Description didactique de l'exercice
 * @author Rémi Angot
*/
export default class ExerciceApiGeom extends Exercice {
  constructor () {
    super()
    this.consigne = 'Déplacer les points puis écrire un programme de construction'
    this.nbQuestions = 1 // Nombre de questions par défaut
  }

  nouvelleVersion (numeroExercice) {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const figure = new Figure()
    const A = figure.create('Point', { x: 0, y: 0, label: 'A' })
    const B = figure.create('Point', { x: 4, y: -1, label: 'B' })
    const C = figure.create('Point', { x: -1, y: 4, label: 'C' })
    const p = figure.create('Polygon', { points: [A, B, C] })
    const med1 = figure.create('PerpendicularBissector', { segment: p.segments[1] })
    const med2 = figure.create('PerpendicularBissector', { segment: p.segments[2] })
    med1.thickness = 2
    med1.color = 'blue'
    med2.thickness = 2
    med2.color = 'blue'
    const O = figure.create('PointIntersectionLL', { line1: med1, line2: med2, label: 'O' })
    const circonscrit = figure.create('CircleCenterPoint', { center: O, point: A })
    circonscrit.color = 'red'
    circonscrit.isDashed = true
    circonscrit.thickness = 2
    circonscrit.fillColor = 'orange'
    circonscrit.fillOpacity = 0.2
    this.listeQuestions[0] = `<div id="apiGeomEx${numeroExercice}F0"></div>`
    this.listeCorrections[0] = ''
    document.addEventListener('exercicesAffiches', () => {
      const container = document.querySelector(`#apiGeomEx${numeroExercice}F0`)
      if (container === null) return
      figure.setContainer(container)
    })

    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
