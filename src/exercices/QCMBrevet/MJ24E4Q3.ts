import { point, tracePoint } from '../../lib/2d/points'
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
    this.enonce = 'Quelle est l\'image du point J par la translation qui transforme C en A ?'
    const nuage = [
      point(0, 0, 'F', 'above right'),
      point(2, 0, 'E', 'above right'),
      point(4, 0, 'L', 'above right'),
      point(6, 0, 'K', 'above right'),
      point(0, 2, 'A', 'above right'),
      point(2, 2, 'D', 'above right'),
      point(4, 2, 'J', 'above right'),
      point(6, 2, 'I', 'above right'),
      point(0, 4, 'B', 'above right'),
      point(2, 4, 'C', 'above right'),
      point(4, 4, 'G', 'above right'),
      point(6, 4, 'H', 'above right')
    ]
    const points = tracePoint(...nuage)
    points.style = '.'
    points.epaisseur = 1.5
    const labels = labelPoint(...nuage)
    this.enonce += mathalea2d(Object.assign({ pixelsParCm: 20, scale: 1 }, fixeBordures([points, labels])), points, labels)
    this.correction = 'Si $C$ a pour image $A$ par $t_{\\overrightarrow{CA}}$, alors $J$ a pour image $E$.'
  }
}
export default MetropoleJuin24Exo4Q3
