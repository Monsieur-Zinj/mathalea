import { choice } from '../../lib/outils/arrayOutils.js'
import { lettreIndiceeDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom.js'
import { arrondi } from '../../lib/outils/nombres.js'
import GraduatedLine from 'apigeom/src/elements/grid/GraduatedLine.js'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues.js'
import { fraction } from '../../modules/fractions.js'

export const dateDePublication = '28/01/2023'
export const dateDeModifImportante = '08/06/2024'
export const titre = 'Placer des points d’abscisses fractionnaires (niv 2)'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCHybride'

/** Placer des points d’abscisses fractionnaires avec des subdivisions
 * @author Eric Elter // (sur la base de 6N21)
 */
export const uuid = '778c0'
export const ref = '6N21-1'
export const refs = {
  'fr-fr': ['6N21-1'],
  'fr-ch': ['9NO11-5']
}

type goodAnswer = { label: string, x: number }[]

class PlacerPointsAbscissesFractionnairesBis extends Exercice {
  figures!: Figure[]
  goodAnswers!: goodAnswer[]
  constructor () {
    super()
    this.figures = []
    this.goodAnswers = []
    this.nbQuestions = 5
    this.sup = '1-2-5-6'
    this.exoCustomResultat = true
    this.besoinFormulaireTexte = [
      'Type de questions', [
        'Nombres séparés par des tirets',
        '1 : Doublement partagé avec origine visible',
        '2 : Triplement partagé avec origine visible',
        '3 : Quadruplement partagé avec origine visible',
        '4 : Quintuplement partagé avec origine visible',
        '5 : Doublement partagé avec origine non visible',
        '6 : Triplement partagé avec origine non visible',
        '7 : Quadruplement partagé avec origine non visible',
        '8 : Quintuplement partagé avec origine non visible',
        '9 : Mélange'
      ].join('\n')
    ]
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const typeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 8,
      melange: 9,
      defaut: 9,
      nbQuestions: this.nbQuestions
    })

    const fractionsUtilisees: Array<[number, number]> = [] // Pour s'assurer de ne pas poser 2 fois la même question
    const tableUtilisées: [number[], number[], number[], number[]] = [[], [], [], []]
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let origine, num, den, coef : number
      origine = 0
      den = 0
      coef = 0
      const scale = 2
      switch (typeDeQuestions[i]) {
        case 1: // Doublement partagé : des demis avec des quarts, des tiers avec des sixièmes...
        case 5:
          origine = typeDeQuestions[i] === 1 ? 0 : randint(1, 7)
          coef = 2
          den = randint(2, 5, tableUtilisées[0])
          num = origine * den + randint(1, den * 4, den)
          coef = 2
          tableUtilisées[0].push(den)
          if (tableUtilisées[0].length === 4) tableUtilisées[0] = []
          break
        case 2: // Triplement partagé : des demis avec des sixièmes, des tiers avec des neuvièmes...
        case 6:
          origine = typeDeQuestions[i] === 2 ? 0 : randint(1, 7)
          coef = 3
          den = randint(2, 5, tableUtilisées[1])
          tableUtilisées[1].push(den)
          if (tableUtilisées[1].length === 4) tableUtilisées[1] = []
          break
        case 3: // Quadruplement partagé : des demis avec des quarts et des huitièmes, des tiers avec des sixièmes et des douzièmes.
        case 7:
          origine = typeDeQuestions[i] === 3 ? 0 : randint(1, 7)
          coef = 4
          den = randint(2, 3, tableUtilisées[2])
          tableUtilisées[2].push(den)
          if (tableUtilisées[2].length === 2) tableUtilisées[2] = []
          break
        case 4: // Quintuplement partagé : des demis avec des dixièmes, des tiers avec des quinzièmes.
        case 8:
          origine = typeDeQuestions[i] === 4 ? 0 : randint(1, 7)
          coef = 5
          den = randint(2, 3, tableUtilisées[3])
          tableUtilisées[3].push(den)
          if (tableUtilisées[3].length === 2) tableUtilisées[3] = []
          break
      }
      // origine = this.sup > 4 ? randint(-4, 1) : origine // Pour la 2nde
      num = origine * den + randint(1, den * 4, den)
      let num2 = randint(origine * den + 1, (origine + 4) * den, [num, den])
      let num3 = randint(origine * den + 1, (origine + 4) * den, [num, num2, den])
      let den1, den2, den3, num1, coef2:number
      num1 = num
      den1 = den
      den2 = den
      den3 = den
      let choix:boolean
      switch (coef) {
        case 1 :
        case 2 :
        case 3 :
          choix = choice([true, false])
          if (choix) {
            num1 = coef * num1
            den1 = coef * den
          }
          if (!choix) {
            num2 = coef * num2
            den2 = coef * den
          }
          if (choice([true, false])) {
            num3 = coef * num3
            den3 = coef * den
          }
          break
        case 4 :
          coef2 = choice([1, 2, 4])
          num1 = coef2 * num1
          den1 = coef2 * den
          coef2 = choice([1, 2, 4], [coef2])
          num2 = coef2 * num2
          den2 = coef2 * den
          coef2 = choice([1, 2, 4])
          num3 = coef2 * num3
          den3 = coef2 * den
          break
        case 5 :
          coef2 = choice([1, 5])
          num1 = coef2 * num1
          den1 = coef2 * den
          coef2 = choice([1, 5], [coef2])
          num2 = coef2 * num2
          den2 = coef2 * den
          coef2 = choice([1, 5])
          num3 = coef2 * num3
          den3 = coef2 * den
          break
      }
      const label1 = lettreIndiceeDepuisChiffre(i * 3 + 1)
      const label2 = lettreIndiceeDepuisChiffre(i * 3 + 2)
      const label3 = lettreIndiceeDepuisChiffre(i * 3 + 3)

      this.goodAnswers[i] = [
        { label: label1, x: arrondi(num1 / den1, 4) },
        { label: label2, x: arrondi(num2 / den2, 4) },
        { label: label3, x: arrondi(num3 / den3, 4) }
      ]

      texte = `Placer les points $${label1}\\left(${fraction(num1, den1).texFraction}\\right)$, $~${label2}\\left(${fraction(num2, den2).texFraction}\\right)$ et $~${label3}\\left(${fraction(num3, den3).texFraction}\\right)$.`
      const { figure, latex } = apigeomGraduatedLine({ xMin: origine, xMax: origine + 4, scale, stepBis: 1 / (coef * den) })
      figure.options.labelAutomaticBeginsWith = label1
      figure.options.pointDescriptionWithCoordinates = false
      this.figures[i] = figure
      const { figure: figureCorr, latex: latexCorr } = apigeomGraduatedLine({ xMin: origine, xMax: origine + 4, scale, stepBis: arrondi(1 / (coef * den), 6), points: this.goodAnswers[i] })
      figureCorr.create('Point', { label: label1, x: arrondi(num1 / den1, 4), color: orangeMathalea, colorLabel: orangeMathalea, shape: 'x', labelDxInPixels: 0 })
      figureCorr.create('Point', { label: label2, x: arrondi(num2 / den2, 4), color: orangeMathalea, colorLabel: orangeMathalea, labelDxInPixels: 0 })
      figureCorr.create('Point', { label: label3, x: arrondi(num3 / den3, 4), color: orangeMathalea, colorLabel: orangeMathalea, labelDxInPixels: 0 })

      switch (true) {
        case context.isHtml && this.interactif:
          texte += '<br>' + figureApigeom({ exercice: this as Exercice, idApigeom: `Ex${this.numeroExercice + ref}Q${i}`, figure })
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
          enonce: 'ici la (ou les) question(s) est(sont) posée(s)',
          enonceAvant: false, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
          enonceAvantUneFois: false, // EE : ce champ est facultatif et permet (si true) d'afficher l'énoncé ci-dessus une seule fois avant la numérotation de la première question de l'exercice. Ne fonctionne correctement que si l'option melange est à false.
          propositions: [
            {
              type: 'AMCOpen', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              propositions: [
                {
                  texte: texteCorr,
                  statut: 3, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                  enonce: texte,
                  sanscadre: true // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                }
              ]
            }
          ]
        }
      }
      if (!isArrayInArray(fractionsUtilisees, [num, den])) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
        fractionsUtilisees[i] = [num, den]
      }
      cpt++
    }

    listeQuestionsToContenu(this)
  }

  correctionInteractive = (i?: number) => {
    if (i === undefined) return ['KO']
    // Sauvegarde de la réponse pour Capytale
    if (this.answers == null) this.answers = {}
    this.answers[`ex${this.numeroExercice + ref}Q${i}`] = this.figures[i].json
    const result: ('OK'|'KO')[] = []
    const figure = this.figures[i]
    figure.isDynamic = false
    figure.divButtons.style.display = 'none'
    figure.divUserMessage.style.display = 'none'
    const goodAnswer = this.goodAnswers[i]
    const divFeedback = document.querySelector(`#feedback${`Ex${this.numeroExercice}Q${i}`}`)
    for (let j = 0; j < goodAnswer.length; j++) {
      const label = goodAnswer[j].label
      const x = goodAnswer[j].x
      const { isValid, points } = figure.checkCoords({ checkOnlyAbscissa: true, label, x, y: 0 })
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
    }
    if (divFeedback != null) {
      if (result[0] === 'OK' && result[1] === 'OK' && result[2] === 'OK') {
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

/**
 * Vérifie la présence d'un tableau dans un tableau de tableau
 * @param {array} arr
 * @param {array} item
 * @returns {boolean}
 */
function isArrayInArray (arr: Array<[number, number]>, item: [number, number]) {
  const itemAsString = JSON.stringify(item)
  const contains = arr.some(function (ele) {
    return JSON.stringify(ele) === itemAsString
  })
  return contains
}

function apigeomGraduatedLine ({ xMin, xMax, scale = 1, points, step = 1, stepBis = 0.25 }: {
  xMin: number,
  xMax: number,
  scale?: number,
  step?: number,
  stepBis?: number,
  points?: Array<{ x: number, label: string }>
}): { figure: Figure, latex: string} {
  const width = 750
  const height = 80
  const figure = new Figure({ xMin: xMin - 0.2 / scale, yMin: -1.5, width, height, dy: 10, dx: stepBis, xScale: 3 * scale, snapGrid: true })
  figure.setToolbar({ tools: ['POINT', 'DRAG', 'REMOVE'], position: 'top' })

  const d = new GraduatedLine(figure, { min: xMin, max: xMax, step, stepBis })
  d.draw()
  let latex = `\n\\bigskip
  \\begin{tikzpicture}[x=2.5mm]
  \\draw[-{Latex[round]},thick] (0,0) -- (61,0);
  \\foreach \\x in {0,${10 * stepBis},...,60} \\draw[thick] ([yshift=-0.8mm]\\x,0) -- ([yshift=0.8mm]\\x,0);
  \\foreach \\x [count=\\i from 0] in {0,10,...,60} \\draw[ultra thick] ([yshift=-1.5mm]\\x,0) coordinate (a\\i) -- ([yshift=1.5mm]\\x,0);
  \\foreach \\x [count=\\i from 0] in {${xMin},${xMin + 1},${xMin + 2},${xMin + 3},${xMin + 4},${xMin + 5},${xMin + 6}} {
    \\node[below=2mm of a\\i,inner sep=0pt,font=\\small] {$\\num{\\x}$};
  }`
  if (points !== undefined) {
    const xA = arrondi((points[0].x - xMin) * 10)
    const xB = arrondi((points[1].x - xMin) * 10)
    const xC = arrondi((points[2].x - xMin) * 10)
    const labelA = points[0].label
    const labelB = points[1].label
    const labelC = points[2].label
    latex += `\n\\tkzText[above=2mm](${xA},0){${labelA}}
    \n\\tkzText[above=2mm](${xB},0){${labelB}}
    \n\\tkzText[above=2mm](${xC},0){${labelC}}
    \n\\tkzDrawPoint[shape=cross out, size=5pt, thick](${xA},0)
    \n\\tkzDrawPoint[shape=cross out, size=5pt, thick](${xB},0)
    \n\\tkzDrawPoint[shape=cross out, size=5pt, thick](${xC},0)`
  }
  latex += '\n\\end{tikzpicture}'

  return { figure, latex }
}

export default PlacerPointsAbscissesFractionnairesBis
