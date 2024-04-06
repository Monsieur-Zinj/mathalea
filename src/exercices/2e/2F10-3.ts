import figureApigeom from '../../lib/figureApigeom'
import Figure from 'apigeom'
import { Droite, droite } from '../../lib/2d/droites.js'
import { TracePoint, point, tracePoint } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { labelPoint, texteParPosition } from '../../lib/2d/textes'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, reduireAxPlusB } from '../../lib/outils/ecritures'
import { pgcd } from '../../lib/outils/primalite'
import { texteGras } from '../../lib/format/style'
import Exercice from '../Exercice'
import { mathalea2d, colorToLatexOrHTML } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { min, max } from 'mathjs'
import { fraction } from '../../modules/fractions'
import { context } from '../../modules/context'

export const titre = 'Représentation graphique d\'une fonction affine'
export const dateDeModifImportante = '06/04/2024'
export const interactifReady = true
export const interactifType = 'custom'

/**
* @author Stéphane Guyon (mise à jour avec les cas Gilles Mora + figure interactive Rémi Angot)
* 2F10-3
*/
export const uuid = 'c360e'
export const ref = '2F10-3'
export const refs = {
  'fr-fr': ['2F10-3'],
  'fr-ch': ['10FA5-15']
}
export default class Representerfonctionaffine extends Exercice {
  figures!: Figure[]
  coefficients!: [number, number][]
  constructor () {
    super()
    this.consigne = 'Représenter graphiquement ' + (this.nbQuestions === 1 || context.isDiaporama ? 'la fonction affine suivante  $f$ définie' : 'les fonctions affines suivantes  $f$ définies') + ' sur $\\mathbb R$ par :'
    this.nbQuestions = 3 // On complète le nb de questions
    this.tailleDiaporama = 3
    this.sup = 1
    this.besoinFormulaireNumerique = ['Types de question ', 3, '1 : Valeurs entières\n2 : Valeurs fractionnaires\n3 : Mélange des deux cas précédents']
  }

