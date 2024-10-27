import { miseEnEvidence } from '../../lib/outils/embellissements'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = '6483e'
export const refs = {
  'fr-fr': ['3QCM3-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM Probabilité (issu du brevet décembre 2023 Nouvelle Calédonie)'

export default class NouvelleCaledonieDec23Exo1Q1 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$2{,}7 \\times 10^{-7}$',
      '$2{,}7 \\times 10^0$',
      '$2{,}7 \\times 10^7$'
    ]
    this.enonce = 'D\'après des chercheurs, la probabilité qu\'une personne subisse une attaque mortelle par un requin au cours de sa vie, est de ...'
    this.correction = `C'est la seule inférieure à $1$ : $${miseEnEvidence('2{,}7 \\times 10^{-7}')}$.`
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
