import ExerciceQcm from '../ExerciceQcm'

export const uuid = 'NCD23E1Q1'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul d\'image par une fonction (issu du brevet 2024 Métropole)'

export default class NouvelleCaledonieDec23Exo1Q1 extends ExerciceQcm {
  constructor () {
    super()
    this.reponses = []
    this.reponses = [
      '$2{,}7 \\times 10^{-7}$',
      '$2{,}7 \\times 10^0$',
      '$2{,}7 \\times 10^7$'
    ]
    this.bonneReponse = 0
    this.enonce = 'D\'après des chercheurs, la probabilité qu\'une personne subisse une attaque mortelle par un requin au cours de sa vie, est de ...'
    this.correction = 'C\'est la seule inférieure à 1.'
  }
}
