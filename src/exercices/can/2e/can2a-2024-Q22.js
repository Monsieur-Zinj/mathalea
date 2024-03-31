import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { equalFractionCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Calculer une probabilité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'fc596'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = true
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
    this.compare = equalFractionCompare
    this.optionsChampTexte = { texteApres: '.' }
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(3, 6).simplifie().texFraction
      this.question = `On lance un dé à six faces numérotées de 1 à 6. <br>
        La probabilité d’obtenir un nombre  premier est : `

      this.correction = `Comme il y a $3$ nombres premiers inférieurs ou égaux à $6$ ($2$, $3$ et $5$), la probabilité d'obtenir un nombre premier  est $\\dfrac{3}{6}=${miseEnEvidence(this.reponse)}$.`
      this.canEnonce = `On lance un dé à six faces numérotées de 1 à 6. <br>
      La probabilité d’obtenir un nombre  premier est : `
      this.canReponseACompleter = '$\\ldots$'
    } else {
      const b = choice([2, 3])
      const c = choice([4, 5, 6])
      switch (choice(['a', 'b', 'c', 'd'])) {
        case 'a':
          this.reponse = new FractionEtendue(1, b).texFraction
          this.question = `On lance un dé cubique équilibré.<br> 
          La probabilité d’obtenir un  multiple de $${b}$  est : `
          this.correction = `Comme il y a $${5 - b}$ multiples de $${b}$, la probabilité d'obtenir un multiple de $${b}$ est $\\dfrac{${5 - b}}{6}=${miseEnEvidence(this.reponse)}$.`
          this.correction = `Comme il y a $3$ nombres premiers inférieurs ou égal à $6$ : 2, 3 et 5, la probabilité d'obtenir un nombre premier est $\\dfrac{3}{6}=${miseEnEvidence(this.reponse)}$.`
          this.canEnonce = `On lance un dé cubique équilibré.<br> 
          La probabilité d’obtenir un  multiple de $${b}$  est :`
          this.canReponseACompleter = '$\\ldots$'
          break
        case 'b':
          this.reponse = new FractionEtendue(1, 2).texFraction
          this.question = `On lance un dé à six faces numérotées de 1 à 6. <br>
              La probabilité d’obtenir un nombre premier est : `
          this.correction = `Comme il y a $3$ nombres premiers inférieurs ou égal à $6$ : 2, 3 et 5, la probabilité d'obtenir un nombre premier est $\\dfrac{3}{6}=${miseEnEvidence(this.reponse)}$.`
          this.canEnonce = `On lance un dé à six faces numérotées de 1 à 6. <br>
          La probabilité d’obtenir un nombre premier est : `
          this.canReponseACompleter = '$\\ldots$'
          break
        case 'c':
          this.reponse = new FractionEtendue(1, 6).texFraction
          this.question = `On lance un dé cubique équilibré.<br> 
                  La probabilité d’obtenir un  multiple de $${c}$  est : `
          this.correction = `Comme il y a $1$ multiple de $${c}$, la probabilité d'obtenir un multiple de $${c}$ est $${miseEnEvidence(this.reponse)}$.`
          this.canEnonce = `On lance un dé cubique équilibré.<br> 
          La probabilité d’obtenir un  multiple de $${c}$  est : `
          this.canReponseACompleter = '$\\ldots$'
          break

        case 'd':
          this.reponse = new FractionEtendue(5, 6).texFraction
          this.question = `On lance un dé cubique équilibré.<br> 
                      La probabilité d’obtenir un  diviseur de $12$  est : `
          this.correction = `Comme il y a $5$ diviseurs de $12$, la probabilité d'obtenir undiviseur de $12$  est $${miseEnEvidence(this.reponse)}$.`
          this.canEnonce = `On lance un dé cubique équilibré.<br> 
          La probabilité d’obtenir un  diviseur de $12$  est : `
          this.canReponseACompleter = '$\\ldots$'
          break
      }
    }
    if (!this.interactif) {
      this.question += ' $\\ldots$'
    }
  }
}
