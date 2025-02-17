import { texPrix } from '../../../lib/format/style'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Utiliser une proportionnalité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6P01
 */
export const uuid = '6de10'
export const ref = 'can6P01'
export const refs = {
  'fr-fr': ['can6P01'],
  'fr-ch': []
}
export default function ProportionnaliteSimple () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.optionsChampTexte = { texteApres: ' €' }
  const fruits = [
    ['pêches', 4, 10, 30],
    ['noix', 5, 4, 13],
    ['cerises', 6, 11, 20],
    ['pommes', 2, 20, 40],
    ['framboises', 15, 1, 5],
    ['fraises', 7, 5, 10],
    ['citrons', 1.5, 15, 30],
    ['bananes', 1.5, 15, 25]
  ]
  this.nouvelleVersion = function () {
    const a = randint(0, 7)
    const b = fruits[a][1]
    const c = randint(fruits[a][2], fruits[a][3])
    this.reponse = calculANePlusJamaisUtiliser(c / 5 * b)
    this.question = `$${texNombre(c / 10)}$ kg de ${fruits[a][0]} coûtent $${texNombre(c / 10 * b)}$ €,
    combien coûtent $${texNombre(c / 5)}$ kg de ${fruits[a][0]} ?`
    this.correction = `On reconnaît une situation de proportionnalité.<br>
    La masse de ${fruits[a][0]} est proportionnelle au prix payé.<br>
    On remarque qu'on demande le prix pour une quantité double ($${texNombre(c / 5)}=2\\times ${texNombre(c / 10)}$).<br>
    Ainsi, le prix à payer pour $${texNombre(c / 5)}$ kg de ${fruits[a][0]} est :  $${texNombre(c / 10 * b)} \\times 2 = ${texPrix(this.reponse)}$ €`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ €'
  }
}
