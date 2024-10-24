import ExerciceQcm from './ExerciceQcm'

// class à utiliser pour fabriquer des Qcm ayant une version aléatoire
class ExerciceQcmA extends ExerciceQcm {
  constructor () {
    super()
    this.besoinFormulaireCaseACocher = ['version originale', false]
    this.sup = false
    this.qcmAleatoire = true
  }
}
export default ExerciceQcmA
