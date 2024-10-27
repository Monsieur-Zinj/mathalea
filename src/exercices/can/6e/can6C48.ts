import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import Decimal from 'decimal.js'
export const titre = 'Résoudre un problème d\'économie'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '06/04/2024'
export const uuid = 'b40d5'
export const refs = {
  'fr-fr': ['can6C48'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class problemeEconomie extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.optionsChampTexte = { texteApres: '€' }
    this.canOfficielle = true
    this.formatChampTexte = ''
  }

  nouvelleVersion () {
    const nbreL = randint(2, 5) * 10
    const eco = new Decimal(randint(2, 9))
    const ecoEuro = eco.div(100)
    this.reponse = eco.mul(nbreL).div(100).toFixed(2)
    this.question = `Dans la station A, le prix du litre d'essence est $${eco}$ centimes moins cher que dans la station B.<br>
    Quelle économie réalise-t-on en se servant dans la station A si on prend $${nbreL}$ litres ?`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ €'
    this.correction = `On  calcule l'économie par le produit du nombre de litres achetés par l'économie par litre réalisée. <br>
     Comme $${eco}$ centimes est égal à $${texNombre(ecoEuro, 2)}$ €, on obtient :<br> $${texNombre(ecoEuro, 2)}\\times ${nbreL}=${miseEnEvidence(texNombre(eco.mul(nbreL).div(100), 2))}$ €.
    `
  }
}
