import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'

export const titre = 'Calculer une distance à partir d\'une vitesse'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '92d99'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora (reprise du fichier de Jean-Claude Lhote 6ième)
 * Référence
*/
export default class vitesseCM2 extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.formatChampTexte = ''
    this.optionsChampTexte = { texteApres: ' km' }
    this.canOfficielle = false
  }

  nouvelleVersion () {
    let vitesse: number
    let duree:number

    if (this.canOfficielle) {
      vitesse = 60
      duree = 3
    } else {
      vitesse = choice([50, 60, 70, 80, 90, 110])
      duree = choice([2, 3, 4])
    }
    const distance = duree * vitesse

    this.question = `Une voiture roule à une vitesse de $${vitesse} \\text{ km/h}$.<br>`
    this.canEnonce = this.question
    this.question += `En $${String(duree)}$ h, elle parcourt `
    if (!this.interactif) {
      this.question += '$\\ldots\\ldots$ km'
    }
    this.canReponseACompleter = `En $${String(duree)}$ h, elle parcourt $\\ldots\\ldots$ km.`
    this.reponse = String(distance)
    this.correction = `En $${String(duree)}$ h, elle parcourt $${String(duree)}\\times ${String(vitesse)}\\text{ km}=${miseEnEvidence(texNombre(duree * vitesse, 0))}\\text{ km}$.<br>`
  }
}
