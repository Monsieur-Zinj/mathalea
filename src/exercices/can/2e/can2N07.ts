import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Déterminer un terme dans une suite évolutive'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '14/04/2024'
export const uuid = '8bb40'
export const refs = {
  'fr-fr': ['can2N07'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class SuitesEv extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.formatChampTexte = 'largeur01 '
  }

  nouvelleVersion () {
    switch (choice([1, 2])) { //, 2, 3
      case 1:
        {
          const n = randint(10, 25)
          const choix = n
          this.reponse = String(2 * n)
          this.question = `Dans la suite évolutive « $2$, $4$, $6$, $8$, $\\ldots$ », quel est le $${choix}^{\\text{e}}$ nombre ?`

          this.canEnonce = this.question
          this.canReponseACompleter = ''
          this.correction = `Un terme de la suite peut s'exprimer sous la forme $2\\times n$ avec $n$ le rang du terme. <br>
          Par exemple, le $4^{\\text{e}}$ terme est $2\\times 4=8$.<br>
          Le $${choix}^{\\text{e}}$ nombre est donc $2\\times ${choix}=${miseEnEvidence(String(2 * n))}$.  `
        }
        break
      case 2 :
        {
          const n = randint(10, 25)
          const choix = n
          this.reponse = String(2 * n - 1)
          this.question = `Dans la suite évolutive « $1$, $3$, $5$, $7$, $\\ldots$ », quel est le $${choix}^{\\text{e}}$ nombre ?`

          this.canEnonce = this.question
          this.canReponseACompleter = ''
          this.correction = `Un terme de la suite peut s'exprimer sous la forme $2\\times n-1$ avec $n$ le rang du terme. <br>
            Par exemple, le $4^{\\text{e}}$ terme est $2\\times 4-1=7$.<br>
            Le $${choix}^{\\text{e}}$ nombre est donc $2\\times ${choix}-1=${miseEnEvidence(String(2 * n - 1))}$.  `
        }
        break
    }
  }
}
