import { choice } from '../../../lib/outils/arrayOutils.js'
import { texteEnCouleur } from '../../../lib/outils/embellissements.js'
import { texNombre } from '../../../lib/outils/texNombre.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
export const titre = 'Multiplier astucieusement'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6C05
 */
export const uuid = 'c8078'
export const ref = 'can6C05'
export default function MultiplierAstucieusement () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = randint(1, 9)
    const b = randint(1, 9, a)
    const c = randint(1, 9, [a, b])
    this.reponse = a * 100 + b * 10 + c
    const d = this.reponse / 100
    switch (choice([1, 2, 3, 4])) {
      case 1:
        this.question = `Calculer $4 \\times ${texNombre(d, 2)}\\times 25$.`
        this.correction = `$4 \\times ${texNombre(d, 2)}\\times 25 = 100 \\times ${texNombre(d, 2)} = ${texNombre(this.reponse, 0)}$`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
  On remarque dans $4 \\times ${texNombre(d, 2)}\\times 25$ le produit $4\\times 25$ qui donne $100$.<br>
  Il reste alors à multiplier par $100$ le nombre $${texNombre(d, 2)}$ : le chiffre des unités ($${a}$) devient le chiffre des centaines, etc ...
  on obtient ainsi comme résultat : $${texNombre(this.reponse, 0)}$.
    `)
        break
      case 2:
        this.question = `Calculer $2 \\times ${texNombre(d, 2)}\\times 50$.`
        this.correction = `$2 \\times ${texNombre(d, 2)}\\times 50 = 100 \\times ${texNombre(d, 2)} = ${texNombre(this.reponse, 0)}$`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
  On remarque dans $2 \\times ${texNombre(d, 2)}\\times 50$ le produit $2\\times 50$ qui donne $100$.<br>
  Il reste alors à multiplier par $100$ le nombre $${texNombre(d, 2)}$ : le chiffre des unités ($${a}$) devient le chiffre des centaines, etc ...
  on obtient ainsi comme résultat : $${texNombre(this.reponse, 0)}$.
    `)
        break
      case 3:
        this.question = `Calculer $25 \\times ${texNombre(d, 2)}\\times 4$.`
        this.correction = `$25 \\times ${texNombre(d, 2)}\\times 4 = 100 \\times ${texNombre(d, 2)} = ${texNombre(this.reponse, 0)}$`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
        On remarque dans $25 \\times ${texNombre(d, 2)}\\times 4$ le produit $4\\times 25$ qui donne $100$.<br>
        Il reste alors à multiplier par $100$ le nombre $${texNombre(d, 2)}$ : le chiffre des unités ($${a}$) devient le chiffre des centaines, etc ...
        on obtient ainsi comme résultat : $${texNombre(this.reponse, 0)}$.
          `)
        break
      case 4:
        this.question = `Calculer $50 \\times ${texNombre(d, 2)}\\times 2$.`
        // Si les exos can avaient toujours cette propriété this.question on pourrait faire un ajout automatique
        this.correction = `$50 \\times ${texNombre(d, 2)}\\times 2 = 100 \\times ${texNombre(d, 2)} = ${texNombre(this.reponse, 0)}$`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
  On remarque dans $50 \\times ${texNombre(d, 2)}\\times 2$ le produit $2\\times 50$ qui donne $100$.<br>
  Il reste alors à multiplier par $100$ le nombre $${texNombre(d, 2)}$ : le chiffre des unités ($${a}$) devient le chiffre des centaines, etc ...
  on obtient ainsi comme résultat : $${texNombre(this.reponse, 0)}$.
    `)
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
