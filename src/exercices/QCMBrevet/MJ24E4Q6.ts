import { t } from 'xstate'
import { codageAngle, codageAngleDroit } from '../../lib/2d/angles'
import { point, tracePoint } from '../../lib/2d/points'
import { polygone } from '../../lib/2d/polygones'
import { labelPoint } from '../../lib/2d/textes'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = 'MJ24E4Q3'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM image par translation (issu du brevet 202 Métropole)'

class MetropoleJuin24Exo4Q3 extends ExerciceQcm {
  constructor () {
    super()
    this.reponses = [
      '$H$',
      '$E$',
      '$D$'
    ]
    this.bonneReponse = 1
    this.enonce = 'Dans le triangle ABC rectangle en A ci-contre, qui n\'est pas en vraie grandeur, quelle est la valeur de $\\cos \\alpha$ ?'
    const triangle = polygone([
      point(0, 0, 'A', 'below left'),
      point(0, 3, 'C', 'above left'),
      point(4, 0, 'B', 'below right')
    ])
    const angleDroit = codageAngleDroit(triangle.listePoints[1], triangle.listePoints[0], triangle.listePoints[2])
    const angleAlpha = codageAngle(triangle.listePoints[0], triangle.listePoints[2], triangle.listePoints[1], 1.5, '', 'black', 1, 1, 'none', 0, false, false, '$\\alpha$')
    const objets = [triangle, angleDroit, angleAlpha]
    this.enonce += mathalea2d(Object.assign({ pixelsParCm: 20, scale: 1 }, fixeBordures(objets)), objets)
    this.correction = 'Si $C$ a pour image $A$ par $t_{\\overrightarrow{CA}}$, alors $J$ a pour image $E$.'
  }
}
export default MetropoleJuin24Exo4Q3
