import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre.js'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
export const titre = 'Trouver le complément à 1'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 * Référence can6C20
 */
export const uuid = '9e396'
export const ref = 'can6C20'
export default function ComplementAUn () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = 'largeur15 inline'
  this.typeExercice = 'simple'
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let a
    switch (choice([1, 2, 3])) {
      case 1:
        a = calculANePlusJamaisUtiliser(randint(2, 9) / 10)
        this.question = `Calculer $1-${texNombre(a)}$.`
        this.correction = `$1-${texNombre(a)}=${texNombre(1 - a)}$`
        this.reponse = calculANePlusJamaisUtiliser(1 - a)
        this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    $1$ unité = $10$ dixièmes.<br>
    On enlève $${texNombre(10 * a)}$ dixièmes à $10$ dixièmes, il en reste $${texNombre(10 * (1 - a))}$.<br>
    Ainsi, $1-${texNombre(a)}=${texNombre(1 - a)}$.  `)
        break
      case 2:
        a = calculANePlusJamaisUtiliser(randint(2, 9) / 100)
        this.question = `Calculer $1-${texNombre(a)}$.`
        this.correction = `$1-${texNombre(a)}=${texNombre(1 - a)}$`
        this.reponse = calculANePlusJamaisUtiliser(1 - a)
        this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    $1$ unité = $100$ centièmes.<br>
    On enlève $${texNombre(100 * a)}$ centièmes à $100$ centièmes, il en reste $${texNombre(100 * (1 - a))}$.<br>
    Ainsi, $1-${texNombre(a)}=${texNombre(1 - a)}$.  `)
        break
      case 3:
        a = calculANePlusJamaisUtiliser(randint(2, 9) / 1000)
        this.question = `Calculer $1-${texNombre(a)}$.`
        this.correction = `$1-${texNombre(a)}=${texNombre(1 - a)}$`
        this.reponse = calculANePlusJamaisUtiliser(1 - a)
        this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    $1$ unité = $1000$ millièmes.<br>
    On enlève $${texNombre(1000 * a)}$ millièmes à $1000$ millièmes, il en reste $${texNombre(1000 * (1 - a))}$.<br>
    Ainsi, $1-${texNombre(a)}=${texNombre(1 - a)}$.  `)
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
