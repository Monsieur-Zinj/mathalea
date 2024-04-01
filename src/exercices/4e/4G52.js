import { tracePoint } from '../../lib/2d/points.js'
import { labelPoint } from '../../lib/2d/textes.ts'
import { degSin, radians } from '../../lib/mathFonctions/trigo.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { arete3d, point3d } from '../../modules/3d.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'

export const titre = 'Exercice de repérage dans un pavé droit'

export const dateDeModifImportante = '03/05/2023'

/**
 * Un point est situé dans un pavé découpé suivant les trois axes, on doit donner ses coordonnées
 * @author Arnaud Durand et Jean-Claude Lhote
 * Référence 4G52
 * publié 9/06/2021
 * Ajout d'un paramètre permettant de choisir entre placer un point et lire ses coordonnées
 */
export const uuid = '9c916'
export const refs = {
  'fr-fr': ['4G52'],
  'fr-ch': []
}
export default function ReperagePaveDroit () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Dans le repère $(A;I;J;K)$ :'
  this.nbQuestions = 3
  this.tailleDiaporama = 2

  this.besoinFormulaireNumerique = ['Angle de la perspective', 3, '1 : 30°\n2 : 45°\n3 : 60°']
  this.sup = 1

  this.besoinFormulaire2Numerique = ['Type de questions', 3, '1 : Placer un point\n2 : Lire les coordonnées\n3 : Mélange']
  this.sup2 = 1

  this.nouvelleVersion = function () { // c'est ici que les données sont relatives
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.introduction = '' // consigne avant les question y mettre le dessin + texte

    const hauteur = 12
    const largeur = 12
    const profondeur = 12
    if (parseInt(this.sup) === 3) {
      context.anglePerspective = 60
      context.coeffPerspective = 0.4
    } else if (parseInt(this.sup) === 2) {
      context.anglePerspective = 45
      context.coeffPerspective = 0.3
    } else if (parseInt(this.sup) === 1) {
      context.anglePerspective = 30
      context.coeffPerspective = 0.4
    }
    const A = point3d(0, 0, 0, true, 'A', 'below left')
    const B = point3d(largeur, 0, 0, true, 'B', 'below right')
    const C = point3d(largeur, profondeur, 0, true, 'C', 'above right')
    const D = point3d(0, profondeur, 0, true, 'D', 'above left')
    const E = point3d(0, 0, hauteur, true, 'E', 'above left')
    const F = point3d(largeur, 0, hauteur, true, 'F', 'above right')
    const G = point3d(largeur, profondeur, hauteur, true, 'G', 'above right')
    const H = point3d(0, profondeur, hauteur, true, 'H', 'above left')

    const objetsAtracer = []
    let nbgraduationx = randint(2, 4)
    let nbgraduationy = randint(2, 3)
    let nbgraduationz = randint(2, 4)
    while ((nbgraduationx >= 3) && (nbgraduationy >= 3)) {
      nbgraduationx = randint(2, 5)
      nbgraduationy = randint(2, 3, nbgraduationx)
      nbgraduationz = randint(2, 5, [nbgraduationx, nbgraduationy])
    }
    const deltax = largeur / nbgraduationx
    const deltay = profondeur / nbgraduationy
    const deltaz = hauteur / nbgraduationz
    const I = point3d(deltax, 0, 0, true, 'I', 'below right')
    const J = point3d(0, deltay, 0, false, 'J', 'above left')
    const K = point3d(0, 0, deltaz, true, 'K', 'left')

    objetsAtracer.push(labelPoint(A, B, C, D, E, F, G, H, I, J, K))

    for (let i = 0; i <= nbgraduationy; i++) {
      for (let j = 0, M, N, s; j <= nbgraduationz; j++) {
        M = point3d(0, i * deltay, j * deltaz)
        N = point3d(largeur, i * deltay, j * deltaz)

        if ((i === 0) || (j === nbgraduationz)) {
          s = arete3d(M, N, 'black', true)
        } else {
          s = arete3d(M, N, 'black', false)
        }
        objetsAtracer.push(s.c2d)
      }
    }
    for (let i = 0; i <= nbgraduationx; i++) {
      for (let j = 0, M, N, s; j <= nbgraduationz; j++) {
        M = point3d(i * deltax, 0, j * deltaz)
        N = point3d(i * deltax, profondeur, j * deltaz)
        if ((i === nbgraduationx) || (j === nbgraduationz)) {
          s = arete3d(M, N, 'black', true)
        } else {
          s = arete3d(M, N, 'black', false)
        }
        objetsAtracer.push(s.c2d)
      }
    }

    for (let i = 0, M, N, s; i <= nbgraduationx; i++) {
      M = point3d(i * deltax, 0, 0)
      N = point3d(i * deltax, 0, hauteur)
      s = arete3d(M, N, 'black', true)
      objetsAtracer.push(s.c2d)
      M = point3d(i * deltax, profondeur, 0)
      N = point3d(i * deltax, profondeur, hauteur)
      if (i < nbgraduationx) {
        s = arete3d(M, N, 'black', false)
      } else {
        s = arete3d(M, N, 'black', true)
      }
      objetsAtracer.push(s.c2d)
    }
    for (let i = 1, M, N, s; i < nbgraduationy; i++) {
      M = point3d(0, i * deltay, 0)
      N = point3d(0, i * deltay, hauteur)
      s = arete3d(M, N, 'black', false)
      objetsAtracer.push(s.c2d)
      M = point3d(largeur, i * deltay, 0)
      N = point3d(largeur, i * deltay, hauteur)
      s = arete3d(M, N, 'black', true)
      objetsAtracer.push(s.c2d)
    }

    let typesDeQuestionsDisponibles = ['placer', 'lire']
    if (this.sup2 === 1) typesDeQuestionsDisponibles = ['placer']
    if (this.sup2 === 2) typesDeQuestionsDisponibles = ['lire']
    const listeTypesDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)

    for (let i = 0, texte, texteCorr, cpt = 0, pointCoord, s1, s2, s3, x, y, z, t, pointAplacer, objetsAtracerCorr; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      x = 0
      y = 0
      z = 0
      while ((x === 0 && y === 0 && z === 0) || (x + y + y === 1)) {
        x = randint(0, nbgraduationx)
        y = randint(0, nbgraduationy)
        z = randint(0, nbgraduationz)
      }
      pointCoord = [x, y, z]
      pointAplacer = point3d(pointCoord[0] * deltax, pointCoord[1] * deltay, pointCoord[2] * deltaz, lettreDepuisChiffre(i + 12), `${lettreDepuisChiffre(i + 12)}`, 'below right')
      s1 = arete3d(A, point3d(pointAplacer.x, 0, 0), 'blue', true)
      s2 = arete3d(point3d(pointAplacer.x, 0, 0), point3d(pointAplacer.x, pointAplacer.y, 0), 'green', true)
      s3 = arete3d(point3d(pointAplacer.x, pointAplacer.y, 0), pointAplacer, 'red', true)
      s1.c2d.epaisseur = 3
      s2.c2d.epaisseur = 3
      s3.c2d.epaisseur = 3
      t = tracePoint(pointAplacer, 'red')
      t.epaisseur = 2
      t.taille = 6
      objetsAtracerCorr = [s1.c2d, s2.c2d, s3.c2d, t, labelPoint(pointAplacer)].concat(objetsAtracer)
      if (listeTypesDeQuestions[i] === 'placer') {
        texte = `Placer le point $${lettreDepuisChiffre(i + 12)}$ de coordonnées $(${pointCoord[0]};${pointCoord[1]};${pointCoord[2]})$.`
        texteCorr = mathalea2d({
          xmin: -1,
          xmax: 1 + largeur + profondeur * Math.cos(radians(context.anglePerspective)),
          ymin: -1,
          ymax: 1 + hauteur + profondeur * context.coeffPerspective * degSin(context.anglePerspective),
          scale: 0.6,
          style: 'display: block; margin-top:20px;'
        }, objetsAtracerCorr)
        texteCorr += `<br>$${lettreDepuisChiffre(i + 12)}$ de coordonnées $(${miseEnEvidence(pointCoord[0], 'blue')};${miseEnEvidence(pointCoord[1], 'green')};${miseEnEvidence(pointCoord[2], 'red')})$.<br>`
      } else {
        texte = `Donner les coordonnées du point $${lettreDepuisChiffre(i + 12)}$`
        objetsAtracer.push(tracePoint(pointAplacer, 'blue'), labelPoint(pointAplacer))
        texteCorr = mathalea2d({
          xmin: -1,
          xmax: 1 + largeur + profondeur * Math.cos(radians(context.anglePerspective)),
          ymin: -1,
          ymax: 1 + hauteur + profondeur * context.coeffPerspective * degSin(context.anglePerspective),
          scale: 0.6,
          style: 'display: block; margin-top:20px;'
        }, objetsAtracerCorr)
        texteCorr += `<br>Le point $${lettreDepuisChiffre(i + 12)}$ a pour coordonnées $(${miseEnEvidence(pointCoord[0], 'blue')};${miseEnEvidence(pointCoord[1], 'green')};${miseEnEvidence(pointCoord[2], 'red')})$.`
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    this.introduction = (context.vue === 'diap' ? '<center>' : '') + mathalea2d({
      xmin: -1,
      xmax: 1 + largeur + (profondeur * context.coeffPerspective) * Math.cos(radians(context.anglePerspective)),
      ymin: -1,
      ymax: 1 + hauteur + profondeur * context.coeffPerspective * degSin(context.anglePerspective),
      scale: 0.6,
      style: 'display: block; margin-top:20px;'
    }, objetsAtracer) + (context.vue === 'diap' ? '</center>' : '')
    listeQuestionsToContenu(this)
  }
}
