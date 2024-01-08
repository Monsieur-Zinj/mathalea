import Exercice from '../ExerciceTs'
import {
  droiteHorizontaleParPoint,
  droiteParPointEtPente,
  droiteParPointEtPerpendiculaire,
  droiteVerticaleParPoint,
  Droite
} from '../../lib/2d/droites'
import { milieu, point, TracePoint, Point, pointSurDroite } from '../../lib/2d/points'
import { colorToLatexOrHTML, mathalea2d } from '../../modules/2dGeneralites'
import { grille } from '../../lib/2d/reperes'
import { randint } from '../../modules/outils'
import { choice, shuffle } from '../../lib/outils/arrayOutils'
import { labelPoint, latexParCoordonnees } from '../../lib/2d/textes'
import { longueur } from '../../lib/2d/segmentsVecteurs'
import { projectionOrtho, rotation, symetrieAxiale } from '../../lib/2d/transformations'
import { arcPointPointAngle } from '../../lib/2d/cercle'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { codageAngleDroit } from '../../lib/2d/angles'

export const titre = 'Construire des symétriques de points'
export const dateDePublication = '07/01/2024'
export const interactifReady = false
export const interactifType = 'custom'

export const uuid = '26ea4'
export const ref = '6G24-0'

function checkDistance (points: Point[], d: Droite) {
  for (const pointA of points) {
    for (const pointB of points) {
      const l = longueur(pointA, pointB)
      if (l > 0 && l < 2.5) {
        return false
      }
      const l2 = longueur(pointA, symetrieAxiale(pointB, d))
      if (l2 < 2.5) {
        return false
      }
    }
  }
  for (const point of points) {
    const H: Point = projectionOrtho(point, d) as Point
    if (longueur(H, point) < 2) return false
  }
  return true
}
class ConstrctionsSymetriquesPoints extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    this.spacingCorr = 2
    this.besoinFormulaireNumerique = ['Choix de l\'axe', 4, 'Axe horizontal\nAxe vertical\nAxe oblique /\nAxe oblique \\']
    this.besoinFormulaire2Numerique = [
      'Type d\'aide',
      4,
      'Quadrillages\nPerpendiculaires en pointillés\nMarques de compas\nAucune'
    ]
    this.besoinFormulaire3Numerique = ['Nombre de points à construire (5 maxi)', 5]
    this.sup = 1
    this.sup2 = 1
    this.sup3 = 5
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    for (let i = 0; i < this.nbQuestions; i++) {
      let enonce = ''
      let antecedents: Point[] = []
      const middle: Point[] = []
      const symetriques: Point[] = []
      const objets = []
      let objetsCorrection = []
      let d: Droite
      const nbPoints = Math.max(Math.min(this.sup3, 5), 1) // on veut entre 1 et 5 points à construire
      do {
        objets.length = 0
        objetsCorrection.length = 0
        middle.length = 0
        symetriques.length = 0
        antecedents.length = 0
        const nuage = []
        // construire une liste de points aléatoires dans la grille (un par ligne soit 13 au total)
        if (this.sup === 1) {
          for (let x = -6; x < 6.5; x += 0.5) {
            nuage.push({ y: randint(2, 6) * choice([-1, 1]), x })
          }
        } else if (this.sup === 2) {
          for (let y = -6; y < 6.5; y += 0.5) {
            nuage.push({ x: randint(2, 6) * choice([-1, 1]), y })
          }
        } else if (this.sup === 3) {
          for (let x = -6; x < 6.5; x += 0.5) {
            nuage.push({ y: randint(-6, 6, Math.round(x)), x })
          }
        } else {
          for (let x = -6; x < 6.5; x += 0.5) {
            nuage.push({ y: randint(-6, 6, Math.round(-x)), x })
          }
        }
        const noms = Array.from(choisitLettresDifferentes(nuage.length, 'Q', true))
        // Les antécédents sont des points nommés
        antecedents = shuffle(nuage).map((el, i) => point(el.x, el.y, noms[i], 'above left')) // on mélange et on ne prendra que les nbPoints premiers
        const O = point(0, 0, '', 'above')

        let labelD
        if (this.sup === 1) {
          d = droiteHorizontaleParPoint(O) as Droite
          labelD = latexParCoordonnees('(d)', -6.5, -0.8, 'black', 0, 0, '', 8)
        } else if (this.sup === 2) {
          d = droiteVerticaleParPoint(O) as Droite
          labelD = latexParCoordonnees('(d)', -0.8, -6.5, 'black', 0, 0, '', 8)
        } else if (this.sup === 3) {
          d = droiteParPointEtPente(O, 1) as Droite
          labelD = latexParCoordonnees('(d)', -6.5, -5.2, 'black', 0, 0, '', 8)
        } else {
          d = droiteParPointEtPente(O, -1) as Droite
          labelD = latexParCoordonnees('(d)', -6.5, 5.2, 'black', 0, 0, '', 8)
        }
        const guideDroites = []
        for (let k = 0; k < nbPoints; k++) {
          const guide = droiteParPointEtPerpendiculaire(antecedents[k], d) as Droite
          guide.pointilles = 2
          guide.color = colorToLatexOrHTML('gray')
          guide.opacite = 0.4
          guideDroites.push(guide)
        }
        const guidesArc = []
        for (let k = 0; k < nbPoints; k++) {
          symetriques[k] = symetrieAxiale(antecedents[k], d)
          middle[k] = milieu(antecedents[k], symetriques[k])
          const angleOffset = choice([-12, -10, -8, 8, 10, 12])
          const ext1 = rotation(symetriques[k], middle[k], 3 * angleOffset)
          const ext2 = rotation(symetriques[k], middle[k], -angleOffset)
          const guide = arcPointPointAngle(ext2, ext1, 4 * angleOffset, false, 'none', 'gray', 0, 'none')
          guide.pointilles = 2
          guide.opacite = 0.4
          guidesArc.push(guide)
        }
        if (this.sup2 === 1) {
          objets.push(grille(-7, -7, 7, 7, 'gray', 0.5, 0.5, 0))
        } else if (this.sup2 === 2) {
          objets.push(...guideDroites)
        } else if (this.sup2 === 3) {
          objets.push(...guidesArc)
        }
        objets.push(d, labelD)
        for (let k = 0; k < nbPoints; k++) {
          objets.push(new TracePoint(antecedents[k]))
          const sym = symetrieAxiale(antecedents[k], d, antecedents[k].nom + '\'')
          const trace: TracePoint = new TracePoint(sym)
          trace.color = colorToLatexOrHTML('red')
          const labelSym = labelPoint(sym)
          const label = labelPoint(antecedents[k])
          objets.push(label)
          objetsCorrection.push(trace, labelSym)
        }
        objetsCorrection = [...objets, ...objetsCorrection]
        if (this.sup2 !== 2) {
          objetsCorrection.push(...guideDroites)
        }
        if (this.sup2 !== 3) {
          objetsCorrection.push(...guidesArc)
        }
        const pointSurD = pointSurDroite(d, 50)
        for (let k = 0; k < nbPoints; k++) {
          const carre = codageAngleDroit(antecedents[k], middle[k], pointSurD, 'blue', 0.3, 0.5)
          objetsCorrection.push(carre)
        }
        enonce = `Construire le symétrique des points $${noms.slice(0, nbPoints - 1).join(';')}$ et $${noms[nbPoints - 1]}$ par rapport à la droite $(d)$.`
      } while (!checkDistance(antecedents.slice(0, nbPoints), d))
      this.listeQuestions.push(enonce + mathalea2d({ xmin: -7, xmax: 7, ymin: -7, ymax: 7 }, objets))
      this.listeCorrections.push(mathalea2d({ xmin: -7, xmax: 7, ymin: -7, ymax: 7 }, objetsCorrection))
    }
  }
}

export default ConstrctionsSymetriquesPoints
