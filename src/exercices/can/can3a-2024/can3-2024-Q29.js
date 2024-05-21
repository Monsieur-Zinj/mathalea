import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { labelPoint, latexParCoordonnees } from '../../../lib/2d/textes'
import { mathalea2d } from '../../../modules/2dGeneralites'
import { segment } from '../../../lib/2d/segmentsVecteurs'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { texNombre } from '../../../lib/outils/texNombre'
import { point } from '../../../lib/2d/points'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'

export const titre = 'Compléter un schéma avec un nombre '
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '4dc1d'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteAvant: '? $=$' }
    this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
    this.canOfficielle = false
  }

  nouvelleVersion () {
    const A = point(0, 0, '', 'below')
    const B = point(3, 0, '', 'below')
    const segAB = segment(A, B)
    segAB.styleExtremites = '->'
    const a = this.canOfficielle ? 2 : randint(1, 5) * 2
    const k = this.canOfficielle ? new FractionEtendue(3, 2) : new FractionEtendue(choice([3, 5, 7, 9, 11]), 2)

    this.reponse = k.texFraction
    this.question = ' Complète. <br>'
    this.question += mathalea2d({ xmin: -1.6, ymin: -1, xmax: 5, ymax: 1, pixelsParCm: 30, scale: 0.7 }, labelPoint(A, B),
      latexParCoordonnees(this.interactif ? '\\times\\text{ ?}' : '\\times \\ldots', 1.5, 0.5, 'black', 1, 20, '', 8),
      latexParCoordonnees(`\\fbox{ ${a} }`, -0.7, 0, 'black', 1, 20, '', 8), segAB,
      latexParCoordonnees(`\\fbox{ ${texNombre(k * a, 0)} }`, 3.7, 0, 'black', 1, 20, '', 8)
    )
    this.correction = `Le nombre qui multiplié par $${a}$ donne $${texNombre(k * a, 0)}$ est  $${miseEnEvidence(texNombre(k, 1))}$.
     `

    this.canEnonce = ' Complète.'
    this.canReponseACompleter = mathalea2d({ xmin: -1.6, ymin: -1, xmax: 5, ymax: 1, pixelsParCm: 30, scale: 0.7 }, labelPoint(A, B),
      latexParCoordonnees(this.interactif ? '\\times\\text{ ?}' : '\\times \\ldots', 1.5, 0.5, 'black', 1, 20, '', 8),
      latexParCoordonnees('\\fbox{ 2 }', -0.7, 0, 'black', 1, 20, '', 8), segAB,
      latexParCoordonnees('\\fbox{ 3 }', 3.7, 0, 'black', 1, 20, '', 8)
    )
  }
}
