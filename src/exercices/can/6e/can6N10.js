import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Passer d’un calcul de fractions décimales à une écriture décimale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '15/12/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/*!
 * @author Gilles Mora
 */
export const uuid = '93bb5'
export const ref = 'can6N10'
export const refs = {
  'fr-fr': ['can6N10'],
  'fr-ch': []
}
export default function FractionDecimaleEcritureDecimale1 () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 1
  this.typeExercice = 'simple'
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    let a, b, c, u
    switch (choice(['a', 'b', 'c', 'd', 'e'])) { //,
      case 'a':
        a = randint(1, 9)
        b = randint(1, 9)
        c = randint(1, 9)

        this.reponse = calculANePlusJamaisUtiliser(a * 0.1 + b * 0.01 + c * 0.001)
        if (choice([true, false])) {
          this.question = `Calculer $\\dfrac{${b}}{100}+\\dfrac{${a}}{10}+\\dfrac{${c}}{1000}$ sous forme décimale. `
          this.correction = `$\\dfrac{${b}}{100}+\\dfrac{${a}}{10}+\\dfrac{${c}}{1000}=${texNombre(b / 100)}+${texNombre(a / 10)}+${texNombre(c / 1000)}=${texNombre(a / 10 + b / 100 + c / 1000)}$`
        } else {
          this.question = `Calculer $\\dfrac{${c}}{1000}+\\dfrac{${a}}{10}+\\dfrac{${b}}{100}$ sous forme décimale. `
          this.correction = `$\\dfrac{${c}}{1000}+\\dfrac{${a}}{10}+\\dfrac{${b}}{100}=${texNombre(c / 1000)}+${texNombre(a / 10)}+${texNombre(b / 100)}=${texNombre(a / 10 + b / 100 + c / 1000)}$`
        }
        break
      case 'b':
        u = randint(1, 99)
        a = randint(1, 9, [20, 30, 40, 50])
        c = randint(1, 9)
        this.reponse = calculANePlusJamaisUtiliser(u + a * 0.1 + c * 0.001)
        if (choice([true, false])) {
          this.question = `Calculer  $${u}+\\dfrac{${a}}{10}+\\dfrac{${c}}{1000}$ sous forme décimale. `
          this.correction = `$${u}+\\dfrac{${a}}{10}+\\dfrac{${c}}{1000}=${u}+${texNombre(a / 10)}+${texNombre(c / 1000)}=${texNombre(u + a / 10 + c / 1000)}$`
        } else {
          this.question = `Calculer  $${u}+\\dfrac{${c}}{1000}+\\dfrac{${a}}{10}$ sous forme décimale. `
          this.correction = `$${u}+\\dfrac{${c}}{1000}+\\dfrac{${a}}{10}=${u}+${texNombre(c / 1000)}+${texNombre(a / 10)}=${texNombre(u + a / 10 + c / 1000)}$
         `
        }
        break
      case 'c':
        u = randint(1, 99)
        b = randint(1, 9)
        c = randint(1, 9)
        this.reponse = calculANePlusJamaisUtiliser(u + b * 0.01 + c * 0.001)
        if (choice([true, false])) {
          this.question = `Calculer  $${u}+\\dfrac{${b}}{100}+\\dfrac{${c}}{1000}$ sous forme décimale. `
          this.correction = `$${u}+\\dfrac{${b}}{100}+\\dfrac{${c}}{1000}=${u}+${texNombre(b / 100)}+${texNombre(c / 1000)}=${texNombre(u + b / 100 + c / 1000)}$`
        } else {
          this.question = `Calculer  $${u}+\\dfrac{${c}}{1000}+\\dfrac{${b}}{100}$ sous forme décimale. `
          this.correction = `$${u}+\\dfrac{${c}}{1000}+\\dfrac{${b}}{100}=${u}+${texNombre(c / 1000)}+${texNombre(b / 100)}=${texNombre(u + b / 100 + c / 1000)}$`
        }
        break
      case 'd':
        a = randint(1, 9)
        c = randint(1, 9)
        this.reponse = calculANePlusJamaisUtiliser(a * 0.1 + c * 0.001)
        if (choice([true, false])) {
          this.question = `Calculer  $\\dfrac{${a}}{10}+\\dfrac{${c}}{1000}$ sous forme décimale. `
          this.correction = `$\\dfrac{${a}}{10}+\\dfrac{${c}}{1000}=${texNombre(a / 10)}+${texNombre(c / 1000)}=${texNombre(a / 10 + c / 1000)}$`
        } else {
          this.question = `Calculer $\\dfrac{${c}}{1000}+\\dfrac{${a}}{10}$ sous forme décimale. `
          this.correction = `$\\dfrac{${c}}{1000}+\\dfrac{${a}}{10}=${texNombre(c / 1000)}+${texNombre(a / 10)}=${texNombre(a / 10 + c / 1000)}$`
        }
        break
      case 'e':
        u = randint(1, 99)
        b = randint(11, 99)
        c = randint(1, 9)
        this.reponse = calculANePlusJamaisUtiliser(u + b * 0.01 + c * 0.001)
        if (choice([true, false])) {
          this.question = `Calculer  $${u}+\\dfrac{${b}}{100}+\\dfrac{${c}}{1000}$ sous forme décimale. `
          this.correction = `$${u}+\\dfrac{${b}}{100}+\\dfrac{${c}}{1000}=${u}+${texNombre(b / 100)}+${texNombre(c / 1000)}=${texNombre(u + b / 100 + c / 1000)}$`
        } else {
          this.question = `Calculer  $${u}+\\dfrac{${c}}{1000}+\\dfrac{${b}}{100}$ sous forme décimale. `
          this.correction = `$${u}+\\dfrac{${c}}{1000}+\\dfrac{${b}}{100}=${u}+${texNombre(c / 1000)}+${texNombre(b / 100)}=${texNombre(u + b / 100 + c / 1000)}$`
        }
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
