import ExerciceQcm from '../ExerciceQcm'

export const uuid = 'MJ24E4Q2'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul de puissance (issu du brevet 202 Métropole)'

class MetropoleJuin24Exo4Q2 extends ExerciceQcm {
  constructor () {
    super()
    this.reponses = [
      '$-125$',
      '$-15$',
      '$125$'
    ]
    this.bonneReponse = 0
    this.enonce = 'Combien vaut $(-5)^3$ ?'
    this.correction = '$(- 5)^3 = (- 5) \\times (- 5) \\times (- 5) = - 125$.'
  }
}
export default MetropoleJuin24Exo4Q2
