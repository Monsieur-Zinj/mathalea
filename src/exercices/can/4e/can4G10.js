import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../deprecatedExercice.js'
import { propositionsQcm } from '../../../lib/interactif/qcm.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { Triangle } from '../../../modules/Triangle.js'
import { point } from '../../../lib/2d/points.js'
import { barycentre, polygone, polygoneAvecNom } from '../../../lib/2d/polygones.js'
import { rotation } from '../../../lib/2d/transformations.js'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites.js'
import { texteSurSegment } from '../../../lib/2d/codages.js'
import { sp } from '../../../lib/outils/outilString.js'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
export const titre = 'Déterminer si un triangle est rectangle'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'
export const dateDePublication = '01/10/2023'

/**
 * @author Jean-Claude  Lhote
 * Référence can4G10
 * Date de publication 1/10/2023
 */
export const uuid = '5344c'
export const refs = {
  'fr-fr': ['can4G10'],
  'fr-ch': []
}
export default function TripletsPythagoriciensOuPas () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const listeTripletsPythagoriciens = [
        [3, 4, 5],
        [5, 12, 13],
        [6, 8, 10],
        [8, 15, 17],
        [9, 12, 15],
        [12, 16, 20],
        [15, 20, 25]
      ]
      const listeTripletsNonPytagoriciens = [
        [3, 4, 6],
        [6, 12, 13],
        [5, 8, 10],
        [8, 15, 18],
        [9, 13, 15],
        [12, 16, 18],
        [15, 16, 25],
        [3, 5, 6],
        [5, 11, 13],
        [6, 9, 11],
        [8, 16, 20],
        [10, 13, 15],
        [12, 18, 20],
        [13, 15, 25]
      ]
      const choix = choice([true, false]) // rectangle ? ou pas
      const triplet = choix ? choice(listeTripletsPythagoriciens) : choice(listeTripletsNonPytagoriciens)
      const triangle = new Triangle()
      const nom = Array.from(triangle.nom)
      const scale = 4 / triplet[1]
      const A = point(0, 0)
      const B = point(triplet[0] * scale, 0)
      const C = point(triplet[0] * scale, triplet[1] * scale)
      const abc = polygone(A, B, C)
      const O = barycentre(abc)
      const tri = rotation(abc, O, randint(0, 360))
      const a = tri.listePoints[0]
      const b = tri.listePoints[1]
      const c = tri.listePoints[2]
      a.nom = nom[0]
      b.nom = nom[1]
      c.nom = nom[2]
      const poly = polygoneAvecNom(a, b, c)
      const longueurAB = texteSurSegment(String(triplet[0]), b, a, 'black', 0.5, true)
      const longueurBC = texteSurSegment(String(triplet[1]), c, b, 'black', 0.5, true)
      const longueurCA = texteSurSegment(String(triplet[2]), a, c, 'black', 0.5, true)
      const objets = [poly]
      objets.push(longueurCA, longueurAB, longueurBC)
      let texte = `Dans le triangle $${triangle.nom}$, `
      texte += `$${nom[0]}${nom[1]}=${triplet[0]}$${sp(1)}cm, $${nom[1]}${nom[2]}=${triplet[1]}$${sp(1)}cm et $${nom[0]}${nom[2]}=${triplet[2]}$.<br>Ce triangle est-il rectangle (La figure n'est pas forcément représentative) ?<br>`
      objets.push()
      const figure = mathalea2d(Object.assign({ scale: 0.6, style: 'display: inline;' }, fixeBordures(objets)), objets)
      texte += figure
      this.canEnonce = texte
      this.autoCorrection[i] = {
        enonce: texte,
        propositions: [
          {
            texte: 'Vrai',
            statut: choix === true
          },
          {
            texte: 'Faux',
            statut: choix === false
          }
        ]
      }
      const monQcm = propositionsQcm(this, i)
      if (this.interactif) {
        texte += monQcm.texte
      }
      let texteCorr = `Le plus grand côté du triangle est $[${nom[0]}${nom[2]}]$ et $${nom[0]}${nom[2]}^2=${triplet[2]}^2=${triplet[2] ** 2}$.<br>`
      texteCorr += `D'autre part, $${nom[0]}${nom[1]}^2+${nom[2]}${nom[1]}^2=${triplet[0]}^2+${triplet[1]}^2=${triplet[0] ** 2}+${triplet[1] ** 2}=${triplet[0] ** 2 + triplet[1] ** 2}$.<br>`
      texteCorr += choix
        ? `On constate que $${nom[0]}${nom[2]}^2=${nom[0]}${nom[1]}^2+${nom[2]}${nom[1]}^2$ donc, d'après la réciproque de la propriété de Pythagore, le triangle $${triangle.nom}$ est rectangle en $${nom[1]}$.`
        : `On constate que $${nom[0]}${nom[2]}^2\\neq ${nom[0]}${nom[1]}^2+${nom[2]}${nom[1]}^2$ donc le triangle $${triangle.nom}$ n'est pas rectangle en $${nom[1]}$.`
      texteCorr += choix ? '' : '<br>' + texteEnCouleur(`On aurait pu regarder uniquement la somme des chiffres des unités : $${(triplet[0] ** 2 % 10)}+${(triplet[1] ** 2) % 10}$ finit par  $${((triplet[0] ** 2 % 10) + ((triplet[1] ** 2) % 10)) % 10}$ qui n'est pas compatible avec $${(triplet[2] ** 2)}$`)

      if (this.questionJamaisPosee(i, triplet)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(monQcm.texte)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
