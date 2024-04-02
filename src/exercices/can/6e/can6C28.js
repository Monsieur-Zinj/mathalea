import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Résoudre un problème de fraction'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora & Jean-Claude Lhote
 * Référence can6C26
 * Date de publication 21/10/2021
*/
export const uuid = '2ce71'
export const ref = 'can6C28'
export const refs = {
  'fr-fr': ['can6C28'],
  'fr-ch': []
}
export default function PetitsProblemeDeFraction () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = choice([12, 24, 36, 48])
    const b = choice([15, 20, 25, 30, 35, 40, 45])
    const N = choice(['quart', 'tiers', 'cinquième', 'sixième'])
    switch (N) {
      case 'cinquième':
        this.reponse = calculANePlusJamaisUtiliser(0.8 * b)
        this.question = `J'ai mangé le ${N} d'un paquet de gâteaux qui contenait $${b}$ gâteaux. <br>
      Combien en reste-t-il ?`
        this.correction = `$\\dfrac{1}{5}\\times ${b}=${texNombre(b / 5)}$.<br>
      Il en reste donc $${b}-${texNombre(b / 5)}=${this.reponse}$`
        break
      case 'quart':
        this.reponse = calculANePlusJamaisUtiliser(0.75 * a)
        this.question = `J'ai mangé le ${N} d'un paquet de gâteaux qui contenait $${a}$ gâteaux. <br>
      Combien en reste-t-il ?`
        this.correction = `$\\dfrac{1}{4}\\times ${a}=${texNombre(a / 4)}$.<br>
      Il en reste donc $${a}-${texNombre(a / 4)}=${this.reponse}$`
        break
      case 'tiers':
        this.reponse = calculANePlusJamaisUtiliser((2 * a) / 3)
        this.question = `J'ai mangé le ${N} d'un paquet de gâteaux qui contenait $${a}$ gâteaux. <br>
      Combien en reste-t-il ?`
        this.correction = `$\\dfrac{1}{3}\\times ${a}=${texNombre(a / 3)}$.<br>
      Il en reste donc $${a}-${texNombre(a / 3)}=${this.reponse}$`
        break
      case 'sixième':
        this.reponse = calculANePlusJamaisUtiliser((5 * a) / 6)
        this.question = `J'ai mangé le ${N} d'un paquet de gâteaux qui contenait $${a}$ gâteaux. <br>
      Combien en reste-t-il ?`
        this.correction = `$\\dfrac{1}{6}\\times ${a}=${texNombre(a / 6)}$.<br>
      Il en reste donc $${a}-${texNombre(a / 6)}=${this.reponse}$`
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
