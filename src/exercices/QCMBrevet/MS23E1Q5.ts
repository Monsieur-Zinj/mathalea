import { point, tracePoint } from '../../lib/2d/points'
import { polygone } from '../../lib/2d/polygones'
import { labelPoint } from '../../lib/2d/textes'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = 'c4da7'
export const refs = {
  'fr-fr': ['3QCM2-5'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM rapport d\'homothétie (issu du brevet 2023 Métropole)'

export default class MetropoleSeptembre23Exo1Q5 extends ExerciceQcm {
  versionOriginale = () => {
    this.reponses = [
      '$-2$',
      '$2$',
      '$-\\dfrac{1}{2}$'
    ]
    this.enonce = `Le triangle DEF est l'image du triangle ABC par
une homothétie de centre O. Quel est son rapport?`
    const nuage = [
      point(0, 0, 'O', 'above'),
      point(-1, 0, 'A', 'above'),
      point(-0.5, -0.5, 'C', 'below'),
      point(-2, -0.5, 'B', 'below'),
      point(1, 1, 'F', 'above'),
      point(4, 1, 'E', 'above'),
      point(2, 0, 'D', 'below')
    ]
    const points = tracePoint(...nuage)
    const triangleABC = polygone(nuage[1], nuage[2], nuage[3])
    const triangleDEF = polygone(nuage[4], nuage[5], nuage[6])
    points.style = 'x'
    points.taille = 2
    points.epaisseur = 1
    const labels = labelPoint(...nuage)
    const objets = [points, labels, triangleABC, triangleDEF]
    this.enonce += mathalea2d(Object.assign({ pixelsParCm: 30, scale: 1.5 }, fixeBordures(objets)), objets)
    this.correction = `Les deux figures sont de part et d'autres de $O$, donc le rapport est négatif.<br>
    De plus, DEF est plus grand que ABC donc le rapport n'est pas compris entre -1 et 1.<br>
    Le rapport est donc $${miseEnEvidence('-2')}$.`
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
