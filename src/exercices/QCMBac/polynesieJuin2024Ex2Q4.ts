import ExerciceQcm from '../ExerciceQcm'

export const uuid = 'PJE2Q4'
export const refs = {
  'fr-fr': ['TQCMProb-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Bac Polynésie juin 2024 E2Q4'
export const dateDePublication = '28/10/2024'
/**
 * Ceci est un exo construit à partir d'une question de qcm de Bac.
 * Il utilise la classe ExerciceQcm qui définit les contours de l'exo (sans version aléatoire)
 * Ce moule à exo dispose d'une méthode qcmCamExport qui permet de récupérer le JSON de la question et de la reponse pour qcmCam.
 * Il est interactif et dispose d'un export AMC d'office
 */
export default class PolynesieJuin2024Ex2Q4 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$\\dbinom{31}{5}$',
      '$31^5$',
      '$31\\times30\\times29\\times28\\times27$',
      '$31+30+29+28+27$'

    ]

    this.enonce = ` Une professeure enseigne la spécialité mathématiques dans une classe de 31 élèves de terminale.<br>
Elle veut former un groupe de 5 élèves.<br> De combien de façons différentes peut-elle former
un tel groupe de 5 élèves ?`
    this.correction = 'Le nombre de groupes de 5 élèves parmi les 31 est $\\displaystyle\\binom{31}{5}$.'
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
