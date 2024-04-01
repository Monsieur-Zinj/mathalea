import { choice } from '../../../lib/outils/arrayOutils'
import { prenomF } from '../../../lib/outils/Personne'
import { texPrix } from '../../../lib/format/style'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Rechercher un prix unitaire'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can6C25
 * Date de publication 18/10/2021
*/
export const uuid = '81a00'
export const refs = {
  'fr-fr': ['can6C25'],
  'fr-ch': []
}
export default function RecherchePrix () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  this.optionsChampTexte = { texteApres: ' €' }
  this.nouvelleVersion = function () {
    const listeviennoiserie = [
      ['pains au chocolat', 'un pain au chocolat'],
      ['chocolatines', 'une chocolatine'], ['pains aux raisins', 'un pain aux raisins'], ['cookies', 'un cookie'], ['brioches', 'une brioche']]
    const a = randint(2, 6)
    const v = choice(listeviennoiserie)
    const p = v[0]
    const s = v[1]
    const t = choice([10, 20])
    const prenom1 = prenomF()
    const pu = choice([0.9, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6])
    this.question = `À la boulangerie, ${prenom1} achète $${a}$ ${p}.<br>
     Elle paie avec un billet de $${t}$ euros.<br>
     On lui rend $${texPrix(t - a * pu)}$ euros.<br>
     
    Quel est le prix d'${s} ?`
    this.correction = `${prenom1} achète $${a}$ ${p}. Comme on lui rend $${texPrix(t - a * pu)}$ euros sur son billet de $${t}$ euros,
    ses ${p} lui ont coûté : $${t}-${texNombre(t - a * pu)}=${texPrix(a * pu)}$ euros.<br>
    Le prix d'${s} est donc donné par :  $${texNombre(a * pu)}\\div ${a}=${texPrix(pu)}$ euros. `
    this.reponse = pu
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ €'
  }
}
