import Exercice from '../ExerciceTs'

import { context } from '../../modules/context'
import figureApigeom from '../../lib/figureApigeom'
import { Spline, noeudsSplineAleatoire } from '../../lib/mathFonctions/Spline'
import PointOnSpline from '../../lib/mathFonctions/SplineApiGeom'
import type Point from 'apigeom/src/elements/points/Point'
import { randint } from '../../modules/outils'
import Figure from 'apigeom'
import { choice, shuffle } from '../../lib/outils/arrayOutils'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { courbe } from '../../lib/2d/courbes'
import { point } from '../../lib/2d/points'
import { droite } from '../../lib/2d/droites'
import { texNombre } from '../../lib/outils/texNombre'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { Polynome } from '../../lib/mathFonctions/Polynome'
import { polynomialRoot } from 'mathjs'
import { interpolationDeLagrange } from '../../lib/mathFonctions/outilsMaths'
// à remplacer par l'instance présente dans le fichier comparaisonFonctions.ts quand il sera en ligne/
import { ComputeEngine } from '@cortex-js/compute-engine'
const engine = new ComputeEngine()
export const titre = 'Résoudre graphiquement une équation ou une inéquation'
export const dateDePublication = '29/10/2023'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Résoudre graphiquement une équation ou une inéquation
 * @author Jean-Claude Lhote
 * Références
 */
export const uuid = '28997'

type TypesDeFonction = 'constante'|'affine'|'poly2'|'poly3'|'spline'
function compareEnsembles (e1:string, e2:string) {
  const cleanUp = (s:string) => s.replace('{,}', '.').replace(',', '.')
  const elements1 = cleanUp(e1).split(';')
  const elements2 = cleanUp(e2).split(';')
  if (elements1.length !== elements2.length) return false
  let ok = true
  for (let i = 0; i < elements1.length; i++) {
    if (Math.abs(Number(elements1[i].replace(',', '.')) - Number(elements2[i].replace(',', '.'))) > 0.1) {
      ok = false
      break
    }
  }
  return ok
}

function choisisFonction (type: TypesDeFonction, noeudsPassants: {x:number, y:number}[]): {func: (x:number)=>number, expr: string|Spline, poly?: Polynome} {
  if (type === 'spline') {
    const noeudsF = noeudsSplineAleatoire(8, true, -6, randint(-4, 4), 2)
    for (const noeudPassant of noeudsPassants) {
      for (let i = 0; i < noeudsF.length; i++) {
        if (noeudPassant.x === noeudsF[i].x) {
          noeudsF[i].y = noeudPassant.y
          break
        }
      }
    }
    const splineF = new Spline(noeudsF)
    return { func: splineF.fonction, expr: splineF }
  } else {
    let noeudsFonction
    switch (type) {
      case 'affine':
        if (noeudsPassants[0].x - noeudsPassants[1].x === 0) {
          throw Error('Un problème avec le choix de noeuds passants : droite verticale ???')
        }
        if (noeudsPassants.length < 2) {
          throw Error('Un problème pas deux points pour une affine')
        }
        noeudsFonction = noeudsPassants.slice(0, 2)
        break
      case 'poly2':
        // Pour un polynome de degré 2, il faut trois points sinon, c'est une droite
        if (noeudsPassants.length < 3) {
          throw Error('Un problème pas 3 noeuds pour un poly2')
        }
        noeudsFonction = noeudsPassants.slice(0, 3)
        break
      case 'poly3':
        // Pour un polynome de degré 3, il faut quatre points sinon, c'est un poly2
        if (noeudsPassants.length < 4) {
          throw Error('Un problème pas 4 noeuds pour un poly3')
        }
        noeudsFonction = noeudsPassants.slice(0, 4)
        break
      case 'constante':
      default:
        if (noeudsPassants.length < 1) {
          throw Error('Un problème il faut au moins un noeud !')
        }
        return {
          func: () => noeudsPassants[0].y,
          expr: `${noeudsPassants[0].y}`,
          poly: new Polynome({ rand: false, deg: 3, coeffs: [noeudsPassants[0].y, 0, 0, 0] })
        }
    }
    if (noeudsFonction == null) {
      // si on arrive là, c'est qu'on a un truc inconnu
      throw Error('type de fonction inconnu')
    }
    const poly = interpolationDeLagrange(noeudsFonction)
    if (poly.deg < 3) {
      const monomes = poly.monomes
      for (let i = monomes.length - 1; i < 4; i++) {
        monomes.push(0)
      }
      poly.monomes = [...monomes]
      poly.deg = 3
    }
    const polyLatex = poly.toLatex().replaceAll(/\s/g, '').replaceAll(',', '.')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const func:(x:number)=>number = engine.parse(polyLatex).compile('javascript')
    const expr: string = poly.toMathExpr()
    return { func, expr, poly }
  }
}

