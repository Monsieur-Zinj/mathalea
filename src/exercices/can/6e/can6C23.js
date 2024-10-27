import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Calculer avec +/-99 ou +/-999'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gille Mora
 * Créé pendant l'été 2021
 * Référence can6C23
 * Date de publication
*/
export const uuid = 'ad0ee'
export const ref = 'can6C23'
export const refs = {
  'fr-fr': ['can6C23'],
  'fr-ch': []
}
export default function CalculAvec99 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    let a
    switch (choice(['a', 'b', 'c', 'd', 'e'])) { //
      case 'a':
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9))
        this.question = `Calculer $${texNombre(a)}+99$.`
        this.correction = `$${texNombre(a)}+99=${texNombre(a + 99)}$.`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
       Pour ajouter $99$, on ajoute $100$ et on retranche $1$.<br>
       $${texNombre(a)}+99=${texNombre(a)}+\\underbrace{100-1}_{99}=${texNombre(a + 100)}-1=${texNombre(a + 99)}$.
          `)
        this.reponse = calculANePlusJamaisUtiliser(a + 99)
        break
      case 'b':
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 1000 + randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9))
        this.question = `Calculer $${texNombre(a)}+999$.`
        this.correction = `$${texNombre(a)}+999=${texNombre(a + 999)}$.`
        this.reponse = calculANePlusJamaisUtiliser(a + 999)
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
       Pour ajouter $999$, on ajoute $${texNombre(1000)}$ et on retranche $1$.<br>
       $${texNombre(a)}+999=${texNombre(a)}+\\underbrace{1000-1}_{999}=${texNombre(a + 1000)}-1=${texNombre(a + 999)}$.
          `)
        break

      case 'c':
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 1000 + randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9))
        this.question = `Calculer $${texNombre(a)}-999$.`
        this.correction = `$${texNombre(a)}-999=${texNombre(a - 999)}$.`
        this.reponse = calculANePlusJamaisUtiliser(a - 999)
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
       Pour retrancher $999$, on retranche $${texNombre(1000)}$ et on ajoute $1$.<br>
       $${texNombre(a)}-999=${texNombre(a)}\\underbrace{-1000+1}_{-999}=${texNombre(a - 1000)}+1=${texNombre(a - 999)}$.
          `)
        break
      case 'd':
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9))
        this.question = `Calculer $${texNombre(a)}-99$.`
        this.correction = `$${texNombre(a)}-99=${texNombre(a - 99)}$.`
        this.reponse = calculANePlusJamaisUtiliser(a - 99)
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
       Pour retrancher $99$, on retranche $100$ et on ajoute $1$.<br>
       $${texNombre(a)}-99=${texNombre(a)}\\underbrace{-100+1}_{-99}=${texNombre(a - 100)}+1=${texNombre(a - 99)}$.
          `)
        break
      case 'e':
        a = calculANePlusJamaisUtiliser(randint(1, 9) * 1000 + randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9))
        this.question = `Calculer $${texNombre(a)}+99$.`
        this.correction = `$${texNombre(a)}+99=${texNombre(a + 99)}$.`
        this.reponse = calculANePlusJamaisUtiliser(a + 99)
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
        Pour ajouter $99$, on ajoute $100$ et on retranche $1$.<br>
        $${texNombre(a)}+99=${texNombre(a)}+\\underbrace{100-1}_{99}=${texNombre(a + 100)}-1=${texNombre(a + 99)}$.
           `)
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
