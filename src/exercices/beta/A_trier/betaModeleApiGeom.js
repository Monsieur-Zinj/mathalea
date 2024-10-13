import Figure from 'apigeom'
import { spline } from '../../../lib/mathFonctions/Spline.js'
import PointOnSpline from '../../../lib/mathFonctions/SplineApiGeom.js'
import { listeQuestionsToContenu } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'

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
    this.consigne = ''
    this.nbQuestions = 1 // Nombre de questions par défaut
  }

  nouvelleVersion (numeroExercice) {
    const figure = new Figure()
    // const A = figure.create('Point', { x: 0, y: 0, label: 'A' })
    // const B = figure.create('Point', { x: 4, y: -1, label: 'B' })
    // const C = figure.create('Point', { x: -1, y: 4, label: 'C' })
    // const p = figure.create('Polygon', { points: [A, B, C] })
    // const med1 = figure.create('PerpendicularBissector', { segment: p.segments[1] })
    // const med2 = figure.create('PerpendicularBissector', { segment: p.segments[2] })
    // med1.thickness = 2
    // med1.color = 'blue'
    // med2.thickness = 2
    // med2.color = 'blue'
    // const O = figure.create('PointIntersectionLL', { line1: med1, line2: med2, label: 'O' })
    // const circonscrit = figure.create('CircleCenterPoint', { center: O, point: A })
    // figure.create('Grid')
    // circonscrit.color = 'red'
    // circonscrit.isDashed = true
    // circonscrit.thickness = 2
    // circonscrit.fillColor = 'orange'
    // circonscrit.fillOpacity = 0.1
    // p.thickness = 2

    const mySpline = spline([
      { x: -10, y: 5, deriveeGauche: -2, deriveeDroit: -2, isVisible: false },
      { x: -2, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
      { x: 2, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
      { x: 5, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
      { x: 12, y: 4, deriveeGauche: 0, deriveeDroit: 0, isVisible: false }
    ])

    for (let i = 0; i < mySpline.n - 1; i++) {
      figure.create('Graph2', {
        f: mySpline.fonctions[i],
        xMin: mySpline.x[i],
        xMax: mySpline.x[i + 1],
        step: 0.1,
        thickness: 1.2
      })
    }

    const M = new PointOnSpline(figure, { spline: mySpline, label: 'M', thickness: 2 })
    M.draw()
    M.createSegmentToAxeX()
    M.createSegmentToAxeY()
    const textX = figure.create('DynamicX', { point: M })
    const textY = figure.create('DynamicY', { point: M })

    figure.create('Grid')

    this.listeQuestions[0] = `<div id="apigeomEx${numeroExercice}F0"></div>`
    this.listeCorrections[0] = ''
    document.addEventListener('exercicesAffiches', () => {
      const container = document.querySelector(`#apigeomEx${numeroExercice}F0`)
      if (container === null) return
      container.innerHTML = ''
      figure.setContainer(container)
      textX.dynamicText.div.style.fontWeight = 'bolder'
      textY.dynamicText.div.style.fontWeight = 'bolder'
    })

    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
