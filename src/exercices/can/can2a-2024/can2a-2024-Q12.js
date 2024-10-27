import Exercice from '../../Exercice'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { texteParPosition } from '../../../lib/2d/textes'
import { droiteGraduee } from '../../../lib/2d/reperes.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Déterminer une abscisse'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'd734a'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    // this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(13, 5).texFraction
      this.question = 'Abscisse du point $A$<br>'
      this.question += mathalea2d({ xmin: -1, ymin: -1.5, xmax: 15, ymax: 1.5, scale: 0.7, style: 'margin: auto' }, texteParPosition('A', 5.5, 0.9, 'milieu', 'blue', 1.5), droiteGraduee({
        Unite: 7,
        Min: 1.8,
        Max: 3.2,
        x: 0,
        y: 0,
        thickSecDist: 1 / 5,
        thickSec: true,
        thickoffset: 0,
        axeStyle: '->',
        pointListe: [[13 / 5, '']],
        pointCouleur: 'blue',
        pointStyle: 'x',
        labelsPrincipaux: true,
        step1: 1,
        step2: 1
      }))
      this.correction = `L'abscisse du point $A$ est $\\dfrac{13}{5}=${miseEnEvidence('2,6')}$.`
    } else {
      if (choice([true, false])) {
        const a = choice([1, 3, 5, 6, 7, 9, 10, 11]) // numérateur
        const fracResultat = new FractionEtendue(a, 4)
        this.reponse = fracResultat.texFraction
        this.question = 'Determiner l\'abscisse du point $A$.<br>'
        this.question += mathalea2d({ xmin: -1, ymin: -1.5, xmax: 14, ymax: 1.5, scale: 0.6, style: 'margin: auto' }, texteParPosition('A', 3 * a / 4, 0.9, 'milieu', 'blue', 2), droiteGraduee({
          Unite: 3,
          Min: 0,
          Max: 3.2,
          x: 0,
          y: 0,
          thickSecDist: 1 / 4,
          thickSec: true,
          thickoffset: 0,
          axeStyle: '->',
          pointListe: [[a / 4, '']],
          pointCouleur: 'blue',
          pointStyle: 'x',
          labelsPrincipaux: true,
          step1: 1,
          step2: 1
        }))
        this.correction = `L'abscisse du point $A$ est $\\dfrac{${a}}{${4}}=${miseEnEvidence(texNombre(fracResultat.valeurDecimale, 2))}$.`
      } else {
        const a = choice([1, 2, 3, 4, 6, 7, 8, 9]) // numérateur
        const fracResultat = new FractionEtendue(a, 5)
        this.reponse = fracResultat.texFraction
        this.question = 'Determiner l\'abscisse du point $A$.<br>'
        this.question += mathalea2d({ xmin: -1, ymin: -1.5, xmax: 14, ymax: 1.5, scale: 0.6, style: 'margin: auto' }, texteParPosition('A', 3 * a / 5, 0.9, 'milieu', 'blue', 2), droiteGraduee({
          Unite: 3,
          Min: 0,
          Max: 3.2,
          x: 0,
          y: 0,
          thickSecDist: 1 / 5,
          thickSec: true,
          thickoffset: 0,
          axeStyle: '|->',
          pointListe: [[a / 5, '']],
          pointCouleur: 'blue',
          pointStyle: 'x',
          labelsPrincipaux: true,
          step1: 1,
          step2: 1
        }))
        this.correction = `L'abscisse du point $A$ est $\\dfrac{${a}}{${5}}=${miseEnEvidence(texNombre(fracResultat.valeurDecimale, 1))}$.`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
