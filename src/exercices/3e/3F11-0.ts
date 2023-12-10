import Exercice from '../ExerciceTs'

import { context } from '../../modules/context'
import figureApigeom from '../../lib/figureApigeom'
import { Spline, noeudsSplineAleatoire, modifieNoeuds } from '../../lib/mathFonctions/Spline'
import PointOnSpline from '../../lib/mathFonctions/SplineApiGeom'
import type Point from 'apigeom/src/elements/points/Point'
import { randint } from '../../modules/outils'
import { cherchePolynomeDegre3aExtremaFixes } from '../../modules/debarras/cherchePolynomeDegre3aExtremaFixes'
import Figure from 'apigeom'
import { choice } from '../../lib/outils/arrayOutils'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { antecedentParDichotomie, courbe } from '../../lib/2d/courbes'
import { point } from '../../lib/2d/points'
import { droite } from '../../lib/2d/droites'
import { inferieurSuperieur } from '../../lib/mathFonctions/etudeFonction'
import { texNombre } from '../../lib/outils/texNombre'
import { miseEnEvidence } from '../../lib/outils/embellissements'

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
const typesDeFonction:TypesDeFonction[] = ['constante', 'affine', 'poly2', 'poly3', 'spline']

function choisisFonction (type: TypesDeFonction, noeudsPassants: {x:number, y:number}[]): {func: (x:number)=>number, expr: string|Spline} {
  let { x: x1, y: y1 } = noeudsPassants[0]
  let { x: x2, y: y2 } = noeudsPassants[1]

  switch (type) {
    case 'constante': {
      return { func: () => y1, expr: `${y1}` }
    }
    case 'affine':{
      if (x1 - x2 === 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        window.notify('Un problème avec le choix de noeuds passants : droite verticale ???')
      }
      let a = (y1 - y2) / (x1 - x2)
      let b = y1 - a * x1
      while (Math.abs(a) > 2) {
        y2 = (y1 + y2) / 2
        a = (y1 - y2) / (x1 - x2)
        b = y1 - a * x1
      }
      noeudsPassants[1].y = y2 // On modifie noeudsPassants pour la prochaine fonction
      return { func: (x:number) => a * x + b, expr: `${a}*x+${b}` }
    }
    case 'poly2': {
      console.log(`x1=${x1}, x2=${x2}, y1=${y1}, y2=${y2}`)
      if (x1 === 0) x1 = randint(-4, -1)
      if (x2 === 0) x2 = randint(1, 4)
      if (x1 === x2) x2 = randint(-4, 4, x2)
      if (y1 / x1 === y2 / x2) y2 = randint(-3, 3, y2)
      const func:(x:number)=>number = (x:number) => x * ((x - x1) * y2 / x2 - (x - x2) * y1 / x1) / (x2 - x1)
      const expr: string = `x*((x-${x1})*${y2}/${x2}-(x-${x2})*${y1}/${x1})/(${x2}-${x1})`
      return { func, expr }
    }
    case 'poly3': {
      let y1bis = y1; let y2bis = y2
      while ((y1bis - y2bis) ** 2 < 16) {
        y1bis = Math.max(Math.min(y1bis, y2bis) - 1, -5)
        y2bis = Math.min(Math.max(y1bis, y2bis) + 1, 5)
      }
      noeudsPassants = [{ x: x1, y: y1bis }, { x: x2, y: y2bis }]
      const [a, b, c, d] = cherchePolynomeDegre3aExtremaFixes(x1, x2, y1bis, y2bis)
      return { func: (x: number) => a.valueOf() * x ** 3 + b.valueOf() * x ** 2 + c.valueOf() * x + d.valueOf(), expr: `${a.valueOf()}*x^3+${b.valueOf()}*x^2+${c.valueOf()}*x+${d.valueOf()}` }
    }
    case 'spline':{
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
    }
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
    this.sup2 = 2
    this.sup3 = 3
    this.sup = 1
    this.besoinFormulaireNumerique = ['Choix des questions', 3, '1 : Résoudre une équation\n2 : Résoudre une inéquation\n3: Résoudre une équation et une inéquation']
    this.besoinFormulaire2Numerique = ['Choix de la première fonction', 6, '1 : Constante\n2 :Affine\n3 : Polynome de degré 2\n4 : Polynome de degré 3\n5 : Spline aléatoire\n6 : Au hasard']
    this.besoinFormulaire3Numerique = ['Choix de la deuxième fonction', 6, '1 : Constante\n2 :Affine\n3 : Polynome de degré 2\n4 : Polynome de degré 3\n5 : Spline aléatoire\n6 : Au hasard']
  }

  nouvelleVersion (numeroExercice: number): void {
    // on va chercher une spline aléatoire
    this.figure = new Figure({ xMin: -5.2, yMin: -6.3, width: 312, height: 378 })
    this.figure.create('Grid')
    this.figure.options.limitNumberOfElement.set('Point', 1)
    this.listeQuestions = []
    this.listeCorrections = ['']
    this.autoCorrection = []
    const typeFonctions = [
      typesDeFonction[(this.sup2 === 6 ? randint(1, 5) : this.sup2) - 1],
      typesDeFonction[(this.sup3 === 6 ? randint(1, 5) : this.sup3) - 1]
    ]
    let noeudsPassant: {x:number, y:number}[]
    do {
      noeudsPassant = []
      const x = []
      const y = []
      for (let i = 0; i < 2; i++) {
        const xi: number = randint(-2, 2, x) * 2
        x.push(xi)
        const yi: number = randint(-4, 4, y)
        y.push(yi)
        noeudsPassant.push({ x: xi, y: yi })
      }
    } while ((noeudsPassant[0].x - noeudsPassant[1].x) ** 2 < 16) // Il faut au moins 4 d'écart entre les deux noeuds passants
    let courbeF
    let M

    // on s'occupe de la fonction 1 et du point mobile dessus on trace tout ça.
    const fonction1 = choisisFonction(typeFonctions[0], noeudsPassant)
    if (typeof fonction1.expr === 'string') {
      courbeF = this.figure.create('Graph', { expression: fonction1.expr, color: 'blue', thickness: 2 })
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
      M = new PointOnSpline(this.figure, { spline: courbeF, x: 1, dx: 0.1, abscissa: true, ordinate: true, isVisible: true, shape: 'x', color: 'blue', size: 3, thickness: 3 })
      // M.draw()
      M.label = 'M'
      M.createSegmentToAxeX()
      M.createSegmentToAxeY()
      const textX = this.figure.create('DynamicX', { point: M })
      const textY = this.figure.create('DynamicY', { point: M })
      textX.dynamicText.maximumFractionDigits = 2
      textY.dynamicText.maximumFractionDigits = 1
    }
    // fonction 1 Ok, maintenant la fonction 2
    let fonction2: {func: (x:number)=>number, expr: string|Spline}
    // Si c'est le même type, il ne faut pas retomber sur la même fonction, donc on change l'un des noeuds passant au moins
    if (typeFonctions[0] === typeFonctions[1]) {
      if (typeFonctions[1] === 'constante') {
        noeudsPassant[0].y = randint(-5, 5, noeudsPassant[0].y)
        fonction2 = choisisFonction('constante', noeudsPassant)
      } else if (typeFonctions[1] === 'affine') { // Pour les droites
        noeudsPassant[1].y = -noeudsPassant[1].y
        fonction2 = choisisFonction('affine', noeudsPassant)
      } else if (typeFonctions[1] === 'poly2') {
        fonction2 = { func: (x: number) => -fonction1.func(x), expr: `-${fonction1.expr}` }
      } else if (typeFonctions[1] === 'poly3') { // Pour les polynomes
        const yInter = Math.min(6, Math.max(noeudsPassant[1].y + randint(-2, 2), -6))
        noeudsPassant[1].y = noeudsPassant[0].y
        noeudsPassant[0].y = yInter
        const xInter = Math.min(6, Math.min(noeudsPassant[1].x + randint(-1, 1), -6))
        noeudsPassant[1].x = noeudsPassant[0].x
        noeudsPassant[0].x = xInter
        fonction2 = choisisFonction('poly3', noeudsPassant)
      } else { // Pour les splines, on modifie l'ensemble des noeuds de la fonction1 avec une symétrie horizontale et un échange de 2 noeuds
        const spline2 = fonction1.expr as Spline
        if (spline2.noeuds == null) throw Error('Pas de noeuds dans une spline ??? ça n\'arrive jamais !')
        const spline2Bis = new Spline(modifieNoeuds(spline2.noeuds, { symetrieH: true, echangeNoeuds: 2 }))
        fonction2 = { func: spline2Bis.fonction, expr: spline2Bis }
      }
    } else {
      fonction2 = choisisFonction(typeFonctions[1], noeudsPassant)
    }
    // Fonction 2 Ok On trace sa courbe
    let courbeG
    if (typeof fonction2.expr === 'string') {
      courbeG = this.figure.create('Graph', { expression: fonction2.expr, color: 'red', thickness: 2 })
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
          this.figure.create('Polyline', { points: mesPointsApiGeomG, color: 'red', thickness: 2 })
        }
      }
    }
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    // De -6.3 à 6.3 donc width = 12.6 * 30 = 378

    let enonce = ''
    let numero = 1
    const diff = (x:number) => fonction1.func(x) - fonction2.func(x)
    const inferieur = choice([true, false])
    if (this.sup === 1 || this.sup === 3) {
      enonce = `${numero}. Résoudre graphiquement $f(x)${miseEnEvidence('=', 'black')}g(x)$.<br>`
      numero++
      const soluces: Set<string> = new Set()
      for (let x0 = -5.2; x0 < 5.3; x0 += 0.2) {
        const sol = antecedentParDichotomie(x0, x0 + 0.199, diff, 0, 0.05)
        if (!sol) continue
        if (typeof sol === 'number') {
          soluces.add(texNombre(sol, 1))
        }
      }
      enonce += '$\\{' + Array.from(soluces).join(' ; ') + '\\}$<br>'
    }

    if (this.sup === 2 || this.sup === 3) {
      enonce += `${numero}. Résoudre graphiquement $f(x)${inferieur ? miseEnEvidence('<', 'black') : miseEnEvidence('>', 'black')}g(x)$.`
    }
    if (this.sup === 2 || this.sup === 3) {
      const solutions = inferieurSuperieur(diff, 0, -6, 6, inferieur, false, { step: 0.1 })
      enonce += '<br>$' + solutions.map(el => el.borneG.x !== el.borneD.x
        ? `[${texNombre(Number(el.borneG.x), 1)};${texNombre(Number(el.borneD.x), 1)}]`
        : `\\{${texNombre(Number(el.borneG.x), 1)}\\}`
      ).join('\\cup') + '$'
    }

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
      if (typeFonctions[0] === 'constante' || typeFonctions[0] === 'affine') {
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
      if (typeFonctions[2] === 'constante' || typeFonctions[2] === 'affine') {
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
