import { repere } from '../../lib/2d/reperes'
import { Spline } from '../../lib/mathFonctions/Spline'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = '3ca11'
export const refs = {
  'fr-fr': ['TQCM1-2'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM encadrement intégrale (issu du bac juin 2024 Polynésie)'
/**
 * Ceci est un exo construit à partir d'une question de qcm de Bac.
 * Il utilise la classe ExerciceQcm qui définit les contours de l'exo (sans version aléatoire)
 * Ce moule à exo dispose d'une méthode qcmCamExport qui permet de récupérer le JSON de la question et de la reponse pour qcmCam.
 * Il est interactif et dispose d'un export AMC d'office
 */
class PolynesieJuin2024Ex2Q2 extends ExerciceQcm {
  constructor () {
    super()
    this.reponses = [
      '$5 \\leqslant I \\leqslant 10$',
      '$0 \\leqslant I \\leqslant 4$',
      '$1 \\leqslant I \\leqslant 5$',
      '$10 \\leqslant I \\leqslant 15$'
    ]
    let texte = 'La courbe d\'une fonction $f$ définie sur $[~0~;~+\\infty~[$ est donnée ci-dessous.:<br>'
    const maSpline = new Spline(
      [
        { x: 0, y: 0, deriveeGauche: 6, deriveeDroit: 6, isVisible: false },
        { x: 1, y: 3, deriveeGauche: 1, deriveeDroit: 1, isVisible: false },
        { x: 2, y: 3, deriveeGauche: -0.5, deriveeDroit: -0.5, isVisible: false },
        { x: 3, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: false },
        { x: 4, y: 1, deriveeGauche: -0.5, deriveeDroit: -0.5, isVisible: false },
        { x: 5, y: 0.5, deriveeGauche: -0.25, deriveeDroit: -0.25, isVisible: false },
        { x: 6, y: 0.3, deriveeGauche: -0.1, deriveeDroit: -0.1, isVisible: false }
      ]
    )
    const objets = [
      maSpline.courbe({ color: 'red', epaisseur: 2 }),
      repere({ xMin: 0, yMin: 0, xMax: 6, yMax: 4 })
    ]
    texte += mathalea2d(Object.assign({ pixelsParCm: 40, scale: 2 }, fixeBordures(objets)), objets)
    texte += 'Un encadrement de l\'intégrale $I = \\displaystyle\\int_1^5 f(x) \\:\\text{d}x$ est :<br>'
    this.enonce = texte
    this.correction = `Le dessin est clair : la fonction est positive sur l'intervalle $[~1~;~5~]$.<br>
    L'intégrale est (en unités d'aire) la mesure de la surface limitée par la représentation graphique de $f$, l'axe des abscisses et les droites d'équations $x = 1$ et $x = 5$.<br>
La surface grise contient les 5 carreaux hachurés et est inscrite dans le polygone de 10 unités en bleu.<br>
Le bon encadrement est : $${miseEnEvidence('5 \\leqslant I \\leqslant 10')}$.`
  }
}
export default PolynesieJuin2024Ex2Q2
