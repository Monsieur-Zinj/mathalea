import { choice } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../modules/outils.js'
export const titre = 'Proportions'
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
export const uuid = 'c7270'
export const ref = 'techno1P3'
export const refs = {
  'fr-fr': ['techno1P3'],
  'fr-ch': []
}
export default function Proportion () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    let a, b, c, d
    switch (choice(['simple'])) {
      case 'simple':
        b = choice([2, 3, 4, 6, 8, 9]) /* Numérateur fraction */
        c = choice([5, 7, 11, 13])/* Dénominateur fraction */
        d = randint(4, 11)/* Multiple */
        a = c * d
        this.question = `Calculer  $\\dfrac{${b}}{${c}}$ de $${a}$.  <br> `
        this.correction = `Calculer la fraction d'un nombre, c'est multiplier la fraction par ce nombre.
<br><br>    Ainsi, $\\dfrac{${b}}{${c}}$  de $${a}$ est égal à $\\dfrac{${b}}{${c}}\\times ${a}=\\dfrac{${b}\\times${a}}{${c}}=\\dfrac{${b}\\times${c}\\times${d}}{${c}}=${texNombre(b * d)}$.`
        this.reponse = calculANePlusJamaisUtiliser(d * b)
        break
    }
  }
}
