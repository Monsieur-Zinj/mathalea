import Exercice from '../ExerciceTs'

import { context } from '../../modules/context'
import figureApigeom from '../../lib/figureApigeom'
import { randint } from '../../modules/outils'
import Figure from 'apigeom'
import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
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
import { interpolationDeLagrange } from '../../lib/mathFonctions/outilsMaths'
import { rangeMinMax } from '../../lib/outils/nombres'
import { lettreMinusculeDepuisChiffre } from '../../lib/outils/outilString'
import { pgcd } from '../../lib/outils/primalite'
import Point from 'apigeom/src/elements/points/Point'

export const titre = 'Résoudre graphiquement une équation ou une inéquation'
export const dateDePublication = '29/10/2023'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Résoudre graphiquement une équation ou une inéquation
 *
 * @author Jean-Claude Lhote
 * Références
 */
export const uuid = '28997'
export const ref = '3F11-0'
export const dateDeCreation = '29/12/2023'

type TypesDeFonction = 'constante'|'affine'|'poly2'|'poly3'
function compareEnsembles (e1:string, e2:string) {
  const cleanUp = (s:string) => s.replace('{.}', '.').replace(',', '.')
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

/**
 * La fonction pour récupérer les intervalles de solutions
 * @param fonc
 * @param inferieur
 */
function chercheIntervalles (fonc: Polynome, soluces: number[], inferieur: boolean): string {
  const values = [...soluces, 5]
  const solutions: string[] = []
  for (let i = 0; i < values.length - 1; i++) {
    const middle = (values[i] + values[i + 1]) / 2
    if ((inferieur && fonc.image((middle) < 0)) || (!inferieur && fonc.image(middle) > 0)) {
      solutions.push(`[${texNombre(values[i], 1)};${texNombre(values[i + 1], 1)}]`)
    }
  }
  return solutions.join('\\cup')
}
/**
 * La fonction de comparaison des intervalles pour l'interactif
 * @param e1
 * @param e2
 */
function compareIntervalles (e1:string, e2:string) {
  let result = true
  const cleanUp = (s:string) => s.replaceAll('{,}', '.').replaceAll(',', '.')
  e1 = cleanUp(e1)
  e2 = cleanUp(e2)
  const intervallesSaisie = e1.match(/\[-?\d.?\d?;-?\d.?\d?]/g)
  const intervallesReponse = e2.match(/\[-?\d.?\d?;-?\d.?\d?]/g)
  if (intervallesReponse != null && intervallesSaisie != null) {
    for (let i = 0; i < intervallesReponse.length; i++) {
      const [borneInfRep, borneSupRep] = intervallesReponse[i].match(/-?\d\.?\d?/g) as string[]
      const [borneInfSai, borneSupSai] = intervallesSaisie[i].match(/-?\d\.?\d?/g) as string[]
      if (Math.abs(Number(borneInfSai) - Number(borneInfRep)) > 0.1 || Math.abs(Number(borneSupSai) - Number(borneSupRep)) > 0.1) {
        result = false
      }
    }
    return result
  }
}

/**
 * retourne le yMin pour cadrer la figure
 * @param poly1
 * @param poly2
 */
function trouveMaxMin (poly1:Polynome, poly2:Polynome): number {
  // on s'embête pas avec les constantes, elles sont toujours dans la fenêtre
  // on ne s'embête pas avec les affines, la encore, on sait comment elles se comportent quand elles sortent de la fenêtre
  // on va chercher donc le min et le max de fct1 et fct2 si ce sont au moins des polynomes de degré 2
  const fPrime1 = poly1.derivee()
  const fPrime2 = poly2.derivee()
  let yMin1: number
  let yMin2: number
  switch (fPrime1.deg) {
    case 0: // affine ou constante
      if (poly1.monomes[1] === 0) {
        yMin1 = poly1.image(-4) - 5
      } else {
        yMin1 = Math.round((poly1.image(-5) + poly1.image(5)) / 2) - 6
      }
      break
    case 1: // degré 2 dérivée de degré 1
      if (fPrime1.monomes[1] > 0) { // si le coeff de x de la dérivée est positif, c'est que le coeff de x² du poly1 l'est aussi
        yMin1 = poly1.image(-fPrime1.monomes[0] / fPrime1.monomes[1])
      } else {
        yMin1 = poly1.image(-fPrime1.monomes[0] / fPrime1.monomes[1]) - 9
      }
      break
    case 2:
    default: // degré 3 donc dérivée de degré 2
      /*  const monomes: number[] = fPrime2.monomes.map((el: number) => Number(el))
      const extrema = polynomialRoot(monomes[0], monomes[1], monomes[2], 0).filter(nb => typeof nb === 'number').map(el => Math.round(Number(el) * 1000) / 1000) as number[]
      switch (extrema.length) {
        case 0: yMin1 = -6
          break
        case 1:
          yMin1 = poly1.image(extrema[0]) - 6
          break
        default:
          yMin1 = (poly1.image(extrema[0]) + poly1.image(extrema[1])) / 2 - 6
      }
      */
      yMin1 = -6
  }
  switch (fPrime2.deg) {
    case 0: // affine ou constante
      if (poly2.monomes[1] === 0) {
        yMin2 = poly2.image(-4) - 5
      } else {
        yMin2 = Math.round((poly2.image(-5) + poly2.image(5)) / 2) - 6
      }
      break
    case 1: // degré 2 dérivée de degré 1
      if (fPrime2.monomes[1] > 0) { // si le coeff de x de la dérivée est positif, c'est que le coeff de x² du poly2 l'est aussi
        yMin2 = poly2.image(-fPrime2.monomes[0] / fPrime2.monomes[1])
      } else {
        yMin2 = poly2.image(-fPrime2.monomes[0] / fPrime2.monomes[1]) - 9
      }
      break
    case 2:
    default: // degré 3 donc dérivée de degré 2
      /* const monomes: number[] = fPrime2.monomes.map((el: number) => Number(el))
      const extrema = polynomialRoot(monomes[0], monomes[1], monomes[2], 0).filter(nb => typeof nb === 'number').map(el => Math.round(Number(el) * 1000) / 1000) as number[]
      switch (extrema.length) {
        case 0: yMin2 = -6
          break
        case 1:
          yMin2 = poly2.image(extrema[0]) - 6
          break
        default:
          yMin2 = (poly2.image(extrema[0]) + poly2.image(extrema[1])) / 2 - 6
      }
       */
      yMin2 = -6
  }
  const yMin = Math.min(yMin1, yMin2)
  console.log(`yMin trouvé : ${yMin}`)
  return yMin
}
/**
 * retourne un objet décrivant la fonction
 * @param {TypesDeFonction} type
 * @param {{x,y}[]} noeudsPassants
 * @return {poly: Polynome, expr: string, func: (number)=>number}
 */
function choisisFonction (type: TypesDeFonction, noeudsPassants: {x:number, y:number}[]): {func: (x:number)=>number, expr: string, poly: Polynome} {
  let noeudsFonction
  switch (type) {
    case 'affine':
      if (noeudsPassants.length < 2) {
        throw Error('Un problème pas deux points pour une affine')
      }
      // On prend les 1er et dernier noeuds
      noeudsFonction = [noeudsPassants[1], noeudsPassants[2]]
      break
    case 'poly2':
      // Pour un polynome de degré 2, il faut trois points sinon, c'est une droite
      if (noeudsPassants.length < 3) {
        throw Error('Un problème pas 3 noeuds pour un poly2')
      }
      noeudsFonction = [noeudsPassants[0], noeudsPassants[1], noeudsPassants[2]] // On prend tous les noeuds sauf l'avant-dernier'
      break
    case 'poly3':
      // Pour un polynome de degré 3, il faut quatre points sinon, c'est un poly2
      if (noeudsPassants.length < 4) {
        throw Error('Un problème pas 4 noeuds pour un poly3')
      }
      noeudsFonction = noeudsPassants.slice(0, 4) // On prend tous les noeuds
      break
    case 'constante':
    default:
      if (noeudsPassants.length < 1) {
        throw Error('Un problème il faut au moins un noeud !')
      }
      return { // On prend un noeud au milieu de la liste pour éviter d'avoir une tangente en -5.
        func: () => noeudsPassants[1].y,
        expr: `${noeudsPassants[1].y}`,
        poly: new Polynome({ rand: false, deg: 3, coeffs: [noeudsPassants[1].y, 0, 0, 0] })
      }
  }
  if (noeudsFonction == null) {
    // si on arrive là, c'est qu'on a un truc inconnu
    throw Error('type de fonction inconnu')
  }
  const poly = interpolationDeLagrange(noeudsFonction)
  if (poly.deg < 3) {
    const monomes = poly.monomes
    for (let i = monomes.length - 1; i < 3; i++) {
      monomes.push(0)
    }
    poly.monomes = [...monomes]
    poly.deg = 3
  }
  const func = poly.fonction
  const expr: string = poly.toMathExpr()
  return { func, expr, poly }
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
    this.sup2 = 10
    this.sup = 1
    this.besoinFormulaireNumerique = ['Choix des questions', 3, '1 : Résoudre une équation\n2 : Résoudre une inéquation\n3: Résoudre une équation et une inéquation']
    this.besoinFormulaire2Numerique = ['Choix des deux fonctions', 10,
      'Constante-affine\nConstante-degré2\nConstante-degré3\nAffine-affine\nAffine-degré2\nAffine-degré3\nDegré2-degré2\nDegré2-degré3\nDegré3-degré3\nMélange']
  }

  nouvelleVersion (numeroExercice: number): void {
    // on va chercher une spline aléatoire
    this.listeQuestions = []
    this.listeCorrections = ['']
    this.autoCorrection = []
    const aleaF1 = randint(1, 15)
    const f1 = lettreMinusculeDepuisChiffre(aleaF1)
    const f2 = lettreMinusculeDepuisChiffre(randint(1, 20, aleaF1))
    const choixFonctions = this.sup2 < 10 ? this.sup2 : randint(1, 9)
    let integraleDiff: number
    let fonctions
    let f1Type: TypesDeFonction
    let f2Type: TypesDeFonction
    let texteCorr = ''
    // On crée une seule spline
    do { // Une boucle pour tester des valeurs et on sort si les courbes sont suffisamment distantes      }
      // On choisit les noeuds passants (il en faut 4 pour déterminer un poly3, qui peut le plus peut le moins !
      const listeMelangee = shuffle(rangeMinMax(-5, -1)).slice(0, 2).concat(shuffle(rangeMinMax(0, 5)).slice(0, 2)).slice(0, 4)
      const [x0, x1, x2, x3] = combinaisonListes(listeMelangee, 4).sort((a: number, b: number) => a - b)
      let y0: number
      let y1: number
      let y2: number
      let y3: number
      let vec1, vec2, vec3, prodVec1, prodVec2
      const vector = (x0: number, y0: number, x1: number, y1: number) => Object.assign({}, { u: x1 - x0, v: y1 - y0 })
      const prodVec = (v1: { u: number, v: number }, v2: { u: number, v: number }) => v1.u * v2.v - v1.v * v2.u
      do {
        y0 = randint(-2, 2)
        y1 = randint(-3, 3, y0)
        y2 = randint(-4, 4, y1)
        y3 = randint(-2, 3, [y0, y2, y1])
        vec1 = vector(x0, y0, x1, y1)
        vec2 = vector(x0, y0, x2, y2)
        vec3 = vector(x0, y0, x3, y3)
        prodVec1 = Math.abs(prodVec(vec1, vec2))
        prodVec2 = Math.abs(prodVec(vec1, vec3))
      } while (prodVec1 < 0.1 || prodVec2 < 0.1 || Math.abs((y2 - y1) / (x2 - x1)) > 2) // On cherche des points non alignés et une pente affine pas trop importante
      // les noeuds passants qu'on trie dans l'ordre des x croissants
      const noeudsPassant = [{ x: x0, y: y0 },
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 }].sort((el1, el2) => el1.x - el2.x)
      switch (choixFonctions) { // On choisit les fonctions demandées
        case 1 : // constante et affine
          f1Type = 'constante'
          f2Type = 'affine'
          break
        case 2 : // constante et degré2
          f1Type = 'constante'
          f2Type = 'poly2'
          noeudsPassant[2].y = noeudsPassant[1].y
          break
        case 3 : // constante et degré3
          f1Type = 'constante'
          f2Type = 'poly3'
          noeudsPassant[2].y = noeudsPassant[1].y
          noeudsPassant[3].y = noeudsPassant[1].y
          break
        case 4 : // 2 affines
          f1Type = 'affine'
          f2Type = 'affine'
          break
        case 5 : // affine et degré2
          f2Type = 'poly2'
          f1Type = 'affine'

          break
        case 6 : { // affine et degré3
          // Il faut trouver un truc pour que le noeud passant 3 soit aligné avec le 1 et le 2 et à coordonnées entières
          f2Type = 'poly3'
          f1Type = 'affine'
          const deltaX = noeudsPassant[2].x - noeudsPassant[1].x
          const deltaY = noeudsPassant[2].y - noeudsPassant[1].y
          const p = pgcd(deltaY, deltaX)
          if (p === 2) {
            noeudsPassant[3].x = noeudsPassant[1].x + 3 * deltaX / 2
            noeudsPassant[3].y = noeudsPassant[1].y + 3 * deltaY / 2
          } else if (p > 2) {
            noeudsPassant[3].x = noeudsPassant[2].x
            noeudsPassant[3].y = noeudsPassant[2].y
            const k = randint(1, p - 1)
            noeudsPassant[2].x = noeudsPassant[1].x + k * deltaX / p
            noeudsPassant[2].y = noeudsPassant[1].y + k * deltaY / p
          } else {
            noeudsPassant[3].x = noeudsPassant[1].x + 2 * deltaX
            noeudsPassant[3].y = noeudsPassant[1].y + 2 * deltaY
          }
        }
          break
        case 7 : // degré2 et degré2
          f1Type = 'poly2'
          f2Type = 'poly2'
          break
        case 8 : // degré2 et degré3
          f1Type = 'poly2'
          f2Type = 'poly3'
          break
        case 9 : // degré3 et degré3
          f1Type = 'poly3'
          f2Type = 'poly3'
          break
        default: // affine et affine (c'est le this.sup par défaut)
          f1Type = 'affine'
          f2Type = 'affine'
          break
      }
      if (f1Type !== f2Type) {
        fonctions = [choisisFonction(f1Type, noeudsPassant), choisisFonction(f2Type, noeudsPassant)]
      } else { // on a un problème par ce que les noeuds passants étant identiques, les deux fonctions seront identiques !
        const ordonnees = noeudsPassant.map(el => el.y)
        let newY: number
        do {
          newY = (noeudsPassant[1].y > 0 ? -1 : 1) * randint(-3, 3, ordonnees)
        } while (Math.abs(newY - noeudsPassant[1].y) > 5)
        const newNoeudsPassants = []
        newNoeudsPassants.push(noeudsPassant[0])
        newNoeudsPassants.push({ x: noeudsPassant[1].x, y: newY })
        newNoeudsPassants.push(...noeudsPassant.slice(2, 4))
        fonctions = [choisisFonction(f1Type, noeudsPassant), choisisFonction(f2Type, newNoeudsPassants)]
      }
      const integrales = []
      // on calcule la différence des polys, on intègre entre -5 et 0 et entre 0 et 5
      const poly = fonctions[0].poly
      if (poly == null) { // noremalement, ça ne doit pas arriver car la seule à ne pas avoir la propriété poly est la spline qui est éliminée
        // d'ailleurs typescript le sait puisque dans le test, si on met f1Type !== 'spline' il nous fait remarquer que c'est pas la peine !
        // donc ce test est là juste pour que typescript ne me dise pas que fonctions[0].poly peut être undefined
        throw Error('la fonction 1 n\'a pas de polynôme alors qu\'elle devrait')
      }
      for (let k = 0; k < 10; k++) {
        const diff = poly.multiply(-1).add(fonctions[1].poly)
        integrales.push(Math.abs(diff.image(-4 + k) - diff.image(-5 + k)))
      }
      integraleDiff = Math.min(...integrales)
    } while (integraleDiff < 0.5)
    const [fonction1, fonction2] = fonctions
    const yMin = trouveMaxMin(fonction1.poly, fonction2.poly)
    this.figure = new Figure({ xMin: -5.2, yMin, width: 312, height: 378 })
    this.figure.create('Grid')
    this.figure.options.limitNumberOfElement.set('Point', 1)

    // on s'occupe de la fonction 1 et du point mobile dessus on trace tout ça.
    // Maintenant, la fonction1 n'est jamais une spline !
    let courbeF
    let M
    if (f1Type === 'constante' || f1Type === 'affine') {
      const a = fonction1.poly.monomes[1]
      const b = fonction1.poly.monomes[0]
      console.log(a + 'x+' + b)
      const B = new Point(this.figure, { x: -5, y: -5 * a + b, isVisible: false })
      const A = new Point(this.figure, { x: 5, y: 5 * a + b, isVisible: false })
      const d = this.figure.create('Segment', { point1: B, point2: A })
      d.color = 'blue'
      d.thickness = 2
      d.isDashed = true
      M = this.figure.create('PointOnLine', { line: d })
    } else {
      courbeF = this.figure.create('Graph', {
        expression: fonction1.expr as string,
        color: 'blue',
        thickness: 2,
        fillOpacity: 0.5,
        xMin: -5,
        xMax: 5.05,
        isDashed: true
      })
      M = this.figure.create('PointOnGraph', { graph: courbeF })
    }
    // M.draw()
    M.label = 'M'
    M.shape = 'x'
    M.createSegmentToAxeX()
    M.createSegmentToAxeY()
    const textX = this.figure.create('DynamicX', { point: M })
    const textY = this.figure.create('DynamicY', { point: M })
    textX.dynamicText.maximumFractionDigits = 1
    textY.dynamicText.maximumFractionDigits = 1
    let x
    let y
    let trouve = false
    // On cherche à placer Cf
    for (x = -5; x < 5 && !trouve; x++) {
      if (Math.abs(fonction1.poly.image(x)) < 5) {
        y = fonction1.poly.image(x)
        trouve = true
      }
    }
    if (!trouve) {
      x = 4
      if (fonction1.poly.image(4) < 0) {
        y = -5
      } else {
        y = 5
      }
    }
    if (f2Type === 'affine') {
      const a = fonction2.poly.monomes[1]
      const b = fonction2.poly.monomes[0]
      const B = new Point(this.figure, { x: 0, y: b, isVisible: false })
      const A = new Point(this.figure, { x: 1, y: b + a, isVisible: false })
      const d = this.figure.create('Line', { point1: B, point2: A })
      d.color = 'red'
      d.thickness = 2
      d.isDashed = false
    } else {
      this.figure.create('TextByPosition', { x: x - 0.5, y: y + 0.5, text: `$\\mathscr{C_${f1}}$`, color: 'blue' })
      this.figure.create('Graph', {
        expression: fonction2.expr as string,
        color: 'red',
        thickness: 2,
        fillOpacity: 0.5,
        xMin: -5,
        xMax: 5.05
      })
    }
    trouve = false
    for (x = 4; x > -5 && !trouve; x--) {
      if (Math.abs(fonction2.poly.image(x)) < 5) {
        trouve = true
        y = fonction2.poly.image(x)
      }
    }
    if (!trouve) {
      x = -4
      if (fonction2.poly.image(-4) < 0) {
        y = -5
      } else {
        y = 5
      }
    }
    this.figure.create('TextByPosition', { x: x + 0.5, y: y + 0.5, text: `$\\mathscr{C_${f2}}$`, color: 'red' })
    this.idApigeom = `apigeomEx${numeroExercice}F0`
    // De -6.3 à 6.3 donc width = 12.6 * 30 = 378
    let enonce = `On considère les fonctions $${f1}$ et $${f2}$ définies sur $[-5{,}2;5{,}2]$ et dont on a représenté ci-dessous leurs courbes respectives.<br><br>`
    let numero = 1
    // let diff
    let soluces: number[]
    const inferieur = choice([true, false])

    soluces = []
    if (fonction1.poly == null && fonction2.poly == null) throw Error('Un problème avec l\'un des polynome')
    const polyDiff = fonction1.poly.add(fonction2.poly.multiply(-1))
    const racines = polyDiff.racines()
    if (racines == null) throw Error(`Il n'y aurait pas de points d'intersection !!! polyDiff = ${polyDiff.toLatex()}`)
    const racinesArrondies = racines.map(el => Number(el.toFixed(1)))
    for (let n = 0; n < racinesArrondies.length; n++) {
      const image = fonction1.func(racinesArrondies[n])
      const isInside = Math.abs(racinesArrondies[n]) <= 5.3
      const isInside2 = Math.abs(image) <= 6.2
      if (isInside && isInside2) {
        soluces.push(racinesArrondies[n])
      }
    }
    soluces = Array.from(new Set(soluces)) as number[]
    soluces = soluces.sort((a: number, b: number) => a - b)
    if (this.sup === 1 || this.sup === 3) {
      enonce += `${String(numero)}. Résoudre graphiquement $${f1}(x)${miseEnEvidence('~=~', 'black')}${f2}(x)$.<br>`
      enonce += 'Les solutions doivent être rangées par ordre croissant et séparées par un point-virgule.<br>'
      texteCorr += `${String(numero)}. L'ensemble de solutions de l'équation correspond aux abscisses des points d'intersection des deux courbes soit : $\\{${soluces.map(el => texNombre(el, 1)).join(';')}\\}$<br><br>`
      numero++
    }
    if (soluces != null) {
      if (this.sup === 1 || this.sup === 3) {
        enonce += 'L\'ensemble de solutions de l\'équation est : ' + remplisLesBlancs(this, 0, '\\{%{soluces}\\}', 'inline lycee', '\\ldots\\ldots') + '<br><br>' // '$\\{' + Array.from(soluces).join(' ; ') + '\\}$'//
        setReponse(this, 0, { soluces: { value: Array.from(soluces).join(';'), compare: compareEnsembles } }, { formatInteractif: 'fillInTheBlank' })
      }
    }
    if (this.sup === 2 || this.sup === 3) {
      enonce += `${numero}. Résoudre graphiquement $${f1}(x)${inferieur ? miseEnEvidence('\\leqslant', 'black') : miseEnEvidence('~\\geqslant~', 'black')}${f2}(x)$.<br>`
      if (this.interactif) {
        enonce += 'On peut taper \'union\' au clavier ou utiliser le clavier virtuel pour le signe $\\cup$.<br>'
      }
      enonce += 'L\'ensemble des solutions de l\'inéquation est : ' + remplisLesBlancs(this, 1, '%{solucesIneq}', 'inline lycee', '\\ldots\\ldots') + '<br><br>'
      const poly = fonction2.poly as Polynome
      const diff = poly.multiply(-1).add(fonction1.poly)
      //  const solutions = inferieurSuperieur(diff.fonction, 0, -5.2, 5.2, inferieur, false, { step: 0.2 })
      const soluces2: string = chercheIntervalles(diff, soluces, inferieur)

      // enonce += '$' + soluces2 + '$'
      setReponse(this, 1, { solucesIneq: { value: soluces2, compare: compareIntervalles } }, { formatInteractif: 'fillInTheBlank' })
      texteCorr += `${String(numero)}. Pour trouver l'ensemble des solutions de l'inéquation, on regarde les portions où la courbe $${miseEnEvidence('\\mathscr{C_' + f1 + '}', 'blue')}$ est située ${inferieur ? 'en-dessous' : 'au-dessus'} de la  courbe $${miseEnEvidence('\\mathscr{C_' + f2 + '}', 'red')}$.<br>`
      texteCorr += `On lit les intervalles correspondants sur l'axe des abscisses : $${soluces2}$.<br><br>`
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
      if (f1Type === 'constante' || f1Type === 'affine') {
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
      if (f2Type === 'affine') {
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
    this.listeCorrections = [texteCorr]
  }
}

export default resolutionEquationInequationGraphique
