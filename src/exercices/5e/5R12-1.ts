import Exercice from '../Exercice'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'
import { randint } from '../../modules/outils.js'
import type TextByPosition from 'apigeom/src/elements/text/TextByPosition.js'
import { context } from '../../modules/context'

export const titre = 'Placer des points dans un repère'
export const dateDePublication = '27/10/2023'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * Placer des points dans un repère
 * @author Rémi Angot
 */
export const uuid = '4dadb'
export const ref = '5R12-1'
export const refs = {
  'fr-fr': ['5R12-1'],
  'fr-ch': ['9FA1-6']
}

// Type simplifié pour la sauvegarde de la réponse
type Coords = { label: string, x: number, y: number }

class ReperagePointDuPlan extends Exercice {
  // On déclare des propriétés supplémentaires pour cet exercice afin de pouvoir les réutiliser dans la correction
  figure!: Figure
  points: Coords[] = []
  idApigeom!: string
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.exoCustomResultat = true // Pour qu'une unique question puisse rapporter plusieurs points
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    // Pour un exercice de type simple qui n'utilise pas le champ de réponse
    this.reponse = ''
    this.formatChampTexte = 'none'
  }

  nouvelleVersion (): void {
    this.idApigeom = `apiGeomEx${this.numeroExercice}F0`
    this.figure = new Figure({ snapGrid: true, xMin: -6.3, yMin: -6.3, width: 378, height: 378 })
    // De -6.3 à 6.3 donc width = 12.6 * 30 = 378
    this.figure.create('Grid')
    this.figure.options.labelAutomaticBeginsWith = 'A' // Les points sont nommés par ordre alphabétique
    this.figure.options.limitNumberOfElement.set('Point', 4) // On limite le nombre de points à 4
    this.figure.options.pointDescriptionWithCoordinates = false

    let x1 = randint(-6, -1)
    let x2 = randint(1, 6, x1)
    let x3 = randint(-6, 6, [0, x1, x2])
    let x4 = 0
    let y1 = randint(-6, -1)
    let y2 = randint(1, 6, y1)
    let y3 = randint(-6, 6, [0, y1, y2])
    let y4 = 0
    // On mélange en évitant le couple (0,0)
    while ([[x1, y1], [x2, y2], [x3, y3], [x4, y4]].some(e => e[0] === 0 && e[1] === 0)) {
      [x1, x2, x3, x4] = [x1, x2, x3, x4].sort(() => Math.random() - 0.5)
      ;[y1, y2, y3, y4] = [y1, y2, y3, y4].sort(() => Math.random() - 0.5)
    }
    this.points = [
      { label: 'A', x: x1, y: y1 },
      { label: 'B', x: x2, y: y2 },
      { label: 'C', x: x3, y: y3 },
      { label: 'D', x: x4, y: y4 }
    ]
    const figureCorr = new Figure({ snapGrid: true, xMin: -7, yMin: -7, width: 420, height: 420, isDynamic: false })
    figureCorr.create('Grid', { xMin: -6, yMin: -6, xMax: 6, yMax: 6 })
    for (const coord of this.points) {
      figureCorr.create('Point', { x: coord.x, y: coord.y, color: 'green', thickness: 3, label: coord.label })
    }
    let enonce = 'Placer les points suivants : '
    enonce += `$A(${x1}\\;;\\;${y1})$ ; $B(${x2}\\;;\\;${y2})$ ; $C(${x3}\\;;\\;${y3})$ et $D(${x4}\\;;\\;${y4})$.`
    // this.figure.divButtons = this.figure.addButtons('POINT DRAG REMOVE')
    this.figure.setToolbar({ tools: ['POINT', 'DRAG', 'REMOVE'], position: 'top' })
    const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure: this.figure })
    const texteCorr = figureCorr.getStaticHtml()

    if (context.isHtml) {
      this.question = enonce + emplacementPourFigure
      this.correction = texteCorr
    } else {
      this.question = enonce + `\n\n\\bigskip\n\\{Reperage[Plan,AffichageGrad,Unitex=0.75,Unitey=0.75]{%
        -5/0/A,0/-5/B,5/0/C,0/5/D%
        }}`
      this.correction = `{\\Reperage[Plan,AffichageGrad,Unitesx=0.75,Unitey=0.75,Traces={%
        drawoptions(withcolor red);
        pointe(A,B,C,D);
        label.urt(btex A etex,A);
        label.urt(btex B etex,B);
        label.urt(btex C etex,C);
        label.urt(btex D etex,D);
      }]{%
        -5/0/ ,0/-5/ ,5/0/ ,0/5/ ,${x1}/${y1}/A,${x2}/${y2}/B,${x3}/${y3}/C,${x4}/${y4}/D%
        }}`
    }
    if (context.isAmc) {
      this.autoCorrection[0] = {
        enonce: this.question,
        propositions: [
          {
            texte: '',
            statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
            sanscadre: true // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
          }
        ]
      }
    }
  }

  correctionInteractive = () => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom] = this.figure.json
    const resultat = [] // Tableau de 'OK' ou de'KO' pour le calcul du score
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q0`)
    for (const coord of this.points) {
      const { points, isValid, message } = this.figure.checkCoords({ label: coord.label, x: coord.x, y: coord.y })
      // Point par point, je vérifie que le label et les coordonnées correspondent
      if (isValid) {
        resultat.push('OK')
      } else {
        if (divFeedback != null) {
          divFeedback.innerHTML += message + '<br>'
        }
        if (points[0] !== undefined) {
          const point = points[0]
          point.color = 'red'
          point.thickness = 3
          const textLabel = point.elementTextLabel as TextByPosition
          // Là aussi je rajoute as TextByPosition car je suis sûr que ce point a un label
          textLabel.color = 'red'
        }
        const pointCorr = this.figure.create('Point', { x: coord.x, y: coord.y, color: 'green', thickness: 3, label: coord.label })
        const pointCorrLabel = pointCorr.elementTextLabel as TextByPosition
        pointCorrLabel.color = 'green'
        resultat.push('KO')
      }
    }
    this.figure.isDynamic = false
    this.figure.divButtons.style.display = 'none'
    this.figure.divUserMessage.style.display = 'none'
    return resultat
  }
}

export default ReperagePointDuPlan
