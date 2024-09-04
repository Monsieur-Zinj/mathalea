import Exercice from '../Exercice'
import { arrondi } from '../../lib/outils/nombres'
import { context } from '../../modules/context.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { texNombre } from '../../lib/outils/texNombre'

import figureApigeom from '../../lib/figureApigeom.js'
import Figure from 'apigeom'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues'
import { apigeomGraduatedLine } from '../../lib/apigeom/apigeomGraduatedLine'

export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

export const titre = 'Placer un point sur une droite graduée dont l\'abscisse est un nombre relatif'
export const dateDeModifImportante = '03/05/2024'

/**
* Placer un point d'abscisse un nombre relatif
* @author Jean-Claude Lhote et Rémi Angot
*/
export const uuid = '6d576'
export const ref = '5R11-2'
export const refs = {
  'fr-fr': ['5R11-2'],
  'fr-ch': ['9NO9-2']
}

type goodAnswer = { label: string, x: number }[]

class PlacerPointsSurAxeRelatifs extends Exercice {
  goodAnswers: goodAnswer[] = []
  figuresApiGeom: Figure[] = []
  constructor () {
    super()
    this.nbQuestions = 5
    this.nbQuestionsModifiable = true
    this.nbCols = 1
    this.nbColsCorr = 1
    this.spacing = 1
    this.spacingCorr = 1
    this.sup = 1
    this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Nombre relatif à une décimale\n2 : Nombre relatif à deux décimales\n3 : Nombre relatif à trois décimales\n4 : Mélange']
  }

  nouvelleVersion () {
    let typesDeQuestions
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.contenu = ''
    this.contenuCorrection = ''
    if (this.sup === 4) { typesDeQuestions = combinaisonListes([1, 2, 3], this.nbQuestions) } else { typesDeQuestions = combinaisonListes([parseInt(this.sup)], this.nbQuestions) }

    this.contenu = this.consigne
    for (let i = 0; i < this.nbQuestions; i++) {
      let abs0, step, stepBis : number
      let texte = ''
      let texteCorr = ''
      const label1 = lettreDepuisChiffre(i * 3 + 1)
      const label2 = lettreDepuisChiffre(i * 3 + 2)
      const label3 = lettreDepuisChiffre(i * 3 + 3)
      switch (typesDeQuestions[i]) {
        case 1: // 1 décimale
          abs0 = randint(-7, -3)
          step = 1
          stepBis = 10
          break

        case 2: // 2 décimales
          abs0 = randint(-4, -2) / 10
          step = 10
          stepBis = 10
          break

        default: // 3 décimales
          abs0 = randint(-10, -2) / 100
          step = 100
          stepBis = 10
          break
      }
      const x1 = randint(0, 2)
      const x2 = randint(3, 4)
      const x3 = randint(5, 6)
      const x11 = randint(1, 9)
      const x22 = randint(1, 9)
      const x33 = randint(1, 3)
      const abs1 = arrondi(abs0 + x1 / step + x11 / step / stepBis, typesDeQuestions[i]) // le type de questions est égal au nombre de décimales.
      const abs2 = arrondi(abs0 + x2 / step + x22 / step / stepBis, typesDeQuestions[i])
      const abs3 = arrondi(abs0 + x3 / step + x33 / step / stepBis, typesDeQuestions[i])

      this.goodAnswers[i] = [
        { label: label1, x: arrondi(abs1, 4) },
        { label: label2, x: arrondi(abs2, 4) },
        { label: label3, x: arrondi(abs3, 4) }
      ]

      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte,
          propositions: [{ texte: texteCorr, statut: 0, feedback: '' }]
        }
      }

      const { figure, latex } = apigeomGraduatedLine({ xMin: abs0 - 1 / (stepBis * stepBis * stepBis * stepBis), xMax: abs0 + 7 / step + 1 / (stepBis * stepBis * stepBis), scale: step })
      figure.options.labelAutomaticBeginsWith = label1
      figure.options.pointDescriptionWithCoordinates = false
      this.figuresApiGeom[i] = figure

      const { figure: figureCorr, latex: latexCorr } = apigeomGraduatedLine({ xMin: abs0 - 1 / (stepBis * stepBis * stepBis * stepBis), xMax: abs0 + 7 / step + 1 / (stepBis * stepBis * stepBis), scale: step, points: this.goodAnswers[i] })
      figureCorr.create('Point', { label: label1, x: abs1, color: orangeMathalea, colorLabel: orangeMathalea, shape: 'x', labelDxInPixels: 0 })
      figureCorr.create('Point', { label: label2, x: abs2, color: orangeMathalea, colorLabel: orangeMathalea, labelDxInPixels: 0 })
      figureCorr.create('Point', { label: label3, x: abs3, color: orangeMathalea, colorLabel: orangeMathalea, labelDxInPixels: 0 })
      // MGU : gère le zoom des figures apigeom statiques comme les figures mathalea2d
      figureCorr.divFigure.classList.add('svgContainer')
      figureCorr.divFigure.querySelector('svg')?.classList.add('mathalea2d')
      for (const di of figureCorr.divFigure.querySelectorAll('div')) {
        di.classList.add('divLatex')
      }

      texte = `Placer les points : $${label1}(${texNombre(abs1, 5)}), ${label2}(${texNombre(abs2, 5)}), ${label3}(${texNombre(abs3, 5)})$.`

      switch (true) {
        case context.isHtml && this.interactif:
          texte += '<br>' + figureApigeom({ exercice: this as Exercice, idApigeom: `ApigeomEx${this.numeroExercice}Q${i}`, figure })
          texteCorr += figureCorr.getStaticHtml()
          break
        case context.isHtml:
          texte += '<br>' + figure.getStaticHtml()
          texteCorr += figureCorr.getStaticHtml()
          break
        default:
          texte += '\n\n' + latex
          texteCorr += '\\;\n' + latexCorr
          break
      }
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: this.consigne + '<br>' + texte + '<br>',
          propositions: [{ statut: 3, sanscadre: true }]
        }
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }

    this.exoCustomResultat = true
    listeQuestionsToContenu(this)
  }

  correctionInteractive = (i?: number) => {
    if (i === undefined) return ['KO']
    const result: ('OK'|'KO')[] = []
    const figure = this.figuresApiGeom[i]
    figure.isDynamic = false
    figure.divButtons.style.display = 'none'
    figure.divUserMessage.style.display = 'none'
    const goodAnswer = this.goodAnswers[i]
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`)
    for (let j = 0; j < goodAnswer.length; j++) {
      const label = goodAnswer[j].label
      const x = goodAnswer[j].x
      const { isValid, message, points } = figure.checkCoords({ checkOnlyAbscissa: true, label, x, y: 0 })
      const point = points[0]
      if (isValid) {
        result.push('OK')
        point.color = 'green'
        point.colorLabel = 'green'
        point.thickness = 3
      } else {
        result.push('KO')
        if (point !== undefined) {
          point.color = 'red'
          point.colorLabel = 'red'
          point.color = 'red'
          point.thickness = 3
        }
      }
      if (divFeedback != null && message.length > 0) {
        const p = document.createElement('p')
        p.innerText = message
        divFeedback.appendChild(p)
      }
    }
    if (divFeedback != null) {
      if (divFeedback?.innerHTML === '') {
        divFeedback.innerHTML = '😎'
      } else {
        const p = document.createElement('p')
        p.innerText = '☹️'
        divFeedback.insertBefore(p, divFeedback.firstChild)
      }
    }
    return result
  }
}

export default PlacerPointsSurAxeRelatifs
