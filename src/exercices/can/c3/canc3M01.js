import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { context } from '../../../modules/context.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Trouver la bonne unité'
export const dateDePublication = '5/11/2021'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
/*!
 * @author Jean-Claude Lhote
 * Créé le 4/11/2021
 * Référence canc3M01
 */
export const uuid = 'd0314'
export const ref = 'canc3M01'
export const refs = {
  'fr-fr': ['canc3M01'],
  'fr-ch': []
}
export default function TrouverLaBonneUnite () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.typeExercice = 'simple'
  this.formatInteractif = 'texte'
  this.formatChampTexte = 'largeur01 inline ' + KeyboardType.alphanumeric
  this.nouvelleVersion = function () {
    const prefixes = [[10, 'd'], [100, 'c'], [1000, 'm'], [10, 'da'], [100, 'h'], [1000, 'k']]
    const unite = choice(['g', 'm', 'L'])
    const typeDeQuestion = randint(0, 5)
    const a = randint(1, 9)
    switch (typeDeQuestion) {
      case 0:
      case 1:
      case 2:
        this.question = `Compléter avec l'unité qui convient : <br>$${a}$ ${unite} $= ${texNombre(a * prefixes[typeDeQuestion][0])}$ ${this.interactif ? '' : '$\\ldots$'}`
        this.reponse = `${prefixes[typeDeQuestion][1]}${unite}`
        this.correction = `$${a}$ ${unite} $= ${texNombre(a * prefixes[typeDeQuestion][0])}$ ${prefixes[typeDeQuestion][1]}${unite}`
        this.canEnonce = 'Compléter avec l\'unité qui convient. '
        this.canReponseACompleter = `$${a}$ ${unite} $= ${texNombre(a * prefixes[typeDeQuestion][0])}$ $\\ldots$`
        break
      case 3:
      case 4:
      case 5:
        this.question = `Compléter avec l'unité qui convient : <br>$${a}$ ${unite} $= ${texNombre(a / prefixes[typeDeQuestion][0])}$ ${this.interactif ? '' : '$\\ldots$'}`
        this.reponse = `${prefixes[typeDeQuestion][1]}${unite}`
        this.correction = `$${a}$ ${unite} $= ${texNombre(a / prefixes[typeDeQuestion][0])}$ ${prefixes[typeDeQuestion][1]}${unite}`
        this.canEnonce = 'Compléter avec l\'unité qui convient.'
        this.canReponseACompleter = `$${a}$${unite} $= ${texNombre(a * prefixes[typeDeQuestion][0])}$ $\\ldots$`
        break
    }
  }
  if (context.isAmc) {
    this.autoCorrection = [
      {
        enonce: this.question,
        propositions: [
          {
            texte: this.correction,
            statut: 0,
            feedback: ''
          }
        ]
      }
    ]
  }
}
