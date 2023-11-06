import Exercice from '../ExerciceTs'
import Figure from 'apigeom'
import { egal, randint } from '../../modules/outils.js'
import { context } from '../../modules/context'
import figureApigeom from '../../lib/figureApigeom'
import { Spline } from '../../lib/mathFonctions/Spline'
import PointOnSpline from '../../lib/mathFonctions/SplineApiGeom'
import { texNombre } from '../../lib/outils/texNombre'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import type { MathfieldElement } from 'mathlive'
import { numAlpha } from '../../lib/outils/outilString'
import { Tableau } from '../../lib/2d/tableau'
import type FractionEtendue from '../../modules/FractionEtendue'
import { AddTabPropMathlive, type Icell } from '../../lib/interactif/tableaux/AjouteTableauMathlive'

export const titre = 'Lire graphiquement l\'image d\'un nombre par une fonction'
export const dateDePublication = '29/10/2023'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Lire une image sur une Spline
 * @author Jean-Claude Lhote (sur le modèle de 5R12-1 de Rémi Angot
 * Références 3F10-4
 */

const noeudsSplineAleatoire = function (n: number, noeudsVisibles: boolean): Array<{x: number, y:number, deriveeGauche:number, deriveeDroit:number, isVisible:boolean}> {
  const noeuds = []
  const isVisible = noeudsVisibles
  const xMin = -Math.round(n / 2)
  let y = randint(-5, 5)
  let deriveeDroit = Math.cos(Math.random() * Math.PI) * randint(1, 2)
  for (let x = xMin; x < -xMin + 1; x += 2) {
    const y0 = y
    noeuds.push({ x, y, deriveeGauche: deriveeDroit, deriveeDroit, isVisible })
    do {
      y = y + Math.cos(Math.random() * Math.PI) * randint(1, 2)
    } while (y > 5 || y < -5)
    do {
      deriveeDroit = Math.cos(Math.random() * Math.PI) * randint(1, 2)
    } while (deriveeDroit * (y - y0) < 0)
  }
  return noeuds
}
class LireImageParApiGeom extends Exercice {
  // On déclare des propriétés supplémentaires pour cet exercice afin de pouvoir les réutiliser dans la correction
  figure!: Figure
  idApigeom!: string
  nbImages: number
  X: number[]
  Y: number[]
  constructor () {
    super()
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    // Pour un exercice de type simple qui n'utilise pas le champ de réponse
    this.formatChampTexte = 'largeur15 inline'
    this.besoinFormulaireNumerique = ['Nombre d\'images à trouver (de 1 à 5)', 5]
    this.sup = 3
    this.nbImages = 3
    this.X = []
    this.Y = []
    this.exoCustomResultat = true
  }

  nouvelleVersion (numeroExercice: number): void {
    // on va chercher une spline aléatoire
    const noeuds = noeudsSplineAleatoire(12, false)
    const spline = new Spline(noeuds)
    this.nbImages = this.sup
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    this.figure = new Figure({ xMin: -6.3, yMin: -6.3, width: 378, height: 378 })
    this.figure.create('Grid')
    this.figure.options.limitNumberOfElement.set('Point', 1)
    this.listeQuestions = []
    this.listeCorrections[0] = ''
    this.autoCorrection = []

    // De -6.3 à 6.3 donc width = 12.6 * 30 = 378
    let mesPoints
    if (spline.pointsOfSpline && Array.isArray(spline.pointsOfSpline)) {
      mesPoints = spline.pointsOfSpline.map(el => this.figure.create('Point', { x: el.x, y: el.y, isVisible: false }))
    }
    if (mesPoints !== undefined) {
      this.figure.create('Polyline', { points: mesPoints })
    }
    if (context.isHtml) {
      const pointMobile = new PointOnSpline(this.figure, { spline, x: 1, abscissa: true, ordinate: true, isVisible: true, shape: 'x', color: 'blue', size: 3, thickness: 3 })
      pointMobile.draw()
      pointMobile.label = 'M'
      pointMobile.createSegmentToAxeX()
      pointMobile.createSegmentToAxeY()
      const textX = this.figure.create('DynamicX', { point: pointMobile })
      const textY = this.figure.create('DynamicY', { point: pointMobile })
      textX.dynamicText.maximumFractionDigits = 1
      textY.dynamicText.maximumFractionDigits = 1
    }

    let enonce = 'Par lecture graphique sur la courbe de la fonction $f$ tracée ci-dessus, quelle est l\'image de :<br>'
    const { yMax, yMin } = spline.trouveMaxes()
    for (let i = 0; i < this.nbImages; i++) {
      do {
        if (spline.x && spline.n) {
          this.X[i] = Math.round((spline.x[0] + Math.random() * (spline.x[spline.n - 1] - spline.x[0])) * 10) / 10
        } else {
          this.X[i] = randint(-6, 6, this.X)
        }
        // je sais que i n'est pas modifié, mais la condition sur this.x[i] l'est et c'est ça qui compte !
        // eslint-disable-next-line no-unmodified-loop-condition
      } while ((i % 2 !== 0 && !(this.X[i] < yMax - 0.5 && this.X[i] > yMin + 0.5)) || this.X[i] in this.X.slice(0, i - 1))
    }
    for (let i = 0; i < this.nbImages; i++) {
      enonce += `${numAlpha(i)} $${texNombre(this.X[i], 1)}$ ?` + ajouteChampTexteMathLive(this, i, 'largeur10 inline', { texteApres: '  ' }) + '<br>'
      const image = spline.fonction(this.X[i]) as FractionEtendue
      this.Y[i] = Math.round(10 * Number(image)) / 10
      //  setReponse(this, i, this.Y[i], { formatInteractif: 'calcul' })
      this.listeCorrections[0] += `${numAlpha(i)} $f(${texNombre(this.X[i], 1)})=${texNombre(this.Y[i], 1)}$<br>`
    }
    setReponse(this, 0, [{ L2C2: this.Y[0] }, { L2C3: this.Y[1] }, { L2C4: this.Y[2] }], { formatInteractif: 'tableauMathlive' })
    const ligne1: Icell[] = [{ texte: 'x', gras: true, color: 'black', latex: true }].concat(this.X.map(el => Object.assign({}, { texte: texNombre(el, 1), gras: false, color: 'black', latex: true })))
    const ligne2:Icell[] = [{ texte: 'f(x)', gras: true, color: 'black', latex: true }].concat(this.Y.map(el => Object.assign({}, { texte: texNombre(el, 1), gras: false, color: 'black', latex: true })))
    const ligne2bis: Icell[] = [{ texte: 'f(x)', gras: true, color: 'black', latex: true }].concat(this.Y.map(() => Object.assign({}, { texte: '', gras: false, color: 'black', latex: true })))
    const nbColonnes = this.nbImages
    if (this.interactif) {
      const tabMathlive = AddTabPropMathlive.create(this, 0, { ligne1, ligne2: ligne2bis, nbColonnes })
      enonce += '<br>' + tabMathlive.output
    }
    const tableauValeur = new Tableau({
      nbColonnes,
      ligne1,
      ligne2
    })
    const { xmin, ymin, xmax, ymax } = fixeBordures([tableauValeur])
    this.listeCorrections[0] += mathalea2d({ xmin, ymin, xmax, ymax }, tableauValeur)
    this.figure.setToolbar({ tools: ['DRAG'], position: 'top' })
    if (this.figure.ui) this.figure.ui.send('DRAG')
    // Il est impératif de choisir les boutons avant d'utiliser figureApigeom
    const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure: this.figure })
    this.figure.isDynamic = true
    this.figure.divButtons.style.display = 'flex'
    const repere = new RepereBuilder({ xMin: -6.3, yMin: -6.3, xMax: 6.3, yMax: 6.3 })
      .setGrille({
        grilleX: {
          dx: 1, xMin: -6, xMax: 6
        },
        grilleY: {
          dy: 1, yMin: -6, yMax: 6
        }
      })
      .setGrilleSecondaire({
        grilleX: {
          dx: 0.2, xMin: -6, xMax: 6
        },
        grilleY: { dy: 0.2, yMin: -6, yMax: 6 }
      })
      .buildStandard()
    if (context.isHtml) {
      this.listeQuestions = [emplacementPourFigure + enonce]
    } else {
      this.listeQuestions = [mathalea2d({ xmin: -6.3, ymin: -6.3, xmax: 6.3, ymax: 6.3 }, [repere, spline.courbe({ repere, step: 0.05 })]) + enonce]
    }
  }

  correctionInteractive = () => {
    const result: string[] = []
    for (let k = 0; k < this.nbImages; k++) {
      const answer: MathfieldElement = document.getElementById(`champTexteEx${this.numeroExercice}Q${k}`) as MathfieldElement
      const valeur = Number(answer.value.replace(',', '.').replace(/\((\+?-?\d+)\)/, '$1'))
      const divFeedback = document.querySelector(`span#resultatCheckEx${this.numeroExercice}Q${k}`)
      if (divFeedback) {
        if (egal(valeur, this.Y[k], 0.1)) {
          divFeedback.innerHTML = divFeedback.innerHTML += '😎'
          result.push('OK')
        } else {
          divFeedback.innerHTML += '☹️'
          result.push('KO')
        }
      }
    }
    return result
  }
}

export default LireImageParApiGeom
