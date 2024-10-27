import ExerciceQcm from './ExerciceQcm'

// class à utiliser pour fabriquer des Qcm ayant une version aléatoire
export default class ExerciceQcmA extends ExerciceQcm {
  versionAleatoire: () => void = () => {}
  constructor () {
    super()
    this.besoinFormulaireCaseACocher = ['version originale', false]
    this.sup = false
    this.qcmAleatoire = true
    this.versionAleatoire()
  }

  aleatoire: ()=>void = () => {}
}
