import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import ExerciceQcm from '../ExerciceQcm'

export const uuid = '481c6'
export const refs = {
  'fr-fr': ['3QCM1-5'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul de médiane (issu du brevet 202 Métropole)'

export default class MetropoleJuin24Exo4Q5 extends ExerciceQcm {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$1{,}67$',
      '$1{,}72$',
      '$1{,}75$'
    ]
    this.enonce = 'On a mesuré les tailles, en m, de sept élèves :<br>$1{,}46~;~1{,}65~;~1{,}6~;~1{,}72~;~1{,}7~;~1{,}67~;~1{,}75$<br>Quelle est la médiane, en m, de ces tailles ?'
    this.correction = `On a dans l'ordre croissant : $1{,}46~\\leq~1{,}6~\\leq~1{,}65~\\leq~ {\\red{1{,}67}}~\\leq~1{,}7~\\leq~ 1{,}72~\\leq~1{,}75$.<br>
    Il y a autant de tailles inférieures à 1,67m que de tailles supérieures à 1,67m,donc ${texteEnCouleurEtGras('1,67m')} est la médiane.`
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
