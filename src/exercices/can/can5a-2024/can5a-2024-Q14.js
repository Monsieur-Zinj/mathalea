import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { droiteGraduee } from '../../../lib/2d/reperes'
import { mathalea2d } from '../../../modules/2dGeneralites'
import Decimal from 'decimal.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Déterminer une abscisse sur une droite graduée'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'f7b05'
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
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      const d = droiteGraduee({
        Unite: 3,
        Min: 0,
        Max: 3,
        x: 0,
        y: 0,
        thickDistance: 1,
        thickSec: true,
        thickSecDist: 0.25,
        thickOffset: 0,
        axeStyle: '->',
        pointListe: [[1.25, 'A']],
        pointCouleur: 'blue',
        pointStyle: 'x',
        labelsPrincipaux: true
      })
      this.reponse = '1.25'
      this.question = mathalea2d({
        xmin: -1,
        ymin: -1.5,
        xmax: 10,
        ymax: 1.5,
        scale: 0.6,
        style: 'margin: auto'
      }, d)
      this.question += '<br>L\'abscisse du point $A$ est : '
      this.correction = `Entre $0$ et $1$, il y a $4$ intervalles.<br>
      Une graduation correspond donc à $0,25$.<br>
      Ainsi, l'abscisse du point $A$ est : $${miseEnEvidence(texNombre(1.25))}$.`
    } else {
      const choix = choice([true, false])
      const a = new Decimal(choice(['0.25', '0.75', '1.25', '1.5', '1.75', '2.25', '2.75']))
      const b = new Decimal(randint(1, 14, [5, 10])).mul(2).div(10)
      const d = droiteGraduee({
        Unite: 3,
        Min: 0,
        Max: 3,
        x: 0,
        y: 0,
        thickDistance: 1,
        thickSec: true,
        thickSecDist: choix ? '0.25' : '0.2',
        thickOffset: 0,
        axeStyle: '->',
        pointListe: choix ? [[a, 'A']] : [[b, 'A']],
        pointCouleur: 'blue',
        pointStyle: 'x',
        labelsPrincipaux: true
      })
      this.reponse = choix ? a : b
      this.question = mathalea2d({
        xmin: -1,
        ymin: -1.3,
        xmax: 10,
        ymax: 1.2,
        scale: 0.6,
        style: 'margin: auto'
      }, d)
      this.question += '<br>L\'abscisse du point $A$ est : '
      this.correction = `Entre $0$ et $1$, il y a ${choix ? '$4$' : '$5$'} intervalles.<br>
      Une graduation correspond donc à ${choix ? '$0,25$' : '$0,2$'}.<br>
      Ainsi, l'abscisse du point $A$ est : ${choix ? `$${miseEnEvidence(texNombre(a, 2))}$` : `$${miseEnEvidence(texNombre(b))}$`}.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (!this.interactif) {
      this.question += ' $\\ldots$'
    }
  }
}