class resolutionEquationInequationGraphique extends Exercice {
  // On déclare des propriétés supplémentaires pour cet exercice afin de pouvoir les réutiliser dans la correction
  figure!: Figure
  idApigeom!: string
  constructor () {
    super()
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    // Pour un exercice de type simple qui n'utilise pas le champ de réponse
    this.formatChampTexte = 'largeur15 inline'
    this.exoCustomResultat = true
    this.answers = {}
    this.sup2 = 5
    this.sup = 1
    this.besoinFormulaireNumerique = ['Choix des questions', 3, '1 : Résoudre une équation\n2 : Résoudre une inéquation\n3: Résoudre une équation et une inéquation']
    this.besoinFormulaire2Numerique = ['Choix des deux fonctions', 13,
      '1 : Constante-affine\nConstante-degré2\nConstante-degré3\nConstante-spline\nAffine-affine\nAffine-degré2\nAffine-degré3\nAffine-spline\nDegré2-degré2\nDegré2-degré3\nDegré2-spline\nDegré3-degré3\nDegré3-spline']
  }

  nouvelleVersion (numeroExercice: number): void {
    // on va chercher une spline aléatoire
    this.figure = new Figure({ xMin: -5.2, yMin: -6.3, width: 312, height: 378 })
    this.figure.create('Grid')
    this.figure.options.limitNumberOfElement.set('Point', 1)
    this.listeQuestions = []
    this.listeCorrections = ['']
    this.autoCorrection = []

    const x0 = randint(-5, -3)
    const x1 = randint(-2, 0)
    const y0 = randint(-3, 3)
    const y1 = randint(-3, 0, y0)
    const x2 = randint(1, 3, [x0, x1])
    const y2 = randint(0, 3, [y0, y1])
    const x3 = randint(4, 5, [x0, x1, x2])
    const y3 = randint(-1, 3, [y0, y1, y2])
    const noeudsPassant = [{ x: x0, y: y0 }, { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }].sort((el1, el2) => el1.x - el2.x)
    let f1Type: TypesDeFonction
    let f2Type: TypesDeFonction
    switch (this.sup2) { // On choisit les fonctions demandées
      case 1 : // constante et affine
        f1Type = 'constante'
        f2Type = 'affine'
        break
      case 2 : // constante et degré2
        f1Type = 'constante'
        f2Type = 'poly2'
        break
      case 3 : // constante et degré3
        f1Type = 'constante'
        f2Type = 'poly3'
        break
      case 4 : // constante et spline
        f1Type = 'constante'
        f2Type = 'spline'
        break
      case 6 : // affine et degré2
        f1Type = 'poly2'
        f2Type = 'affine'
        break
      case 7 : // affine et degré3
        f1Type = 'poly3'
        f2Type = 'affine'
        break
      case 8 : // affine et spline
        f1Type = 'spline'
        f2Type = 'affine'
        break
      case 9 : // degré2 et degré2
        f1Type = 'poly2'
        f2Type = 'poly2'
        break
      case 10 : // degré2 et degré3
        f1Type = 'poly2'
        f2Type = 'poly3'
        break
      case 11 : // degré2 et spline
        f1Type = 'poly2'
        f2Type = 'spline'
        break
      case 12 : // degré3 et degré3
        f1Type = 'poly3'
        f2Type = 'poly3'
        break
      case 13 : // degré3 et spline
        f1Type = 'poly3'
        f2Type = 'spline'
        break
      default: // affine et affine (c'est le this.sup par défaut)
        f1Type = 'affine'
        f2Type = 'affine'
        break
    }
    let fonctions
    if (f1Type !== f2Type) {
      fonctions = [choisisFonction(f1Type, noeudsPassant), choisisFonction(f2Type, noeudsPassant)]
    } else { // on a un problème par ce que les noeuds passants étant identiques, les deux fonctions seront identiques !
      const ordonnees = noeudsPassant.map(el => el.y)
      let newY: number
      do {
        newY = randint(-5, 5, ordonnees)
      } while (newY * noeudsPassant[1].y > 0)
      const newNoeudsPassants = []
      newNoeudsPassants.push(noeudsPassant[0])
      newNoeudsPassants.push({ x: noeudsPassant[1].x, y: newY })
      newNoeudsPassants.push(...noeudsPassant.slice(2, 4))
      fonctions = [choisisFonction(f1Type, noeudsPassant), choisisFonction(f2Type, newNoeudsPassants)]
    }
    const [fonction1, fonction2] = shuffle(fonctions)
    let courbeF
    let M

    // on s'occupe de la fonction 1 et du point mobile dessus on trace tout ça.
    if (typeof fonction1.expr === 'string') {
      courbeF = this.figure.create('Graph', { expression: fonction1.expr, color: 'blue', thickness: 1, fillOpacity: 0.5 })
      M = this.figure.create('PointOnGraph', { graph: courbeF })
      // M.draw()
      M.label = 'M'
      M.createSegmentToAxeX()
      M.createSegmentToAxeY()
      const textX = this.figure.create('DynamicX', { point: M })
      const textY = this.figure.create('DynamicY', { point: M })
      textX.dynamicText.maximumFractionDigits = 2
      textY.dynamicText.maximumFractionDigits = 1
    } else {
      courbeF = fonction1.expr as Spline
      const mesPointsF = courbeF.pointsOfSpline(96)
      let mesPointsApiGeomF: Point[]
      if (mesPointsF && Array.isArray(mesPointsF)) {
        mesPointsApiGeomF = mesPointsF.map(el => this.figure.create('Point', {
          x: el.x,
          y: el.y,
          // sizeInPixels: coordEntieres(el.x, el.y) ? 2 : 0,
          isVisible: false // coordEntieres(el.x, el.y),
          // shape: coordEntieres(el.x, el.y) ? 'o' : 'x'
        }))
        if (mesPointsApiGeomF !== undefined) {
          this.figure.create('Polyline', { points: mesPointsApiGeomF, color: 'blue', thickness: 2 })
        }
      }
      M = new PointOnSpline(this.figure, { spline: courbeF, x: 1, dx: 0.1, abscissa: true, ordinate: true, isVisible: true, shape: 'x', color: 'blue', size: 3, thickness: 1 })
      M.draw()
      M.label = 'M'
      M.createSegmentToAxeX()
      M.createSegmentToAxeY()
      const textX = this.figure.create('DynamicX', { point: M })
      const textY = this.figure.create('DynamicY', { point: M })
      textX.dynamicText.maximumFractionDigits = 2
      textY.dynamicText.maximumFractionDigits = 1
    }
    let courbeG
    if (typeof fonction2.expr === 'string') {
      courbeG = this.figure.create('Graph', { expression: fonction2.expr, color: 'red', thickness: 1, fillOpacity: 0.5 })
    } else {
      courbeG = fonction2.expr as Spline
      const mesPointsG = courbeG.pointsOfSpline(96)
      let mesPointsApiGeomG: Point[]
      if (mesPointsG && Array.isArray(mesPointsG)) {
        mesPointsApiGeomG = mesPointsG.map(el => this.figure.create('Point', {
          x: el.x,
          y: el.y,
          // sizeInPixels: coordEntieres(el.x, el.y) ? 2 : 0,
          isVisible: false // coordEntieres(el.x, el.y),
          // shape: coordEntieres(el.x, el.y) ? 'o' : 'x'
        }))
        if (mesPointsApiGeomG !== undefined) {
          this.figure.create('Polyline', { points: mesPointsApiGeomG, color: 'red', thickness: 1, fillOpacity: 0.5 })
        }
      }
    }
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    // De -6.3 à 6.3 donc width = 12.6 * 30 = 378

    let enonce = ''
    let numero = 1
    // let diff
    let diffSpline
    let soluces
    const inferieur = choice([true, false])
    if (fonction1.type === 'spline' && fonction2.type === 'spline') {
      const func1 = fonction1.expr as Spline
      const func2 = fonction2.expr as Spline
      diffSpline = func1.add(func2, true)
      if (this.sup === 1 || this.sup === 3) {
        soluces = new Set(diffSpline.solve(0))
        enonce += '$\\{' + Array.from(soluces).sort((a:number, b:number) => a - b).map(el => texNombre(el, 1)).join(' ; ') + '\\}$<br>'
        //  diff = diffSpline.fonction
      }
    } else if (fonction1.type === 'spline' || fonction2.type === 'spline') {
      // On a déjà éliminé le cas des 2 Splines ici on traite le cas une Spline et un polynome.
      let spline: Spline
      let poly: Polynome
      const sols: number[] = []
      if (fonction1.type === 'spline') {
        spline = fonction1.expr as Spline
        poly = fonction2.poly as Polynome
      } else {
        spline = fonction2.expr as Spline
        poly = fonction1.poly as Polynome
      }
      if (spline != null && poly != null) {
        const X = spline.x
        if (X != null) {
          const n: number = (spline.n ?? 6) - 1
          for (let i = 0; i < n; i++) {
            const diffPoly = spline.polys[i].add(poly.multiply(-1))
            const [a, b, c, d] = diffPoly.monomes
            const racines = polynomialRoot(a.valueOf(), b.valueOf(), c.valueOf(), d.valueOf())
            const racinesReelles = racines.filter(el => typeof el === 'number')
              .map((el) => typeof el === 'number' ? el : el.toPolar().r)
              .map(el => Number(el.toFixed(1)))
              .filter(el => el >= X[i] && el <= X[i + 1] && el <= 5.3 && el >= -5.3 && Math.abs(spline.fonction(el)) <= 6.2)
            sols.push(...racinesReelles)
          }
          const solsUniques = new Set(sols)
          soluces = Array.from(solsUniques).sort((a: number, b: number) => a - b)
          enonce += '$\\{' + soluces.map(el => texNombre(el, 1)).join(' ; ') + '\\}$<br>'
          soluces = new Set(soluces)
        }
      }
    } else { // ici, c'est deux polynomes !
      if (fonction1.poly != null && fonction2.poly != null) {
        const polyDiff = fonction1.poly.add(fonction2.poly.multiply(-1))
        const [a, b, c, d] = polyDiff.monomes
        const racines = polynomialRoot(a.valueOf(), b.valueOf(), c.valueOf(), d.valueOf())
        soluces = racines.filter(el => typeof el === 'number')
          .map((el) => typeof el === 'number' ? el : el.toPolar().r)
          .map(el => Number(el.toFixed(1)))
          .filter(el => Math.abs(el) <= 5.3 && Math.abs(fonction1.func(el)) <= 6.2)

        if (this.sup === 1 || this.sup === 3) {
          enonce = `${numero}. Résoudre graphiquement $f(x)${miseEnEvidence('=', 'black')}g(x)$.<br>`
          numero++
        }
        soluces = soluces.sort((a: number, b: number) => a - b)
        enonce += '$\\{' + soluces.map(el => texNombre(el, 1)).join(' ; ') + '\\}$<br>'
        soluces = new Set(soluces)
      }
    }
    if (soluces != null) {
      if (this.sup === 1 || this.sup === 3) {
        enonce += remplisLesBlancs(this, 0, '\\{%{soluces}\\}', 'inline college6e', '.......') + '<br>' // '$\\{' + Array.from(soluces).join(' ; ') + '\\}$'//
        setReponse(this, 0, { soluces: { value: Array.from(soluces).join(' ; '), compare: compareEnsembles } }, { formatInteractif: 'fillInTheBlank' })
      }
    }

    if (this.sup === 2 || this.sup === 3) {
      enonce += `${numero}. Résoudre graphiquement $f(x)${inferieur ? miseEnEvidence('<', 'black') : miseEnEvidence('>', 'black')}g(x)$.`
    }
    /*
    if (this.sup === 2 || this.sup === 3) {
      const solutions = inferieurSuperieur(diff, 0, -6, 6, inferieur, false, { step: 0.1 })
      enonce += '<br>$' + solutions.map(el => el.borneG.x !== el.borneD.x
        ? `[${texNombre(Number(el.borneG.x), 1)};${texNombre(Number(el.borneD.x), 1)}]`
        : `\\{${texNombre(Number(el.borneG.x), 1)}\\}`
      ).join('\\cup') + '$'
    }
*/
    this.figure.setToolbar({ tools: ['DRAG'], position: 'top' })
    if (this.figure.ui) this.figure.ui.send('DRAG')
    // Il est impératif de choisir les boutons avant d'utiliser figureApigeom
    const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure: this.figure })
    this.figure.isDynamic = true
    this.figure.divButtons.style.display = 'flex'
    if (context.isHtml) {
      this.listeQuestions = [enonce + emplacementPourFigure]
    } else {
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
      let courbe1, courbe2
      if (fonction1.type === 'constante' || fonction1.type === 'affine') {
        const M = point(-6, fonction1.func(-6), '')
        const N = point(6, fonction1.func(6), '')
        courbe1 = droite(M, N)
      } else {
        courbe1 = courbe(fonction1.func, { repere })
      }
      courbe1.color = colorToLatexOrHTML('blue')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      courbe1.epaisseur = 2
      if (fonction2.type === 'constante' || fonction2.type === 'affine') {
        const M = point(-6, fonction2.func(-6), '')
        const N = point(6, fonction2.func(6), '')
        courbe2 = droite(M, N)
      } else {
        courbe2 = courbe(fonction2.func, { repere })
      }
      courbe1.color = colorToLatexOrHTML('blue')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      courbe1.epaisseur = 2
      const courbes = [courbe1, courbe2]
      this.listeQuestions = [enonce + mathalea2d(Object.assign({}, fixeBordures([...repere.objets, ...courbes])))]
    }
    /*
     */
  }

  correctionInteractive = () => {
    this.answers = {}
    /*
    const tableId = `tabMathliveEx${this.numeroExercice}Q${0}`
    const tableau = document.querySelector(`table#${tableId}`)
    if (tableau == null) throw Error('La correction de 3F10-4 n\'a pas trouvé le tableau interactif.')
    const result: string[] = []
    for (let k = 0; k < this.nbImages; k++) {
      const answer: MathfieldElement = tableau.querySelector(`math-field#champTexteEx${this.numeroExercice}Q0L1C${k + 1}`) as MathfieldElement
      if (answer == null) throw Error(`Il n'y a pas de math-field d'id champTexteEx${this.numeroExercice}QOL1C${k + 1} dans ce tableau !`)
      const valeur = Number(answer.value.replace(',', '.').replace(/\((\+?-?\d+)\)/, '$1'))
      if (valeur) this.answers[`Ex${this.numeroExercice}Q0L1C${k + 1}`] = String(valeur)
      const divFeedback = tableau.querySelector(`div#divDuSmileyEx${this.numeroExercice}Q0L1C${k + 1}`)
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
*/
    return 'OK'
  }
}

export default resolutionEquationInequationGraphique
