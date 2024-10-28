import { reduireAxPlusB } from '../../lib/outils/ecritures'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { randint } from '../../modules/outils'
import { nombreElementsDifferents } from '../ExerciceQcm'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = '67e15'
export const refs = {
  'fr-fr': ['3QCMF-M24-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul d\'image par une fonction (issu du brevet 2024 Métropole)'
export const dateDePublication = '28/10/2024'

export default class MetropoleJuin24Exo4Q1 extends ExerciceQcmA {
  private setCommonData (a: number, b: number, c: number): void {
    this.reponses = [
      `$${String(a * c - b)}$`,
      `$${String(a * c + b)}$`,
      `$${String(a + c - b)}$`
    ]
    this.enonce = `On considère la fonction $f$ définie par $f(x) = ${reduireAxPlusB(a, -b)}$.<br>Quelle est l'image de $${c.toString()}$ par cette fonction ?`
    this.correction = `$f(x) = ${reduireAxPlusB(a, -b)}$, donc $f(${c.toString()}) = ${a}\\times (${c.toString()}) - ${b.toString()} = ${miseEnEvidence((a * c - b).toString())}$.`
  }

  versionOriginale: () => void = () => {
    this.setCommonData(3, 2, -4)
  }

  versionAleatoire: () => void = () => {
    do {
      const a = randint(2, 6)
      const b = randint(2, 9, [a])
      const c = -randint(2, 5)

      this.setCommonData(a, b, c)
    } while (nombreElementsDifferents(this.reponses) < 3)
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
