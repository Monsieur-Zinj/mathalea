import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Effectuer une conversion d\'aires'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '6c739'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 2500
      this.question = '$25$ m$^2=$ '
      this.correction = `$1$ m$^2= 100$ dm$^2$, donc $25$ m$^2=25\\times 100$ dm$^2=${miseEnEvidence(texNombre(2500))}$ dm$^2$`
      this.canEnonce = 'Complète.'
      this.canReponseACompleter = '$25$ m$^2=\\ldots$ dm$^2$'
      if (!this.interactif) {
        this.question += ' $\\ldots$ dm$^2$'
      } else {
        this.optionsChampTexte = { texteApres: 'dm$^2$' }
      }
    } else {
      const a = randint(2, 9)
      const choix = choice(['a', 'b', 'c', 'd'])//
      if (choix === 'a') {
        this.reponse = a * 100
        this.question = `$${a}$ dm$^2=$`
        this.correction = `$1$ dm$^2= 100$ cm$^2$, donc $${a}$ dm$^2=${a}\\times 100$ cm$^2=${miseEnEvidence(a * 100)}$ cm$^2$.`
        this.canEnonce = 'Complète.'
        this.canReponseACompleter = `$${a}$ dm$^2=\\ldots$ cm$^2$`
        if (!this.interactif) {
          this.question += ' $\\ldots$ cm$^2$'
        } else {
          this.optionsChampTexte = { texteApres: 'cm$^2$' }
        }
      }
      if (choix === 'b') {
        this.reponse = a / 100
        this.question = `$${a}$ cm$^2=$`
        this.correction = `$1$ cm$^2= 0,01$ dm$^2$, donc $${a}$ cm$^2=${a}\\times 0,01$ dm$^2=${miseEnEvidence(texNombre(a / 100))}$ dm$^2$.`
        this.canEnonce = 'Complète.'
        this.canReponseACompleter = `$${a}$ cm$^2=\\ldots$ dm$^2$`
        if (!this.interactif) {
          this.question += '$\\ldots$ dm$^2$'
        } else {
          this.optionsChampTexte = { texteApres: 'dm$^2$' }
        }
      }
      if (choix === 'c') {
        this.reponse = a * 100
        this.question = `$${a}$ m$^2=$`
        this.correction = `$1$ m$^2= 100$ dm$^2$, donc $${a}$ m$^2=${a}\\times 100$ dm$^2=${miseEnEvidence(a * 100)}$ dm$^2$.`
        this.canEnonce = 'Complète.'
        this.canReponseACompleter = `$${a}$ m$^2= dm$^2$`
        if (!this.interactif) {
          this.question += '$\\ldots$ dm$^2$'
        } else {
          this.optionsChampTexte = { texteApres: 'dm$^2$' }
        }
      }
      if (choix === 'd') {
        this.reponse = a / 100
        this.question = `$${a}$ dm$^2=$`
        this.correction = `$1$ dm$^2= 0,01$ m$^2$, donc $${a}$ dm$^2=${a}\\times 0,01$ m$^2=${miseEnEvidence(texNombre(a / 100))}$ m$^2$.`
        this.canEnonce = 'Complète.'
        this.canReponseACompleter = `$${a}$ dm$^2=\\ldots$ m$^2$`
        if (!this.interactif) {
          this.question += '$\\ldots$ m$^2$'
        } else { this.optionsChampTexte = { texteApres: 'm$^2$' } }
      }
    }
  }
}