  nouvelleVersion (numeroExercice: number) {
    this.figures = []
    this.coefficients = []
    this.sup = parseInt(this.sup)
    this.listeQuestions = []
    this.listeCorrections = []
    let typesDeQuestionsDisponibles: (1|2)[] = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1]
    }
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2]
    }
    if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    const textO = texteParPosition('O', -0.5, -0.5, 0, 'black', 1)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let a: number, b: number, d: number,
        xA: number, yA: number, xB: number, yB: number,
        droiteAB: Droite,
        cadre: { xMin: number, yMin: number, xMax: number, yMax: number },
        monRepere: unknown,
        tA: TracePoint, tB: TracePoint,
        lA: unknown, lB: unknown,
        cadreFenetreSvg: unknown,
        f: (x: number) => number,
        texte, texteCorr: string
      switch (listeTypeDeQuestions[i]) {
        case 1:
          {
            f = (x) => a * x + b
            a = randint(0, 3, [0]) * choice([-1, 1])// coefficient non nul a de la fonction affine
            b = randint(0, 3, [0]) * choice([-1, 1])// ordonnée à l'origine b non nulle de la fonction affine
            this.coefficients[i] = [a, b]
            f = (x) => a * x + b

            xA = 0
            yA = f(xA)
            xB = randint(1, 3) * choice([-1, 1])// Abscisse de B
            yB = f(xB)// Ordonnée de B

            const A = point(xA, yA, 'A')
            const B = point(xB, yB, 'B')
            droiteAB = droite(A, B)
            droiteAB.color = colorToLatexOrHTML('red')
            droiteAB.epaisseur = 2

            cadre = {
              xMin: min(-5, xA - 1, xB - 1),
              yMin: min(-5, yA - 1, yB - 1),
              xMax: max(5, xA + 1, xB + 1),
              yMax: max(5, yA + 1, yB + 1)
            }
            // C'est bizarre mais c'est parce que dans mathAlea, les attributs n'ont pas de majuscules.
            // Donc même quand c'est le même cadre, on doit le faire.
            cadreFenetreSvg = {
              xmin: cadre.xMin,
              ymin: cadre.yMin,
              xmax: cadre.xMax,
              ymax: cadre.yMax,
              scale: 0.6
            }

            monRepere = repere(cadre)

            tA = tracePoint(A, 'red') // Variable qui trace les points avec une croix
            tB = tracePoint(B, 'red') // Variable qui trace les points avec une croix
            lA = labelPoint(A, 'red')// Variable qui trace les nom s A et B
            lB = labelPoint(B, 'red')// Variable qui trace les nom s A et B

            tA.taille = 5
            tA.epaisseur = 2
            tB.taille = 5
            tB.epaisseur = 2

            texte = `$f(x)=${reduireAxPlusB(a, b)}$ <br>`
            if (a !== 0) {
              texteCorr = 'On sait que la représentation graphique d\'une fonction affine est une droite.<br>'
              texteCorr += 'Il suffit donc de déterminer les coordonnées de deux points pour pouvoir représenter $f$.<br>'
              texteCorr += `Comme $f(${xA})=${yA}$, on a  $A(${xA};${yA}) \\in \\mathcal{C_f}$.<br>`
              texteCorr += 'On cherche un deuxième point, et on prend un antécédent au hasard :<br>'
              texteCorr += `Soit $x=${xB}$ :<br>`
              texteCorr += `On calcule : $f(${xB})=${a} \\times ${ecritureParentheseSiNegatif(xB)}${ecritureAlgebrique(b)}=${yB}$.<br>`
              texteCorr += `On en déduit que $B(${xB};${yB}) \\in \\mathcal{C_f}$.<br>`
            } else {
              texteCorr = 'On observe que $f$ est une fonction constante.<br>'
              texteCorr += `Sa représentation graphique est donc une droite parallèle à l'axe des abscisses, d'équation $y=${yA}$.<br>`
            }
            // @ts-expect-error mathalea2d n'est pas typé
            texteCorr += mathalea2d(cadreFenetreSvg,
              lA, lB, monRepere, droiteAB, tA, tB, textO) }
          texteCorr += `<br>${texteGras('Remarque')} : pour tracer la droite, on peut aussi utiliser le coefficient directeur de la droite ($${a}$) et son ordonnée à l'origine ($${b}$).<br>`
          break

        case 2: // cas du coefficient directeur fractionnaire
          { a = randint(-5, 5, [0]) // numérateur coefficient directeur non nul
            b = randint(-5, 5, [0]) // ordonnée à l'origine non nulle
            d = randint(2, 5) // dénominateur coefficient directeur non multiple du numérateur pour éviter nombre entier
            while (pgcd(a, d) !== 1) {
              a = randint(-5, 5, [0]) // numérateur coefficient directeur non nul
              b = randint(-5, 5, [0]) // ordonnée à l'origine non nulle
              d = randint(2, 5)
            }
            f = (x) => a / d * x + b
            this.coefficients[i] = [a / d, b]
            xA = 0 // Abscisse de A
            yA = f(xA)// Ordonnée de A
            xB = d
            yB = f(xB)

            const A1 = point(xA, yA, 'A')
            const B1 = point(xB, yB, 'B')
            droiteAB = droite(A1, B1)
            droiteAB.color = colorToLatexOrHTML('red')
            droiteAB.epaisseur = 2

            cadre = {
              xMin: min(-5, xA - 1, xB - 1),
              yMin: min(-5, yA - 1, yB - 1),
              xMax: max(5, xA + 1, xB + 1),
              yMax: max(5, yA + 1, yB + 1)
            }

            cadreFenetreSvg = {
              xmin: cadre.xMin,
              ymin: cadre.yMin,
              xmax: cadre.xMax,
              ymax: cadre.yMax,
              scale: 0.6
            }

            texte = `$f(x)=${texFractionReduite(a, d)}x ${ecritureAlgebrique(b)}$ <br>`

            texteCorr = 'On sait que la représentation graphique d\'une fonction affine est une droite.<br>'
            texteCorr += 'Il suffit donc de déterminer les coordonnées de deux points pour pouvoir représenter $f$.<br>'
            texteCorr += `Comme $f(${xA})=${yA}$, on a : $A(${xA};${yA}) \\in \\mathcal{C_f}$.<br>`
            texteCorr += 'On cherche un deuxième point, et on prend un antécédent qui facilite les calculs :<br>'
            texteCorr += `Par exemple $x=${xB}$ :<br>`
            texteCorr += `On calcule : $f(${xB})=${texFractionReduite(a, d)} \\times ${ecritureParentheseSiNegatif(xB)}${ecritureAlgebrique(b)}=${yB}$.<br>`
            texteCorr += `On en déduit que $B(${xB};${yB}) \\in \\mathcal{C_f}$.<br>`

            tA = tracePoint(A1, 'red') // Variable qui trace les points avec une croix
            lA = labelPoint(A1, 'red')// Variable qui trace les nom s A et B
            tB = tracePoint(B1, 'red') // Variable qui trace les points avec une croix
            lB = labelPoint(B1, 'red')// Variable qui trace les nom s A et B

            monRepere = repere(cadre)// On définit le repère
            texteCorr += mathalea2d(
              // @ts-expect-error mathalea2d n'est pas typé
              cadreFenetreSvg,
              monRepere, droiteAB, tA, lA, tB, lB, textO)
            // On trace le graphique
            texteCorr += `<br>${texteGras('Remarque')} : pour tracer la droite, on peut aussi utiliser le coefficient directeur de la droite ($${texFractionReduite(a, d)}$) et son ordonnée à l'origine ($${b}$).<br>`
          }
          break
      }

      if (this.interactif) {
        const figure = new Figure({ xMin: -5, yMin: -5, width: 300, height: 300 })
        this.figures[i] = figure
        figure.setToolbar({ tools: ['POINT', 'LINE', 'DRAG', 'REMOVE'], position: 'top' })
        figure.create('Grid')
        figure.options.color = 'blue'
        figure.options.thickness = 2
        figure.snapGrid = true
        const idApigeom = `apigeomEx${numeroExercice}F${i}`
        texte += figureApigeom({ exercice: this, idApigeom, figure, question: i })
        if (figure.ui) figure.ui.send('LINE')
      }

      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  correctionInteractive = (i?: number) => {
    if (i === undefined) return 'KO'
    let result: 'OK'|'KO' = 'KO'
    const figure = this.figures[i]
    if (this.answers == null) this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[`#apigeomEx${this.numeroExercice}F${i}`] = figure.json
    figure.isDynamic = false
    figure.divButtons.style.display = 'none'
    figure.divUserMessage.style.display = 'none'
    const lines = [...figure.elements.values()].filter(e => e.type.includes('Line'))
    const [a, b] = this.coefficients[i]
    const point1 = { x: 0, y: b }
    const point2 = { x: 1, y: a + b }
    const { isValid } = figure.checkLine({ point1, point2 })
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`)
    if (divFeedback != null) {
      if (isValid && lines.length === 1) {
        divFeedback.innerHTML = '😎'
        result = 'OK'
      } else {
        const p = document.createElement('p')
        p.innerText = '☹️'
        if (lines.length === 0) {
          p.innerHTML += ' Aucune droite n\'a été tracée.'
        } else if (lines.length > 1) {
          p.innerHTML += ' Il ne faut tracer qu\'une seule droite.'
        }
        divFeedback.insertBefore(p, divFeedback.firstChild)
      }
    }
    return result
  }
}

function texFractionReduite (a: number, b: number) {
  const frac = fraction(a, b)
  return frac.simplifie().toLatex()
}
