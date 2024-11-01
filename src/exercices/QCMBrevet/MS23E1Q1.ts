import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { premierAvec } from '../../lib/outils/primalite'
import { nombreElementsDifferents } from '../ExerciceQcm'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = 'fde1e'
export const refs = {
  'fr-fr': ['3QCMN-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM divisibilité (Septembre 2023 Métropole)'
export const dateDePublication = '28/10/2024'

export default class MetropoleSept23Exo1Q1 extends ExerciceQcmA {
  private appliquerLesValeurs (bonneReponse: number[], detrompeurs1:number[], detrompeurs2:number[]): void {
    const premierAvec = detrompeurs1[1]
    detrompeurs1.sort((a, b) => a - b)
    this.reponses = [
      `$${bonneReponse[0]}$, $${bonneReponse[1]}$ et $${bonneReponse[2]}$`, // bonne réponse
      `$${detrompeurs1[0]}$, $${detrompeurs1[1]}$ et $${detrompeurs1[2]}$`,
      `$${detrompeurs2[0]}$, $${detrompeurs2[1]}$ et $${detrompeurs2[2]}$`
    ]
    this.enonce = `Citer trois diviseurs de $${detrompeurs2[0]}$.`
    this.correction = `$${premierAvec}$ ne divise pas $${detrompeurs2[0]}$ ; $${detrompeurs2[1]}$ et $${detrompeurs2[2]}$ non plus ; par contre $${miseEnEvidence(`${bonneReponse[0]}\\text{, }${bonneReponse[1]}\\text{ et }${bonneReponse[2]}`)}$ divisent $${detrompeurs2[0]}$.`
  }

  versionOriginale: () => void = () => {
    this.appliquerLesValeurs([2, 3, 4], [2, 5, 7], [84, 168, 252])
  }

  versionAleatoire: () => void = () => {
    const n = 3
    do {
      let a = choice([2, 3, 5])
      let b = choice([2, 3, 4, 5, 7, 10], [a])
      let c = choice([2, 3, 4, 5, 7, 10], [a, b]);
      [a, b, c] = [a, b, c].sort((a, b) => a - b)
      const pasPremierAvecResultat = choice([2, 3, 4, 5, 7], [a, b, c])
      const multiple = a * b * c * pasPremierAvecResultat
      const detrompeurs2 = [multiple, multiple * 2, multiple * 3]
      const premier = premierAvec(multiple, [], true)
      const detrompeurs1 = [a, premier, pasPremierAvecResultat]

      this.appliquerLesValeurs([a, b, c], detrompeurs1, detrompeurs2)
    } while (nombreElementsDifferents(this.reponses) < n)
  }

  constructor () {
    super()
    this.versionAleatoire()
  }
}
