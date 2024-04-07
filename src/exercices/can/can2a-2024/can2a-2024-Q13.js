import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice, shuffle } from '../../../lib/outils/arrayOutils'
import { point, pointAdistance } from '../../../lib/2d/points.js'
import { polygoneAvecNom } from '../../../lib/2d/polygones.js'
import { afficheLongueurSegment } from '../../../lib/2d/codages.js'
import { codageAngle } from '../../../lib/2d/angles.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Calculer l\'aire d\'un triangle rectangle'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '1e8ea'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
  }

  nouvelleVersion () {
    this.optionsChampTexte = { texteApres: 'cm$^2$' }
    let tri
    if (this.canOfficielle) {
      const objets = []
      const A = point(0, 0)
      const B = pointAdistance(A, 4, 0) // triplet[1] sera la longueur c
      const C = pointAdistance(B, 3, 90) // triplet[0] sera la longueur a
      const pol = polygoneAvecNom(A, B, C) // donc triplet[2] sera la longueur b
      const lc = afficheLongueurSegment(B, A)
      const la = afficheLongueurSegment(C, B)
      const lb = afficheLongueurSegment(A, C)
      this.reponse = 6
      objets.push(pol[0], la, lb, lc, codageAngle(A, B, C))
      this.question = 'Aire du triangle <br>' + mathalea2d({ xmin: -1, xmax: 5, ymin: -1, ymax: 4, scale: 0.6, style: 'margin: auto' }, objets)
      this.correction = `L'aire est donnée par le produit des deux plus petits côtés divisé par $2$, soit : $\\dfrac{3\\times 4}{2}=${miseEnEvidence(this.reponse)}$ cm$^2$.`
      this.canReponseACompleter = ''
    } else {
      if (choice([true, false])) {
        tri = shuffle(['3', '4', '5'])
        this.reponse = 6
        this.correction = `L'aire est donnée par le produit des deux plus petits côtés divisé par $2$, soit : $\\dfrac{3\\times 4}{2}=${miseEnEvidence(this.reponse)}$ cm$^2$.`
      } else {
        tri = shuffle(['5', '12', '13'])
        this.reponse = 30
        this.correction = `L'aire est donnée par le produit des  deux plus petits côtés divisé par $2$, soit : $\\dfrac{5\\times 12}{2}=${miseEnEvidence(this.reponse)}$ cm$^2$.`
      }
      this.question = `Aire d'un triangle rectangle dont les côtés mesurent $${tri[0]}$ cm, $${tri[1]}$ cm et $${tri[2]}$ cm.`
      this.canReponseACompleter = '$ \\ldots$ cm$^2$'
    }
    this.canEnonce = this.question
  }
}
