import Exercice from '../../Exercice'
import { randint } from '../../../modules/outils'
import { numberCompare } from '../../../lib/interactif/comparisonFunctions'
import { Grille } from '../../../lib/2d/reperes'
import { Point } from '../../../lib/2d/points'
import { Polygone } from '../../../lib/2d/polygones'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../../modules/2dGeneralites'
import { texteParPoint } from '../../../lib/2d/textes'
import { miseEnEvidence } from '../../../lib/outils/embellissements'

export const titre = 'Déterminer l\'aire  d\'un trapèze rectangle en ua'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '693b3'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Référence
*/
export default class AireTrapezeRectangle extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.formatChampTexte = 'largeur01'
    this.optionsChampTexte = { texteApres: ' ua' }
    this.canOfficielle = false
    this.compare = numberCompare
  }

  nouvelleVersion () {
    let hauteur: number
    let grandeBase: number
    let petiteBase: number
    if (this.canOfficielle) {
      hauteur = 2
      grandeBase = 5
      petiteBase = 3
    } else {
      hauteur = randint(1, 2) * 2
      grandeBase = randint(2 + hauteur, 6 + hauteur)
      petiteBase = Math.random() < 0.5 ? grandeBase - (hauteur / 2) : grandeBase - hauteur
    }

    const grille = new Grille(0, 0, grandeBase + 2, hauteur + 2, 'gray', 1, 1)
    const A = new Point(1, 1)
    const B = new Point(1 + grandeBase, 1)
    const C = new Point(1 + petiteBase, 1 + hauteur)
    const D = new Point(1, 1 + hauteur)
    const trapeze = new Polygone([A, B, C, D])
    const unite = new Polygone([
      new Point(grandeBase + 2, hauteur + 2),
      new Point(grandeBase + 2, hauteur + 1),
      new Point(grandeBase + 1, hauteur + 1),
      new Point(grandeBase + 1, hauteur + 2)],
    'black', 'none', 'black'
    )
    unite.epaisseur = 2
    unite.hachures = 'checkerboard'
    trapeze.epaisseur = 2
    trapeze.couleurDeRemplissage = colorToLatexOrHTML('gray')
    const figureA = texteParPoint('Figure A', new Point(2, 0.5), 0, 'black', 1, 'gauche')
    const ua = texteParPoint('1 ua', new Point(grandeBase + 1.5, hauteur + 0.5), 0, 'black', 1, 'milieu')
    const objets = [grille, trapeze, figureA, unite, ua]
    this.question = 'Quelle est l\'aire de la figure A en unités d\'aire (ua) ?<br>'
    this.question += mathalea2d(Object.assign({ scale: 0.5 }, fixeBordures(objets)), objets)
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ ua'
    this.reponse = ((petiteBase + grandeBase) * hauteur / 2).toFixed(0)
    this.correction = `On commence par compter le nombre de carreaux entier, puis on ajoute les carreaux qui se complètent. <br>
    L'aire de la figure A est égale à $${miseEnEvidence(this.reponse)}$ ua.`
  }
}
