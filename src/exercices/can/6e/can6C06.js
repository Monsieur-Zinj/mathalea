import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Diviser par 9'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6C06
 */
export const uuid = '8be78'
export const ref = 'can6C06'
export const refs = {
  'fr-fr': ['can6C06'],
  'fr-ch': []
}
export default function DivisionPar9 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const b = randint(2, 9)
    let a
    switch (choice([1, 2, 3])) {
      case 1:
        a = b * 90 + 9
        this.question = `Calculer $${texNombre(a, 0)}\\div 9$.`
        this.reponse = a / 9
        this.correction = `$${texNombre(a, 0)}\\div 9 = ${texNombre(this.reponse, 0)}$`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
        On décompose $${texNombre(a, 0)}$ en $${texNombre(b * 90, 0)}+9$.<br>
$${texNombre(b * 90, 0)}\\div 9= ${texNombre(b * 10, 0)}$ et $9\\div 9=1$. <br>
On obtient donc comme résultat : $${texNombre(a, 0)}\\div 9=${texNombre(b * 10, 0)}+1$, soit $${texNombre(this.reponse, 0)}$.
          `)
        break
      case 2:
        a = b * 900 + 9
        this.question = `Calculer $${texNombre(a, 0)}\\div 9$.`
        this.reponse = a / 9
        this.correction = `$${texNombre(a, 0)}\\div 9 = ${texNombre(this.reponse, 0)}$`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
        On décompose $${texNombre(a, 0)}$ en $${texNombre(b * 900, 0)}+9$.<br>
$${texNombre(b * 900, 0)}\\div 9= ${texNombre(b * 100, 0)}$ et $9\\div 9=1$. <br>
On obtient donc comme résultat : $${texNombre(a, 0)}\\div 9=${texNombre(b * 100, 0)}+1$, soit $${texNombre(this.reponse, 0)}$.
          `)
        break
      case 3:
        a = b * 900 + 90
        this.question = `Calculer $${texNombre(a, 0)}\\div 9$.`
        this.reponse = a / 9
        this.correction = `$${texNombre(a, 0)}\\div 9 = ${texNombre(this.reponse, 0)}$`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
        On décompose $${texNombre(a, 0)}$ en $${texNombre(b * 900, 0)}+90$.<br>
$${texNombre(b * 900, 0)}\\div 9= ${texNombre(b * 100, 0)}$ et $90\\div 9=10$. <br>
On obtient donc comme résultat : $${texNombre(a, 0)}\\div 9=${texNombre(b * 100, 0)}+10$, soit $${texNombre(this.reponse, 0)}$.
          `)
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
