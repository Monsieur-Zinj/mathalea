import { miseEnEvidence } from '../../lib/outils/embellissements'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = 'cccb1'
export const refs = {
  'fr-fr': ['3QCMP-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul de puissance (issu du brevet 2023 Métropole)'
export const dateDePublication = '28/10/2024'

export default class MetropoleJuin24Exo4Q2 extends ExerciceQcm {
  constructor () {
    super()
    this.reponses = [
      '$-125$',
      '$-15$',
      '$125$'
    ]
    this.enonce = 'Combien vaut $(-5)^3$ ?'
    this.correction = `$(- 5)^3 = (- 5) \\times (- 5) \\times (- 5) = ${miseEnEvidence('-125')}$.`
  }
}
