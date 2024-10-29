import { reduireAxPlusB } from '../../lib/outils/ecritures'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { randint } from '../../modules/outils'
import { nombreElementsDifferents } from '../ExerciceQcm'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = '7678c'

export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calculating the image by a function (from the 2024 Metropole exam)'
export const dateDePublication = '10/28/2024'
// This is an example of a QCM with original and random versions
export default class MetropoleJuin24Exo4Q1 extends ExerciceQcmA {
  // This function handles writing the statement, correction, and answers
  // It factors out the code that would be duplicated in versionAleatoire and versionOriginale
  private appliquerLesValeurs (a: number, b: number, c: number): void {
    this.reponses = [
      `$${String(a * c - b)}$`,
      `$${String(a * c + b)}$`,
      `$${String(a + c - b)}$`
    ]
    this.enonce = `We consider the function $f$ defined by $f(x) = ${reduireAxPlusB(a, -b)}$.<br>What is the image of $${c.toString()}$ by this function?`
    this.correction = `$f(x) = ${reduireAxPlusB(a, -b)}$, so $f(${c.toString()}) = ${a}\\times (${c.toString()}) - ${b.toString()} = ${miseEnEvidence((a * c - b).toString())}$.`
  }

  // Handles passing the original data to the appliquerLesValeurs function
  versionOriginale: () => void = () => {
    this.appliquerLesValeurs(3, 2, -4) // original values for f(x) = {a=3}x-{b=2} with x={c=-4}
  }

  // Handles randomizing the values to pass to the appliquerLesValeurs function, ensuring we have 3 different answers
  // For a QCM with n answers, we would need to check that nombreElementsDifferents(this.reponses) < n
  versionAleatoire: () => void = () => {
    do {
      const a = randint(2, 6)
      const b = randint(2, 9, [a])
      const c = -randint(2, 5)

      this.appliquerLesValeurs(a, b, c)
    } while (nombreElementsDifferents(this.reponses) < 3)
  }

  constructor () {
    super()
    this.versionOriginale()
  }
}
