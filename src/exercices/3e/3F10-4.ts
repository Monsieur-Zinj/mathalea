import Exercice from '../Exercice'
import Figure from 'apigeom'
import { egal, randint } from '../../modules/outils.js'
import { context } from '../../modules/context'
import figureApigeom from '../../lib/figureApigeom'
import { Spline, noeudsSplineAleatoire } from '../../lib/mathFonctions/Spline'
import PointOnSpline from '../../lib/mathFonctions/SplineApiGeom'
import { texNombre } from '../../lib/outils/texNombre'
import { mathalea2d } from '../../modules/2dGeneralites'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import type FractionEtendue from '../../modules/FractionEtendue'
import { AddTabPropMathlive, type Icell } from '../../lib/interactif/tableaux/AjouteTableauMathlive'
import { MathfieldElement } from 'mathlive'
import type Point from 'apigeom/src/elements/points/Point'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { tableauColonneLigne } from '../../lib/2d/tableau'

export const titre = 'Lire graphiquement l\'image d\'un nombre par une fonction'
export const dateDePublication = '29/10/2023'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Lire une image sur une Spline
 * @author Jean-Claude Lhote (sur le modèle de 5R12-1 de Rémi Angot
 * Références 3F10-4
 */
export const uuid = '6c6b3'
export const ref = '3F10-4'
export const refs = {
  'fr-fr': ['3F10-4'],
  'fr-ch': ['10FA5-8', '11FA7-2']
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
    this.answers = {}
  }

  nouvelleVersion (numeroExercice: number): void {
    // on va chercher une spline aléatoire
    this.listeCorrections = []
    this.listeQuestions = []
    const noeuds = noeudsSplineAleatoire(12, false, -6, 2)
    const spline = new Spline(noeuds)
    this.nbImages = this.sup
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    this.figure = new Figure({ xMin: -6.3, yMin: -6.3, width: 378, height: 378 })
    this.figure.create('Grid')
    this.figure.options.limitNumberOfElement.set('Point', 1)
    this.listeQuestions = []
    this.listeCorrections = ['']
    this.autoCorrection = []

    // De -6.3 à 6.3 donc width = 12.6 * 30 = 378
    const mesPoints = spline.pointsOfSpline(126)
    let mesPointsApiGeom: Point[] = []
    if (mesPoints && Array.isArray(mesPoints)) {
      mesPointsApiGeom = mesPoints.map(el => this.figure.create('Point', { x: el.x, y: el.y, isVisible: false }))
    }
    if (mesPointsApiGeom !== undefined) {
      this.figure.create('Polyline', { points: mesPointsApiGeom })
    }
    if (context.isHtml) {
      const pointMobile = new PointOnSpline(this.figure, { spline, x: 1, dx: 0.1, abscissa: true, ordinate: true, isVisible: true, shape: 'x', color: 'blue', size: 3, thickness: 3 })
      pointMobile.draw()
      pointMobile.label = 'M'
      pointMobile.createSegmentToAxeX()
      pointMobile.createSegmentToAxeY()
      const textX = this.figure.create('DynamicX', { point: pointMobile })
      const textY = this.figure.create('DynamicY', { point: pointMobile })
      textX.dynamicText.maximumFractionDigits = 2
      textY.dynamicText.maximumFractionDigits = 1
    }

    let enonce = 'Par lecture graphique sur la courbe de la fonction $f$ tracée ci-dessus, compléter le tableau de valeur ci-dessous :<br>'
    this.X = []
    this.Y = []
    for (let i = 0; i < this.nbImages; i++) {
      do {
        if (spline.x && spline.n) {
          this.X[i] = Math.round((spline.x[0] + Math.random() * (spline.x[spline.n - 1] - spline.x[0])) * 10) / 10
        } else {
          this.X[i] = randint(-6, 6, this.X)
        }
        // je sais que i n'est pas modifié, mais la condition sur this.x[i] l'est et c'est ça qui compte !
        // eslint-disable-next-line no-unmodified-loop-condition
      } while (this.X.slice(0, i).indexOf(this.X[i]) !== -1 || !(this.X[i] < -1 || this.X[i] > 1))
    }
    // on ordonne les X dans l'ordre croissant
    let index = 0
    while (index < this.nbImages) {
      let j = index + 1
      while (j < this.nbImages) {
        if (this.X[index] > this.X[j]) {
          const x = this.X[index]
          const y = this.Y[index]
          this.X[index] = this.X[j]
          this.Y[index] = this.Y[j]
          this.X[j] = x
          this.Y[j] = y
        }
        j++
      }
      index++
    }
    for (let i = 0; i < this.nbImages; i++) {
    //  enonce += `${numAlpha(i)} $${texNombre(this.X[i], 1)}$ ?` + ajouteChampTexteMathLive(this, i, 'largeur10 inline', { texteApres: '  ' }) + '<br>'
      const image = spline.fonction(this.X[i]) as FractionEtendue
      this.Y[i] = Math.round(10 * Number(image)) / 10
    }

    const ligne1: Icell[] = [{ texte: 'x', gras: true, color: 'black', latex: true }].concat(this.X.map(el => Object.assign({}, { texte: texNombre(el, 1), gras: false, color: 'black', latex: true })))
    const ligne2:Icell[] = [{ texte: 'f(x)', gras: true, color: 'black', latex: true }].concat(this.Y.map(el => Object.assign({}, { texte: texNombre(el, 1), gras: false, color: 'black', latex: true })))
    const ligne2bis: Icell[] = [{ texte: 'f(x)', gras: true, color: 'black', latex: true }].concat(this.Y.map(() => Object.assign({}, { texte: '', gras: false, color: 'black', latex: true })))
    const nbColonnes = this.nbImages
    const yGrecs: string[] = this.Y.map((el) => texNombre(el, 1))
    const xs = this.X.map(el => texNombre(el, 1))

    if (this.interactif) {
      const tabMathlive = AddTabPropMathlive.create(this.numeroExercice ?? 0, 0, { ligne1, ligne2: ligne2bis, nbColonnes }, 'clavierDeBase', true, {})
      enonce += '<br>' + tabMathlive.output
    } else {
      if (context.isHtml) {
        const tabMathlive = AddTabPropMathlive.create(this.numeroExercice ?? 0, 0, { ligne1, ligne2: ligne2bis, nbColonnes }, 'clavierDeBase', false, {})
        enonce += tabMathlive.output
      } else {
        const tabVideTex = tableauColonneLigne(['x'].concat(xs), ['f(x)'], yGrecs.map(() => ''), 1, true, this.numeroExercice, 0)
        enonce += tabVideTex
      }
    }
    const tableauValeur = AddTabPropMathlive.create(this.numeroExercice ?? 0, 0, { ligne1, ligne2, nbColonnes }, 'clavierDeBase', false, {})
    const tabValeurTex = tableauColonneLigne(['x'].concat(xs), ['f(x)'], yGrecs, 1, true, this.numeroExercice, 0)
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
      this.listeCorrections[0] = 'Les images sont tolérées à $0{,}1$ près :' + tableauValeur.output
      this.listeQuestions = [emplacementPourFigure + enonce]
      const reponses = []
      for (let i = 0; i < nbColonnes; i++) {
        reponses.push([`L1C${i + 1}`, { value: this.Y[i] }])
      }
      setReponse(this, 0, Object.fromEntries(reponses), { formatInteractif: 'tableauMathlive' })
    } else {
      this.listeCorrections[0] = mathalea2d({ xmin: -6.3, ymin: -6.3, xmax: 6.3, ymax: 6.3 }, [repere, spline.courbe({ repere, step: 0.05 })]) +
        '\\\\' +
        'Les images sont tolérées à $0{,}1$ près :' +
        '\\\\' +
        tabValeurTex
      this.listeQuestions = [mathalea2d({ xmin: -6.3, ymin: -6.3, xmax: 6.3, ymax: 6.3 }, [repere, spline.courbe({ repere, step: 0.05 })]) + enonce]
    }
  }

  correctionInteractive = () => {
    this.answers = {}
    const tableId = `tabMathliveEx${this.numeroExercice}Q${0}`
    const tableau = document.querySelector(`table#${tableId}`)
    if (tableau == null) throw Error('La correction de 3F10-4 n\'a pas trouvé le tableau interactif.')
    const result: string[] = []
    for (let k = 0; k < this.nbImages; k++) {
      const answer: MathfieldElement = tableau.querySelector(`math-field#champTexteEx${this.numeroExercice}Q0L1C${k + 1}`) as MathfieldElement
      if (answer == null) throw Error(`Il n'y a pas de math-field d'id champTexteEx${this.numeroExercice}QOL1C${k + 1} dans ce tableau !`)
      const valeur = Number(answer.value.replace(',', '.').replace(/\((\+?-?\d+)\)/, '$1'))
      if (valeur) this.answers[`Ex${this.numeroExercice}Q0L1C${k + 1}`] = String(valeur)
      const spanResultat = tableau.querySelector(`span#resultatCheckEx${this.numeroExercice}Q0L1C${k + 1}`)
      if (spanResultat) {
        if (egal(valeur, this.Y[k], 0.1)) {
          spanResultat.innerHTML = spanResultat.innerHTML += '😎'
          result.push('OK')
        } else {
          spanResultat.innerHTML += '☹️'
          result.push('KO')
        }
      }
    }
    return result
  }
}

export default LireImageParApiGeom
