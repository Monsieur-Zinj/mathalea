import { createList } from '../../lib/format/lists'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = 'PJE2Q5'
export const refs = {
  'fr-fr': ['TQCMProb-2'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Bac Polynésie juin 2024 E2Q5'
export const dateDePublication = '28/10/2024'
/**
 * Ceci est un exo construit à partir d'une question de qcm de Bac.
 * Il utilise la classe ExerciceQcm qui définit les contours de l'exo (sans version aléatoire)
 * Ce moule à exo dispose d'une méthode qcmCamExport qui permet de récupérer le JSON de la question et de la reponse pour qcmCam.
 * Il est interactif et dispose d'un export AMC d'office
 */
export default class PolynesieJuin2024Ex2Q5 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$\\displaystyle\\binom{20}{3} \\times \\binom{11}{2}$',
      '$\\displaystyle\\binom{20}{3} + \\binom{11}{2}$',
      '$\\displaystyle\\binom{20}{3}$',
      '$20^3 \\times 11^2$'

    ]
    const list = createList({
      items: ['10 élèves ont choisi la spécialité physique-chimie',
        '20 élèves ont choisi la spécialité SES',
        '1 élève a choisi la spécialité LLCE espagnol.'],
      style: 'fleches'
    })
    this.enonce = `Une professeure de Spé Maths s'intéresse à l'autre spécialité des 31 élèves de son groupe :
   ${list}
    Elle veut former un groupe de 5 élèves comportant exactement 3 élèves ayant choisi la
        spécialité SES.<br>De combien de façons différentes peut-elle former un tel groupe ?`
    this.correction = 'Elle choisit 3 élèves parmi les 20 faisant SES : elle a $\\displaystyle\\binom{20}{3}$ possibilités.<br>'
    this.correction += 'Ensuite dans chacun de ces cas elle choisit 2 élèves parmi les $31 - 20 = 11$ élèves qui ne font pas SES,<br>'
    this.correction += 'ce qui fait $\\displaystyle\\binom{20}{3} \\times \\binom{11}{2}$ possibilités.'
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
