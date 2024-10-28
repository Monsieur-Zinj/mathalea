import { tracePoint } from '../../lib/2d/points'
import { labelPoint } from '../../lib/2d/textes'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import { point3d, polygone3d, prisme3d, vecteur3d } from '../../modules/3d'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = '46593'
export const refs = {
  'fr-fr': ['TQCME-5'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Bac Sujet zéro 2024 E4Q1'
export const dateDePublication = '28/10/2024'
/**
 * Ceci est un exo construit à partir d'une question de qcm de Bac.
 * Il utilise la classe ExerciceQcm qui définit les contours de l'exo (sans version aléatoire)
 * Ce moule à exo dispose d'une méthode qcmCamExport qui permet de récupérer le JSON de la question et de la reponse pour qcmCam.
 * Il est interactif et dispose d'un export AMC d'office
 */
export default class SujetZero2024Ex4Q1 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    const basePoints = [
      point3d(0, 0, 0, true, 'A', 'below left'),
      point3d(5, 0, 0, true, 'B', 'below left'),
      point3d(5, 0, 5, true, 'F', 'below left'),
      point3d(0, 0, 10, true, 'E', 'below left')
    ]
    const base = polygone3d(...basePoints)
    for (const arete of base.aretes) {
      arete.visible = true
    }

    const vecteurExtrusion = vecteur3d(0, 5, 0)
    const lePrisme = prisme3d(base, vecteurExtrusion, 'black', true, 'DCGH', ['above right', 'below right', 'above right', 'above left'])
    const pointJ = point3d(0, 0, 5, true, 'J', 'right').c2d
    const pointI = point3d(2.5, 0, 7.5, true, 'I', 'above').c2d
    const tracIJ = tracePoint(pointI, pointJ)
    const labels = labelPoint(pointI, pointJ)
    this.reponses = [
      '$\\begin{pmatrix}0 \\\\ -1 \\\\ 1\\end{pmatrix}$',
      '$\\begin{pmatrix}-1 \\\\ 1 \\\\ 1\\end{pmatrix}$',
      '$\\begin{pmatrix}1 \\\\ 1 \\\\ 1\\end{pmatrix}$',
      '$\\begin{pmatrix}0 \\\\ 0 \\\\ 1\\end{pmatrix}$'
    ]
    const objets = [lePrisme.c2d, tracIJ, labels]
    const figure = mathalea2d(Object.assign({}, fixeBordures(objets)), objets)

    this.enonce = `On considère le prisme droit ABFEDCGH tel que $\\mathrm{AB} = \\mathrm{AD}$.<br>
Sa base ABFE est un trapèze rectangle en A, vérifiant $\\overrightarrow{\\mathrm{BF}} = \\dfrac{1}{2} \\overrightarrow{\\mathrm{AE}}$.<br>
On note I le milieu du segment [EF].<br>
On note J le milieu du segment [AE].<br>
On associe à ce prisme le repère orthonormé $\\left(A~;~ \\overrightarrow{\\imath}, \\overrightarrow{\\jmath}, \\overrightarrow{k}\\right)$ tel que :<br>
$\\overrightarrow{\\imath} = \\overrightarrow{\\mathrm{AB}} ;\\quad \\overrightarrow{\\jmath} = \\overrightarrow{\\mathrm{AD}} ;\\quad \\overrightarrow{k} = \\overrightarrow{\\mathrm{AJ}}$`

    this.enonce += figure
    this.enonce += `On donne les coordonnées de quatre vecteurs dans la base $\\left(\\overrightarrow{\\imath}, \\overrightarrow{\\jmath}, \\overrightarrow{k}\\right)$.<br>
    Lequel est un vecteur normal au plan (ABG)?<br>`
    this.correction = `Le vecteur normal au plan (ABG) est le produit vectoriel des vecteurs $\\overrightarrow{\\mathrm{AB}}$ et $\\overrightarrow{\\mathrm{AG}}$.<br>
    On a $\\overrightarrow{\\mathrm{AB}} = \\begin{pmatrix}1 \\\\ 0 \\\\ 0\\end{pmatrix}$ et $\\overrightarrow{\\mathrm{BG}} = \\begin{pmatrix}0 \\\\ 1 \\\\ 1\\end{pmatrix}$<br>
    Donc $\\overrightarrow{\\mathrm{AB} \\wedge \\mathrm{BG}} = \\begin{pmatrix}0 \\\\ -1 \\\\ 1\\end{pmatrix}$`
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
