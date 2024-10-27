import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = 'Z2024E5Q2'
export const refs = {
  'fr-fr': ['TQCMProb-3'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Bac Sujet zéro 2024 E5Q2'
/**
 * Ceci est un exo construit à partir d'une question de qcm de Bac.
 * Il utilise la classe ExerciceQcm qui définit les contours de l'exo (sans version aléatoire)
 * Ce moule à exo dispose d'une méthode qcmCamExport qui permet de récupérer le JSON de la question et de la reponse pour qcmCam.
 * Il est interactif et dispose d'un export AMC d'office
 */
export default class SujetZero2024Ex5Q2 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$\\dfrac{50\\times 49\\times 48}{1\\times 2\\times 3}$',
      '$50^{3}$',
      '$1 \\times 2 \\times 3$',
      '$50 \\times 49 \\times 48$'

    ]

    this.enonce = `Une urne contient cinquante boules numérotées de 1 à 50.<br> On tire successivement trois boules dans cette urne, ${texteEnCouleurEtGras('sans remise')}. <br>
    On appelle  "tirage" la liste non ordonnée des numéros des trois boules tirées. <br> Quel est le nombre de tirages possibles, sans tenir compte de l'ordre des numéros ?`
    this.correction = '$\\displaystyle\\binom{50}{3}=\\dfrac{50\\times 49\\times 48}{1\\times 2\\times 3}$'
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
