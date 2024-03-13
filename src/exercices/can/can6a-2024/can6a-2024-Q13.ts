import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { stringNombre, texPrix } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import Decimal from 'decimal.js'
import { prenom } from '../../../lib/outils/Personne'
import { sp } from '../../../lib/outils/outilString'
export const titre = 'Coût total'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '0f2c6'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Référence
*/
export default class CoutBDEtRomans extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.optionsChampTexte = { texteApres: '€' }
    this.formatChampTexte = 'largeur01'
    this.canOfficielle = true
  }

  nouvelleVersion () {
    let coutUnitaire:Decimal
    let nbBds: number
    let nbRomans: number
    let quidam: string
    if (this.canOfficielle) {
      quidam = 'Tom'
      coutUnitaire = new Decimal('6.50')
      nbBds = 6
      nbRomans = 4
    } else {
      quidam = prenom(1) as string
      coutUnitaire = new Decimal(randint(4, 6) * 10 + randint(1, 9)).div(10)
      nbBds = randint(2, 8)
      nbRomans = 10 - nbBds
    }
    this.reponse = coutUnitaire.mul(10).toFixed(0)
    this.question = `${quidam} achète ${stringNombre(nbBds, 0)} BD à ${stringNombre(coutUnitaire, 2, true)}€ ${sp(1)}l'unité et ${stringNombre(nbRomans, 0)} romans à ${stringNombre(coutUnitaire, 2, true)}€ ${sp(1)}l'unité.`
    this.canEnonce = this.question
    this.question += ' Il paye : '
    this.canReponseACompleter = 'Il paye $\\ldots$ €'
    this.correction = `Comme les BD et les romans coûtent le même prix à l'unité, on calcule le nombre d'ouvrages : $${stringNombre(nbBds, 0)}+${stringNombre(nbRomans, 0)}=10$<br>`
    this.correction += `puis on multiplie par le prix unitaire : $10\\times ${texPrix(coutUnitaire)}=${miseEnEvidence(this.reponse)}$€`
  }
}
