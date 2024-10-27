import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { premierAvec } from '../../lib/outils/primalite'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = 'fde1e'
export const refs = {
  'fr-fr': ['3QCM2-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM divisibilité (issu du brevet Septembre 2023 Métropole)'

export default class MetropoleSept23Exo1Q1 extends ExerciceQcmA {
  versionOriginale: () => void = () => {
    this.reponses = [
      '$2$, $3$ et $4$',
      '$2$, $5$ et $7$',
      '$84$, $168$ et $252$'
    ]
    this.enonce = 'Citer deux diviseurs de $84$.'
    this.correction = `$5$ ne divise pas $84$ ; $168$ et $252$ non plus : par contre $${miseEnEvidence('2\\text{, }3\\text{ et }4')}$ divisent $84$.`
  }

  versionAleatoire: () => void = () => {
    let a = choice([2, 3, 5])
    let b = choice([2, 3, 4, 5, 7, 10], [a])
    let c = choice([2, 3, 4, 5, 7, 10], [a, b]);
    [a, b, c] = [a, b, c].sort((a, b) => a - b)
    const pasPremierAvecResultat = choice([2, 3, 4, 5, 7], [a, b, c])
    const multiple = a * b * c * pasPremierAvecResultat
    const detrompeurs1 = [multiple, multiple * 2, multiple * 3]
    const premier = premierAvec(multiple, [], true)
    const detrompeurs2 = [a, premier, pasPremierAvecResultat].sort((a, b) => a - b)
    this.reponses = [
      `$${a}$, $${b}$ et $${c}$`, // bonne réponse
      `$${detrompeurs1[0]}$, $${detrompeurs1[1]}$ et $${detrompeurs1[2]}$`,
      `$${detrompeurs2[0]}$, $${detrompeurs2[1]}$ et $${detrompeurs2[2]}$`
    ]
    this.enonce = `Citer trois diviseurs de $${multiple}$.`
    this.correction = `$${premier}$ ne divise pas $${multiple}$ ; $${detrompeurs1[1]}$ et $${detrompeurs1[2]}$ non plus ; par contre $${miseEnEvidence(`${a}\\text{, }${b}\\text{ et }${c}`)}$ divisent $${multiple}$.`
  }

  constructor () {
    super()
    this.versionAleatoire()
  }
}
