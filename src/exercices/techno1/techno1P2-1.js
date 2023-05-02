import Exercice from '../Exercice.js'
import { randint, arrondi, choice, texNombre } from '../../modules/outils.js'
export const titre = 'Appliquer un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
* Modèle d'exercice très simple pour la course aux nombres
* @author Stéphane Guyon
* Référence
* Date de publication
*/
export const uuid = 'a66ad'
export const ref = 'techno1P2-1'
export default function Proportion () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 3
  this.formatChampTexte = 'largeur15 inline'
  // this.optionsChampTexte = { texteApres: ' €' }
  this.nouvelleVersion = function () {
    let a, b
    switch (choice(['simple'])) {
      case 'simple':
        b = randint(3, 80)/* Pourcentage */
        a = randint(10, 100)/* Valeur */
        this.question = `Calculer  $${b}\\,\\%$ de $${a}$. `
        this.correction = `Calculer $p\\,\\%$ d'un nombre, c'est multiplier ce nombre par $\\dfrac{p}{100}$.
<br>    Ainsi, $${b}\\,\\%$  de $${a}$ est égal à $${texNombre(b / 100)}\\times ${a}=${texNombre(b * a / 100)}$.`
        this.reponse = arrondi(b * a / 100, 2)
        break
    }
  }
}
