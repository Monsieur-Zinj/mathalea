import { choice } from '../../../lib/outils/arrayOutils'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Passer du coefficient multiplicateur au taux d’évolution'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '09/12/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export const uuid = '031f0'
export const ref = 'can2C11'
export const refs = {
  'fr-fr': ['can2C11'],
  'fr-ch': []
}
export default function CoeffTaux () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let taux, coeff

    switch (choice(['a', 'b', 'b'])) { //, 'b', 'b'
      case 'a':
        taux = choice([randint(1, 9) * 10, randint(1, 9), randint(1, 9) * 10 + randint(1, 9)])
        coeff = calculANePlusJamaisUtiliser(1 + taux / 100)
        this.question = `Le taux d'évolution associé à un coefficient multiplicateur de $${texNombre(coeff)}$ est `
        if (!this.interactif) {
          this.question += '.... '
        }
        this.optionsChampTexte = { texteApres: ' %' }
        this.correction = `Multiplier par $${texNombre(coeff)}$ revient à multiplier par $1+\\dfrac{${texNombre(taux)}}{100}$. <br>
        Cela revient donc à augmenter de $${taux}${sp(1)}\\%$. <br>
        Ainsi, le taux d'évolution associé au coefficient multiplicateur $${texNombre(coeff)}$ est $+${texNombre((coeff - 1) * 100)}${sp(1)}\\%$.<br><br>
        Autre formulation :<br>
        Multiplier une valeur par $${texNombre(coeff)}$ revient à en prendre  $${texNombre(coeff * 100)}${sp(1)}\\%$.<br>
        Cela signifie  qu'on l'augmente de $${texNombre(coeff * 100 - 100)}${sp(1)}\\%$ car $100${sp(1)}\\% +${texNombre(coeff * 100 - 100)}${sp(1)}\\%=${texNombre(coeff * 100)}${sp(1)}\\%$.<br>
        Le taux d'évolution est donc $${miseEnEvidence('+')} ${miseEnEvidence(`${taux}${sp(1)}`)} \\%$.`
        this.reponse = taux
        break
      case 'b':
        taux = choice([randint(1, 9) * 10, randint(1, 9), randint(1, 9) * 10 + randint(1, 9)])
        coeff = calculANePlusJamaisUtiliser(1 - taux / 100)
        this.question = `Le taux d'évolution associé à un coefficient multiplicateur de $${texNombre(coeff)}$ est `
        if (!this.interactif) {
          this.question += '.... '
        }
        this.optionsChampTexte = { texteApres: ' %' }
        this.correction = `Multiplier par $${texNombre(coeff)}$ revient à multiplier par $1-\\dfrac{${texNombre(taux)}}{100}$. <br>
        Cela revient donc à diminuer de  $${taux}${sp(1)}\\%$. <br>
        Ainsi, le taux d'évolution associé au coefficient multiplicateur $${texNombre(coeff)}$ est $${texNombre((coeff - 1) * 100)}${sp(1)}\\%$<br><br>
        Autre formulation :<br>
        Multiplier une valeur par $${texNombre(coeff)}$ revient à en prendre  $${texNombre(coeff * 100)}${sp(1)}\\%$.<br>
        Cela signifie  qu'on la diminue de $${texNombre(100 - coeff * 100)}${sp(1)}\\%$ car $100${sp(1)}\\%-${texNombre(100 - coeff * 100)}${sp(1)}\\% =${texNombre(coeff * 100)}${sp(1)}\\%$.<br>
        Le taux d'évolution est donc $${miseEnEvidence('-')} ${miseEnEvidence(`${taux}${sp(1)}`)} \\%$.`
        this.reponse = -taux
        break
    }
    this.canEnonce = 'Compléter.'
    this.canReponseACompleter = `Le taux d'évolution associé à un coefficient multiplicateur de $${texNombre(coeff)}$ est $\\ldots$ $\\%$ `
  }
}
