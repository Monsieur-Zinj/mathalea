import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../../../lib/outils/ecritures'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'

export const titre = 'Déterminer un vecteur directeur avec une équation cartésienne'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '08/07/2022'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora avec Jean-Claude pour la partie interactive
 * Référence can2G17
 *
 */
export const uuid = 'dacc1'
export const ref = 'can2G17'
export const refs = {
  'fr-fr': ['can2G17'],
  'fr-ch': []
}
export default function VecteurDirEqCart () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur10 inline'
  this.listeAvecNumerotation = false
  this.nouvelleVersion = function () {
    const a = randint(-9, 9, 0)
    const b = randint(-9, 9, 0)
    const c = randint(-5, 5, 0)

    this.question = `Dans un repère, la droite $d$ a pour équation :
      $${rienSi1(a)}x${ecritureAlgebriqueSauf1(b)}y${ecritureAlgebrique(c)}=0$<br>
      Donner les coordonnées d'un vecteur directeur $\\vec{u}$ de la droite $d$.<br><br>`
    this.optionsChampTexte = { texteAvant: '$\\vec{u}$ a pour coordonnées :' }
    this.correction = `Si l'équation d'une droite $d$ est de la forme $ax+by+c=0$, on sait d'après le cours,<br>
      qu'un vecteur directeur $\\vec{u}$ de $d$ a pour coordonnées $\\vec{u}(-b\\,;\\,a)$.<br>
      Tout vecteur colinéaire à $\\vec{u}$ est aussi un vecteur directeur de $d$.<br>
      On en déduit que les coordonnées de $\\vec{u}$ sont $${miseEnEvidence('(')} ${miseEnEvidence(`${-b}`)}\\,${miseEnEvidence(';')}\\,${miseEnEvidence(`${a}`)} ${miseEnEvidence(')')}$.`
    this.reponse = `(${-b};${a})`

    this.canEnonce = this.question // 'Compléter'
    this.canReponseACompleter = ''
  }
}
