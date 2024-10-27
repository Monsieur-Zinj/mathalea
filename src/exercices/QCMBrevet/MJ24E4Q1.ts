import { miseEnEvidence } from '../../lib/outils/embellissements'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = '67e15'
export const refs = {
  'fr-fr': ['3QCM1-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul d\'image par une fonction (issu du brevet 2024 Métropole)'

export default class MetropoleJuin24Exo4Q1 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$-14$',
      '$-10$',
      '$-3$'
    ]
    this.enonce = 'On considère la fonction $f$ définie par $f(x) = 3x - 2$.<br>Quelle est l\'image de $-4$ par cette fonction ?'
    this.correction = `$f(x) = 3x - 2$, donc $f(-4) = 3\\times (- 4) - 2 = -12 - 2 = ${miseEnEvidence('-14')}$.`
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
